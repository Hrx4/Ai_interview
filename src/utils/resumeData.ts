
import axios from 'axios';
import { backendUrl } from './backend';

//OLLAMA response

export const resumeData = async (text: string) => {
  const res = await axios.post(`${backendUrl}api/resume`, {
                  resume: text
                });

  const data = await res.data;
  if(res.status !== 200){
    throw new Error(res.data.error || 'Failed to generate summary');
  }
  console.log(data);
  return data;
};