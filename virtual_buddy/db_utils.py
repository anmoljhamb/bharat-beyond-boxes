import os

from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

from secret import PINECONE_API_KEY, PINECONE_INDEX_NAME

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["PINECONE_INDEX_NAME"] = PINECONE_INDEX_NAME

model_name = "avsolatorio/GIST-Embedding-v0"
model_kwargs = {"device": "cpu"}
encode_kwargs = {"normalize_embeddings": True}
model = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs,
)


index_name = str(PINECONE_INDEX_NAME)
pc = Pinecone(api_key=PINECONE_API_KEY)

pinecone = PineconeVectorStore.from_documents(
    [],
    model,
    index_name=index_name,
)
