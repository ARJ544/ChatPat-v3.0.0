from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from google.genai.types import EmbedContentConfig
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb



load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Extract Text from PDF:
# def extract_text_from_pdf(pdf_path):
#     try:
#         reader = PdfReader(pdf_path)
#         full_text = ""
#         for page_num in range(len(reader.pages)):
#             page = reader.pages[page_num]
#             full_text += page.extract_text()
#         return full_text
#     except Exception as e:
#         return f"An error occurred: {e}"

# pdf_file = "./acknowledgementSlip_rajeev.pdf"  
# extracted_txt_content = extract_text_from_pdf(pdf_file)

# if "An error occurred" not in extracted_txt_content:
#     print("Extracted Text:")
#     # print(extracted_txt_content)
# else:
#     print(extracted_txt_content)
# ##############################################################

# # split the extracted text into chunks 
# def chunk_text(text, chunk_size=50, chunk_overlap=20):
#     splitter = RecursiveCharacterTextSplitter(
#         chunk_size=chunk_size,      
#         chunk_overlap=chunk_overlap,
#         add_start_index=True,
#         length_function=len,
#         separators=["\n\n", "\n", " ", ""]
#     )
#     chunks = splitter.split_text(text)
#     return chunks
# txt_after_chunk_array = chunk_text(extracted_txt_content)

# # print(txt_after_chunk_array)

# ##############################################################

# ### Embedding the Chunks :

# embedding_dim = 768

# embeddings = []
# for chunk in txt_after_chunk_array:
#     response = client.models.embed_content( 
#         model="gemini-embedding-001",
#         contents=[types.Part.from_text(text=chunk)],
#         config=types.EmbedContentConfig(
#             task_type="RETRIEVAL_DOCUMENT",
#             output_dimensionality=embedding_dim
#         ),
#     )
#     embeddings.append(response)


# processed_embeddings = [
#     e.embeddings[0].values for e in embeddings
# ]
# print(processed_embeddings)


# if hasattr(test_embeddings, "embeddings") and test_embeddings.embeddings is not None:
#     pass
    # print(len(test_embeddings.embeddings))
    # print(test_embeddings.embeddings) 

# print("test_embeddings:", test_embeddings)

##############################################################

# Create ChromaDB Collection:
chroma_client = chromadb.PersistentClient(path="./chroma_data")

collection = chroma_client.get_or_create_collection(
    name="gemini_docs",
    metadata={"source": "acknowledgementSlip_rajeev.pdf"}
)

##############################################################


# Insert data into ChromaDB

# ids = [f"chunk_{i}" for i in range(len(txt_after_chunk_array))]

# collection.add(
#     ids=ids,
#     documents=txt_after_chunk_array,
#     embeddings=processed_embeddings,
#     metadatas=[{"chunk_index": i} for i in range(len(txt_after_chunk_array))]
# )

##############################################################
# Query gemini
query_text = "What is srn number "
query_response = client.models.embed_content(
    model="gemini-embedding-001",
    contents=[types.Part.from_text(text=query_text)],
    config=types.EmbedContentConfig(
        task_type="RETRIEVAL_QUERY",
        output_dimensionality=768
    ),
)

# Check if embedding was successful
if query_response and query_response.embeddings and len(query_response.embeddings) > 0:
    query_embedding = query_response.embeddings[0].values
    
    # Ensure query_embedding is a list of floats
    if query_embedding is not None:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3
        )
        # print("Query results:", results["documents"])
    else:
        print("Query embedding is None")
else:
    print("Failed to generate query embedding")
    print("Response:", query_response)

#################################################



#################################################
# Testing the API
client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.0-flash-lite",
    contents=[f"This is my q:{query_text} tell me from this context: {results['documents']}"]
)
print(response.text)
##################################################
