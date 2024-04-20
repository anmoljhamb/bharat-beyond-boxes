import concurrent.futures
import math
import os
import time

from langchain.text_splitter import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, PodSpec

from secret import PINECONE_API_KEY, PINECONE_INDEX_NAME

MAX_WORKERS = 2
PINECONE_ENV = "gcp-starter"

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["PINECONE_INDEX_NAME"] = PINECONE_INDEX_NAME

print("Creating the model.")
model_name = "avsolatorio/GIST-Embedding-v0"
model_kwargs = {"device": "cpu"}
# set True to compute cosine similarity
encode_kwargs = {"normalize_embeddings": True}
model = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs,
)
print("Created the model.")

index_name = str(PINECONE_INDEX_NAME)
pc = Pinecone(api_key=PINECONE_API_KEY)

if len(pc.list_indexes().names()) > 0:
    print("Deleting the exisiting index.")
    pc.delete_index(index_name)

print("Creating the index.")
pc.create_index(
    name=index_name,
    dimension=768,
    metric="cosine",
    spec=PodSpec(
        environment=str(PINECONE_ENV),
    ),
)
print("Created the index.")


def process_md():
    print("Processing the md_data")
    markdown_path = "./data/destination_dataset.md"

    with open(markdown_path, "r") as file:
        markdown_data = file.read()

    headers_to_split_on = [
        (
            str("##"),
            str("Destinations"),
        ),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on, strip_headers=False
    )
    md_header_splits = markdown_splitter.split_text(markdown_data)

    # Char-level splits

    chunk_size = 1000
    chunk_overlap = 300
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    print("Processed the md_data")
    splits = text_splitter.split_documents(md_header_splits)
    return splits


def upload_splits(splits, index):
    PineconeVectorStore.from_documents(
        splits,
        model,
        index_name=index_name,
    )
    print(f"Uploaded the split {index}")


def distribute_splits(data: list):
    global MAX_WORKERS
    MAX_WORKERS = min(len(data), MAX_WORKERS)
    print(f"data.length = {len(data)}")
    splits = []
    jump = math.ceil(len(data) / MAX_WORKERS)
    for i in range(0, len(data), jump):
        splits.append(data[i : i + jump])
    print(f"splits.length = {len(splits)}")
    print(f"splits[0].length = {len(splits[0])}")
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(upload_splits, split, i) for i, split in enumerate(splits)
        ]
        for i, future in enumerate(futures):
            if future.exception() is not None:
                print(
                    f"uploading the split {i} failed due to exception",
                    future.exception(),
                )


def main():
    md_splits = process_md()
    init_time = time.time()
    distribute_splits(md_splits)
    total_time = time.time() - init_time
    print(f"Total Time taken to upload the data: {total_time}")


if __name__ == "__main__":
    main()
    print("Completed!")
