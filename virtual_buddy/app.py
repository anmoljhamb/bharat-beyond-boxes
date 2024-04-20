import logging
import os

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts.chat import (
    AIMessagePromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI

from secret import OPENAI_API_KEY
from utils import get_similiar_docs

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

QUERY = logging.WARNING + 5
RESPONSE = logging.WARNING + 6
# logging.addLevelName(QUERY, "QUERY")
# logging.addLevelName(RESPONSE, "RESPONSE")
# logging.basicConfig(
#     filename="chat_logs.log",
#     level=logging.WARNING,
#     datefmt="%d-%m-%Y %H:%M:%S",
#     format="%(asctime)s %(levelname)s %(message)s",
# )

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.2
)

# template = """ *Travel Buddy: Your Itinerary Assistant*

# I'm your one-stop shop for crafting the perfect travel itinerary! Tell me about
# your dream trip, and I'll help you build a personalized plan that considers
# your interests, travel style, and budget.

# *Here's how I can help:*

# * *Destination Inspiration:* Can't decide where to go? Let me know your
# preferences (beach vacation, cultural exploration, adventure travel, etc.) and
# I'll suggest destinations that might be a perfect fit. * *Itinerary Building:*
# Once you have a destination in mind, provide details like trip duration, travel
# dates, and budget. I'll create a daily itinerary with must-see attractions,
# hidden gems, transportation options, and restaurant recommendations. *
# *Activity Planning:* Whether you're a history buff or a thrill-seeker, I can
# suggest activities that align with your interests. From museums and historical
# sites to hiking trails and adrenaline-pumping adventures, I'll curate a diverse
# range of options. * *Logistics Support:* Need help finding flights,
# accommodation, or local transportation? I can provide links and resources to
# streamline your booking process.

# *Let's get started! Ask me anything related to travel, and I'll be your
# resourceful companion throughout your trip planning journey.*

# """

# # Context for the AI model
# context = """ You are a travel itinerary assistant powered by AI. Your goal is
# to assist users in planning their dream vacations by creating personalized
# itineraries that cater to their interests, travel style, and budget. You have
# access to a vast database of travel information, including destinations,
# attractions, activities, transportation options, and accommodation.

# When responding to user queries, prioritize providing clear, concise, and
# informative answers. Leverage your knowledge base to suggest relevant
# destinations, activities, and resources, while remaining flexible and adaptable
# to user preferences. """

# system_message_prompt = SystemMessagePromptTemplate.from_template(template + context)

# example_human = HumanMessagePromptTemplate.from_template(
#     """Question: I'm planning a 10-day trip to Italy in August. I'm interested
#     in a mix of historical sites and outdoor activities. What kind of itinerary
#     can you create for me?"""
# )

# example_ai = AIMessagePromptTemplate.from_template(
#     """Answer: Great! A 10-day trip to Italy in August sounds fantastic. Here's
#     a possible itinerary that incorporates historical sites and outdoor
#     activities:

# * *Days 1-3:* Explore Rome, the Eternal City. Visit the Colosseum, the Trevi
# Fountain, the Vatican Museums, and St. Peter's Square. Take a day trip to
# Pompeii and Herculaneum, ancient Roman cities frozen in time by volcanic ash. *
# *Days 4-5:* Travel north to Florence, the birthplace of the Renaissance. Admire
# the magnificent Duomo cathedral and explore the Uffizi Gallery, housing
# masterpieces by Michelangelo and Da Vinci. Hike or bike through the scenic
# Tuscan countryside, visiting charming villages and vineyards. * *Days 6-8:*
# Head south to Naples and embark on a day trip to Mount Vesuvius, the active
# volcano responsible for Pompeii's destruction. Explore the Amalfi Coast, a
# string of picturesque seaside towns with stunning views. Hike the Path of the
# Gods, a breathtaking coastal trail offering panoramic vistas. * *Days 9-10:*
# Relax and soak up the sun in Capri, a luxurious island known for its grottos,
# beaches, and upscale shops.

