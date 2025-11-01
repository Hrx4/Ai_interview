
// import {GoogleGenAI} from '@google/genai'
import axios from 'axios';
import { backendUrl } from './backend';

// const genai = new GoogleGenAI({
//     apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
// })

//Gemini response

// export const generateQuestion = async (stage: string) => {
//     try {
//       console.log("Generating question for stage:", stage);
//     const response = await genai.models.generateContent({
//         model: 'gemini-2.0-flash-001',
//         contents: `You are an AI interviewer for a Full Stack (React/Node.js) role. 
// Generate ONE new ${stage} level interview question. 
// Do not repeat previous ones. 
// Return ONLY the question in JSON: { "question": "..." }.
// `
//     })

//     let jsonText = response.text || `{
//         "question": ""
//     }`;

//   // Strip Markdown ```json ``` wrapper if present
//   jsonText = jsonText.replace(/```json|```/g, "").trim();


//     const json = JSON.parse(jsonText)
//     return json.question
//     } catch (error) {
//       throw new Error('Failed to generate question' + error);
//     }
// }


//OLLAMA response
export const generateQuestion = async (stage: string) => {
  try {
    const res = await axios.post(`${backendUrl}api/chat`, { stage: stage
  });
  const data = await res.data;
  if(res.status !== 200){
    throw new Error(data.error || 'Failed to generate summary');
  }
  console.log(data);
  return data.question;
  } catch (error) {
    throw new Error('Failed to generate question' + error);
  }
};