import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const evalutionValidator = z.object({
  summary: z.string(),
  score: z.number(),
});

const questionValidator = z.object({
  question: z.string(),
});

const resumeValidator = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

app.post("/api/chat", async (req, res) => {
  const { stage } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: `You are an AI interviewer for a Full Stack (React/Node.js) role.
                    Your task is to generate technical interview questions appropriate to a candidate’s level.
                    Always return the output strictly as a JSON object with the following key: question.
                    Never include any explanations or additional text.
                    Do not repeat previous questions.`,
        },
        {
          role: "user",
          content: `Generate ONE new ${stage}-level interview question.`,
        },
      ],
      response_format: zodResponseFormat(questionValidator , "question"),
    });
    console.log(
      "LLM response:",
      JSON.parse(response.choices[0].message.content)
    );

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/summary", async (req, res) => {

  const questionsSchema = z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        answer: z.string().optional(),
      })
    )
  })
  
  const questions = questionsSchema.parse(req.body).questions

  const formattedQuestions = questions.map((q, index) => `${index + 1}. Q: ${q.question}\n   A: ${q.answer || 'No answer provided'}`)
        .join('\n\n');

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: `You are an interview evaluator for a Full Stack (React/Node.js) role.
                    Your job is to assess a candidate’s answers and provide objective scoring.
                    Always return output strictly in JSON format:
                    with the following keys: summary, score.
                    Do not include any other text or explanations.`,
        },
        {
          role: "user",
          content: `Evaluate the following answers. For each answer:
                    - Score from 0–10.
                    - Provide one-line feedback.

                    Finally:
                    - Calculate total score out of 60.
                    - Write a short 2–3 sentence summary of the candidate’s performance.

                    Questions and Answers:
                    ${formattedQuestions}`,
        },
      ],
      response_format: zodResponseFormat(evalutionValidator , "evalution"),
    });
    console.log(
      "LLM response:",
      JSON.parse(response.choices[0].message.content)
    );

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/resume", async (req, res) => {
  const { resume } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract the following fields from the resume text:

        - Full Name
        - Email
        - Phone number

        Return the result in valid JSON format with keys: name, email, phone`,
        },
        {
          role: "user",
          content: `Resume: ${resume}`,
        },
      ],
      response_format: zodResponseFormat(resumeValidator, "resume"),
    });
    console.log(
      "LLM response:",
      JSON.parse(response.choices[0].message.content)
    );

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
