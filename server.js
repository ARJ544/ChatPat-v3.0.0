// DO NOT USE THIS FILE. IT IS VERY BADLY WRITTEN AND PACKAGAES ARE NOT BETTER THAN PYTHON's

import { GoogleGenAI } from "@google/genai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import PDFParser from "pdf2json";
import { EmbeddingModel, FlagEmbedding } from "fastembed";
dotenv.config({ quiet: true });

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function ChunkText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""],
  });
  return splitter.splitText(text);
}

var fileName = "./pdfs/physics9.pdf"

var extractedText = ""
const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", async (pdfData) => {
  // Extract text from the PDF data
  extractedText = pdfParser.getRawTextContent();
  console.log("Extracted Text:", extractedText.substring(0, 500)); // Print first 500 characters

  // Chunk the extracted text
  const chunks = await ChunkText(extractedText);
  console.log("Number of Chunks:", chunks.length);
  console.log("Chunk:", chunks);

  // Process each chunk with the AI model
  // const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
  var embeddings = [];

  // // for (var chunk of chunks) {
  //   const response = await ai.models.embedContent({
  //       model: 'gemini-embedding-001',
  //       contents: chunks[0],
  //       config:{outputDimensionality: 768},
  //       taskType: 'RETRIEVAL_DOCUMENT'

  //   });
  //   embeddings.push(response.embeddings);
  // // }
  // console.log("Embedding Response:", embeddings);
  const embeddingModel = await FlagEmbedding.init({
    model: EmbeddingModel.BGEBaseEN
  });

  

  const embeddingss = embeddingModel.embed(chunks, 1); //Optional batch size. Defaults to 256

  for await (const batch of embeddingss) {
    // batch is list of Float32 embeddings(number[][]) with length 2
    console.log(batch);
  }

});

pdfParser.loadPDF(fileName);







const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
console.log("API Key:", process.env.GEMINI_API_KEY);


app.post("/generate", async (req, res) => {

  try {


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
