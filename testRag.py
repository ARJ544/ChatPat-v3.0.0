from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from google.genai.types import EmbedContentConfig
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb

chroma_client = chromadb.PersistentClient(path="./chroma_data")


load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Extract Text from PDF:
def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            full_text += page.extract_text()
        return full_text
    except Exception as e:
        return f"An error occurred: {e}"

pdf_file = "./acknowledgementSlip_rajeev.pdf"  
extracted_txt_content = extract_text_from_pdf(pdf_file)

if "An error occurred" not in extracted_txt_content:
    print("Extracted Text:")
    # print(extracted_txt_content)
else:
    print(extracted_txt_content)
##############################################################

# split the extracted text into chunks 
def chunk_text(text, chunk_size=50, chunk_overlap=20):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,      
        chunk_overlap=chunk_overlap,
        add_start_index=True,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = splitter.split_text(text)
    return chunks
txt_after_chunk_array = chunk_text(extracted_txt_content)

# print(txt_after_chunk_array)

##############################################################

### Embedding the Chunks :

embedding_dim = 768

embeddings = []
for chunk in txt_after_chunk_array:
    response = client.models.embed_content( 
        model="gemini-embedding-001",
        contents=[types.Part.from_text(text=chunk)],
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=embedding_dim
        ),
    )
    embeddings.append(response)

# print("embedding: ")
# print(embeddings)

# if hasattr(test_embeddings, "embeddings") and test_embeddings.embeddings is not None:
#     pass
    # print(len(test_embeddings.embeddings))
    # print(test_embeddings.embeddings) 

# print("test_embeddings:", test_embeddings)

##############################################################

# Create ChromaDB Collection:
collection = chroma_client.get_or_create_collection(name="gemini_docs")


##############################################################


# Insert data into ChromaDB












##############################################################





#################################################
# Testing the API
# client = genai.Client(api_key=api_key)

# response = client.models.generate_content(
#     model="gemini-2.0-flash-lite",
#     contents=["HI!"]
# )
# print(response.text)
##################################################
