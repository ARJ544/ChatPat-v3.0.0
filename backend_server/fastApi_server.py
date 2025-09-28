from fastapi import FastAPI,File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from google import genai
from google.genai.errors import ClientError
from google.genai import types
import os
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb

# Load apiKey from .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allowed origins
    allow_credentials=True,           # Allow cookies, authentication headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, PUT, DELETE...)
    allow_headers=["*"],              # Allow all headers
)

# Extract Text from PDF Function
def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        full_text = ""

        if len(reader.pages) == 0:
            print("PDF has no pages")
            return ""

        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text = page.extract_text()
            if text:
                full_text += text

        print(f"Number of pages in PDF: {len(reader.pages)}")

        return full_text

    except Exception as e:
        return None


# Split the extracted text into Chunks using LangChain
def chunk_text(text, chunk_size=300, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,      
            chunk_overlap=chunk_overlap,
            add_start_index=True,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    try:   
        if len(text.strip()) == 0:
            print("Extracted text is empty")
            return {"error": "Extracted text is empty"}
        else:
            chunks = splitter.split_text(text.replace("\n", " "))
            print(f"Number of chunks created: {len(chunks)}")
            return chunks
    except Exception as e:
        return {"error": f"An error occurred during text chunking: {e}"}
    

# Embedding the Chunks With Gemini-Embedding-Model
def embed_text(txt_after_chunk_array):
    if len(txt_after_chunk_array) == 0:
            print("No text chunks to embed")
            return {"success": False, "error": "No text chunks to embed"}
    else:
        try:
            embedding_dim = 768 # increase the dimension to increase the quality

            embeddings = []
            for chunk in txt_after_chunk_array:
                response = client.models.embed_content( 
                    model="gemini-embedding-001",
                    contents=[chunk],
                    config=types.EmbedContentConfig(
                        task_type="RETRIEVAL_DOCUMENT",
                        output_dimensionality=embedding_dim
                    ),
                )
                embeddings.append(response)

            # processed_embeddings contains the floating number(VECTORS)
            processed_embeddings = [
                e.embeddings[0].values for e in embeddings
            ]
            print(f"Number of embeddings created: {len(processed_embeddings)}")
            return processed_embeddings
        
        except ClientError as e:
            return {"error": f"An error occurred during embedding: {e.message}"}


# Embed User query/promt with Gemini
def embed_query(query_text):
    if len(query_text.strip()) == 0:
        return {"success": False, "error": "Query is Empty"}
    
    else:
        try:
            query_response = client.models.embed_content(
                model="gemini-embedding-001",
                contents=[query_text],
                config=types.EmbedContentConfig(
                    task_type="RETRIEVAL_QUERY",
                    output_dimensionality=768
                ),
            )
            return {"success": True, "embedding": query_response.embeddings[0].values}
        except ClientError as e:
                return {"success": False, "error": f"Query embedding failed: {e.message}"}


@app.post("/extract")
async def extract(file: UploadFile = File(...), userName: str = Form(...)):
    if file.content_type not in ["application/pdf", "application/octet-stream"]:
        return JSONResponse(
            status_code=400,
            content={"error": "Only PDF files are allowed."}
        )
    try:
        extracted_txt = extract_text_from_pdf(file.file)
        if not extracted_txt:
            return JSONResponse(
                status_code=400,
                content={"error": "Extraction Failed. PDF is empty or unreadable."}
            )
            
        txt_after_chunk_array = chunk_text(extracted_txt)
        if not txt_after_chunk_array:
            return JSONResponse(
                status_code=400,
                content={"error": "Text chunking failed or resulted in no chunks."}
            )
        processed_embeddings = embed_text(txt_after_chunk_array)
        
        chroma_client = chromadb.PersistentClient(path="./chroma_data")

        collection = chroma_client.get_or_create_collection(
            name="DocumentsCollection",
            metadata={"source": "ARJ's"}
        )

        ids = [f"{file.filename}_chunk_{i}" for i in range(len(txt_after_chunk_array))]

        collection.upsert(
            ids=ids,
            documents=txt_after_chunk_array,
            embeddings=processed_embeddings,
            metadatas=[{"chunk_index": i, "Source": file.filename, "UserName": userName} for i in range(len(txt_after_chunk_array))]
        )

        return JSONResponse(
            status_code=200,
            content={"status": "success", "message": "File processed and stored successfully"}
        )

    except Exception as e:
        return JSONResponse(
        status_code=500,
        content={"error": f"An unexpected error occurred: {e}"}
    )



@app.post("/generate")
async def generate(query: str = Form(...), userName: str = Form(...)):
    if (userName == ""):
        return JSONResponse(status_code=400, content={"error": "No username"})
    chroma_client = chromadb.PersistentClient(path="./chroma_data")
    collection = chroma_client.get_or_create_collection(
        name="DocumentsCollection",
        metadata={"source": "ARJ's"}
    )
    
    query_response = embed_query(query)
    
    if not query_response["success"]:
        return JSONResponse(status_code=400, content={"error": query_response["error"]})
    
    embedded_query = query_response["embedding"]
    results = collection.query(
            query_embeddings=[embedded_query],
            where = {"UserName": userName},
            n_results=4
    )
    
    question = f"This is my question:`{query}`. If question is about difference then use tabular form\n"
    context = f"Tell me from this context: `{results['documents']}`.\n"
    exeption = f"If there is nothing you get from context then tell about that then use your own mind to answer. \n"
    source = f"Remember to lastly mention only `Source` from {results['metadatas']}. If you used your own mind then mention `Source: None`"
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[f"{question} {context} {exeption} {source}"]
        )
        # print(response.text)
        return JSONResponse(
            status_code=200,
            content={"response": response.text}
        )
    except Exception as e:
        if hasattr(e, "message") and "model is overloaded" in str(e.message):
            return JSONResponse(
                status_code=503,
                content={"error": "The model is overloaded. Please try again later."}
            )
        elif "model is overloaded" in str(e):
            return JSONResponse(
                status_code=503,
                content={"error": "The model is overloaded. Please try again later."}
            )
        else:
            return JSONResponse(
                status_code=500,
                content={"error": f"An error occurred during content generation: {e}"}
            )
            

if __name__ == "__main__":
    uvicorn.run("fastApi_server:app", host="127.0.0.1", port=8000, reload=True)