# This is just a suggestion, of course. I can tailor it further based on your
# specific interests and preferences. Would you like to know more about any of
# the destinations or activities mentioned? """
# )

# human_template = "{input}"
# human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

# chat_prompt = ChatPromptTemplate.from_messages(
#     [
#         system_message_prompt,
#         example_human,
#         example_ai,
#         human_message_prompt,
#         MessagesPlaceholder(variable_name="history"),
#     ]
# )

# buffer_memory = ConversationSummaryBufferMemory(
#     llm=llm, max_token_limit=100, return_messages=True
# )

# conversation = ConversationChain(
#     memory=buffer_memory,
#     llm=llm,
#     verbose=True,
#     prompt=chat_prompt,
# )

# ------------------------------------------------
from db_utils import pinecone

retriever = pinecone.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={'score_threshold': 0.8, 'k':2}
)

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch

query_transform_prompt = ChatPromptTemplate.from_messages(
    [
        MessagesPlaceholder(variable_name="messages"),
        (
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
        ),
    ]
)

query_transforming_retriever_chain = RunnableBranch(
    (
        lambda x: len(x.get("messages", [])) == 1,
        # If only one message, then we just pass that message's content to retriever
        (lambda x: x["messages"][-1].content) | retriever,
    ),
    # If messages, then we pass inputs to LLM chain to transform the query, then pass to retriever
    query_transform_prompt | llm | StrOutputParser() | retriever,
).with_config(run_name="chat_retriever_chain")

from langchain.chains.combine_documents import create_stuff_documents_chain

question_answering_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Answer the user's questions based on the below context:\n\n{context}",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

document_chain = create_stuff_documents_chain(llm, question_answering_prompt)
from langchain_core.runnables import RunnablePassthrough


conversational_retrieval_chain = RunnablePassthrough.assign(
    context=query_transforming_retriever_chain,
).assign(
    answer=document_chain,
)
from langchain.memory import ChatMessageHistory
demo_ephemeral_chat_history = ChatMessageHistory()

# --------------
# demo_ephemeral_chat_history.add_user_message("What are different places to visit in Rajasthan?")

# response = conversational_retrieval_chain.invoke(
#     {"messages": demo_ephemeral_chat_history.messages},
# )

# demo_ephemeral_chat_history.add_ai_message(response["answer"])

# response['answer']

# ------------------------------------------------


def askQuery(query: str):
    demo_ephemeral_chat_history.add_user_message(query)
    # context = get_similiar_docs(query)
    # response = conversation.predict(input=f"Context:\n {context} \n\n Query:\n{query}")
    response = conversational_retrieval_chain.invoke(
    {"messages": demo_ephemeral_chat_history.messages})
    return response['answer']


@app.route("/")
def home():
    return "Hello World from Bharat Beyond Boxes"


@app.route("/chat", methods=["POST"])
@cross_origin()
def chat():
    data = request.json
    if data:
        query = data["query"]
        response = askQuery(query)
        logging.log(QUERY, query)
        logging.log(RESPONSE, response)
        return jsonify(
            {
                "response": response,
            }
        )


@app.route("/generatePdf", methods=["POST"])
@cross_origin()
def generatePdf():
    data = request.json
    if data:
        city = data["query"]
        queries = [
            f"About {city}",
            f"What even is UPI?",
            f"How to get a local sim card?",
            f"What are some tourist spots in {city}",
            f"What are some food spots in {city}",
            f"What can I expect the fare prices to be in {city}?",
            f"What various options do I have for travel in {city}?",
            f"What budget should I expect? in {city}",
            f"What are some helpline numbers for {city}",
            f"What are cultural considerations that I should consider while travelling in {city}?",
        ]
        guideBook = {}
        for query in queries:
            guideBook[query] = askQuery(query)
        return jsonify(guideBook)
    return "not found"


if __name__ == "__main__":
    app.run(debug=True, port=8080)
