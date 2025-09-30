
import {GoogleGenAI} from '@google/genai'
import axios from 'axios';

const genai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
})

// export const generateQuestion = async (stage: string) => {
//     console.log("Generating question for stage:", stage);
//     const response = await genai.models.generateContent({
//         model: 'gemini-2.0-flash-001',
//         contents: `You are an AI interviewer for a Full Stack (React/Node.js) role. 
// Generate ONE new ${stage} level interview question. 
// Do not repeat previous ones. 
// Return ONLY the question in JSON: { "question": "..." }.
// `
//     })

//     let jsonText = response.text || `{
//         "name": "",
//         "email": "",
//         "phone": ""
//     }`;

//   // Strip Markdown ```json ``` wrapper if present
//   jsonText = jsonText.replace(/```json|```/g, "").trim();


//     const json = JSON.parse(jsonText)
//     return json.question
// }


export const generateQuestion = async (stage: string) => {
  try {
    const res = await axios.post("http://localhost:3001/api/chat", { prompt: `You are an AI interviewer for a Full Stack (React/Node.js) role. 
Generate ONE new ${stage} level interview question. 
Do not repeat previous ones. 
Return ONLY the question in JSON: { "question": "..." }.
`
  });
  const data = await res.data;
  console.log(data);
  return data.question;
  } catch (error) {
    throw new Error('Failed to generate question' + error);
  }
};