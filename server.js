import { GoogleGenAI } from "@google/genai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


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
