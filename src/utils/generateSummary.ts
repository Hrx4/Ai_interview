
// import {GoogleGenAI} from '@google/genai'
import type { Question } from '../types'
import axios from 'axios';
import { backendUrl } from './backend';

// const genai = new GoogleGenAI({
//     apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
// })

//Gemini response

// export const generateSummary = async (questions: Question[]) => {
//   try {

//     const formattedQuestions = questions
//       .map((q, index) => `${index + 1}. Q: ${q.question}\n   A: ${q.answer || 'No answer provided'}`)
//       .join('\n\n');


//      const response = await genai.models.generateContent({
//         model: 'gemini-2.0-flash-001',
//         contents: `You are an interview evaluator for a Full Stack (React/Node.js) role.

//          Evaluate the following answers. For each answer:
//          - Score from 0–10.
//          - Provide one line feedback.

//          Finally:
//          - Calculate total score out of 60.
//          - Write a short summary (2–3 sentences) of the candidate’s performance.

//          Questions and Answers:
//          ${formattedQuestions}

//              Return ONLY the Summary and score in JSON: { "summary": "...", "score": ... }.

//          `
//     })

//     let jsonText = response.text || `{
//         "summary": "LLM error",
//         "score": "0",
//     }`;

//     jsonText = jsonText.replace(/```json|```/g, "").trim();


//     const json = JSON.parse(jsonText)
//     return json
//     // return response.text || 'No summary available.'
//   } catch (error) {
//     throw new Error('Failed to generate summary');
//   }
// }


//OLLAMA response

export const generateSummary = async (questions: Question[]) => {
  try {


    const res = await axios.post(`${backendUrl}api/summary`, {
                  questions: questions
                });
  const data = await res.data;
  if(res.status !== 200){
    throw new Error(data.error || 'Failed to generate summary');
  }
  console.log(data);
  return data;
  } catch (error) {
    throw new Error('Failed to generate summary');
  }
};