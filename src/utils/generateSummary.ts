
import {GoogleGenAI} from '@google/genai'
import type { Question } from '../types'
import axios from 'axios';

const genai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
})

// export const generateSummary = async (questions: Question[]) => {
//     const response = await genai.models.generateContent({
//         model: 'gemini-2.0-flash-001',
//         contents: `You are an interview evaluator for a Full Stack (React/Node.js) role.

//         Evaluate the following answers. For each answer:
//         - Score from 0–10.
//         - Provide one line feedback.

//         Finally:
//         - Calculate total score out of 60.
//         - Write a short summary (2–3 sentences) of the candidate’s performance.

//         Questions and Answers:
//         ${
//         questions.map((q , index)=>(
//             `${index+1}. Q: ${q.question} 
//             A: ${q.answer}`
//             ))
//             }
//         `
//     })

    
//     return response.text || 'No summary available.'
// }




export const generateSummary = async (questions: Question[]) => {
  try {

    const formattedQuestions = questions
      .map((q, index) => `${index + 1}. Q: ${q.question}\n   A: ${q.answer || 'No answer provided'}`)
      .join('\n\n');

    const res = await axios.post('http://localhost:3001/api/summary', {
   prompt: `You are an interview evaluator for a Full Stack (React/Node.js) role.

        Evaluate the following answers. For each answer:
        - Score from 0–10.
        - Provide one line feedback.

        Finally:
        - Calculate total score out of 60.
        - Write a short summary (2–3 sentences) of the candidate’s performance.

        Questions and Answers:
        ${formattedQuestions}

            Return ONLY the Summary and score in JSON: { "summary": "...", "score": ... }.

        ` 
  });
  const data = await res.data;
  console.log(data);
  return data;
  } catch (error) {
    throw new Error('Failed to generate summary');
  }
};