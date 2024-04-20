from db_utils import pinecone


def get_similiar_docs(query, k=3, score=False):
    if score:
        similar_docs = pinecone.similarity_search_with_score(query, k=k)
    else:
        similar_docs = pinecone.similarity_search(query, k=k)
    return similar_docs
