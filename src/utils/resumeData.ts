
import {GoogleGenAI} from '@google/genai'
import axios from 'axios';

const genai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
})

// export const resumeData = async (text: string) => {
//     const response = await genai.models.generateContent({
//         model: 'gemini-2.0-flash',
//         contents: `You are a resume parser. Extract the following fields from the resume text:

// - Full Name
// - Email
// - Phone number

// Return the result in valid JSON format with keys: name, email, phone.

// Resume:
// ${text}
// `
//     })

// let jsonText = response.text || `{
//         "name": "",
//         "email": "",
//         "phone": ""
//     }`;

//   // Strip Markdown ```json ``` wrapper if present
//   jsonText = jsonText.replace(/```json|```/g, "").trim();


//     const json = JSON.parse(jsonText)
//     return json
// }

export const resumeData = async (text: string) => {
  const res = await axios.post("http://localhost:3001/api/chat", {prompt: `You are a resume parser. Extract the following fields from the resume text:

- Full Name
- Email
- Phone number

Return the result in valid JSON format with keys: name, email, phone.

Resume:
${text}
`})
  const data = await res.data;
  console.log(data);
  return data;
};