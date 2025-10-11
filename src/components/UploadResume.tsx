import { useRef, useState } from "react";
import { Button, Card } from "antd";
import { extractTextFromFile } from "../utils/extractText";
import { resumeData } from "../utils/resumeData";
import { v4 as uuidv4 } from 'uuid';
import { addCandidate } from "../store/candidatesSlice";
import type { Candidate, ChatMessage } from "../types";
import { addChatMessage, createSession } from "../store/sessionSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";


const UploadResume = ({startInterview}: {startInterview: (interviewId: string , candidateId: string) => void}) => {

      const [error, setError] = useState<string>('');
        const [uploading, setUploading] = useState(false);

        const dispatch = useAppDispatch();
const inputRef = useRef<HTMLInputElement>(null);


        const handleFileInput = async(e: React.ChangeEvent<HTMLInputElement>) => {
          setUploading(true);
            try {
              const file = e.target.files?.[0];
            if (!file) {
                return;
            }
            const ans = await extractTextFromFile(file)
            // console.log(ans);
            const dataFromResume = await resumeData(ans)
            console.log(dataFromResume)

            const candidateId = uuidv4();
            const interviewId = uuidv4();
            
            const missingFields = [];
            if (!dataFromResume.name) missingFields.push('name');
            if (!dataFromResume.email) missingFields.push('email');
            if (!dataFromResume.phone) missingFields.push('phone');

            const candidate: Candidate = {
              id: candidateId,
              name: dataFromResume.name || '',
              email: dataFromResume.email || '',
              phone: dataFromResume.phone || '',
              resumeFileName: file.name,
              resumeContent: ans,
              status: 'pending',
              createdAt: new Date().toLocaleDateString(),
            };

            dispatch(addCandidate(candidate));


            const sessionData = {
              candidateId,
              interviewId,
              chatHistory: [],
              currentStep: missingFields.length > 0 ? 'info-collection' as const : 'interview' as const,
              missingFields,
              isActive: true,
              showWelcomeBack: false,
            };

            dispatch(createSession(sessionData));

            const welcomeMessage: ChatMessage = {
              id: uuidv4(),
              type: 'system',
              content: missingFields.length > 0 
                ? `Welcome! I've processed your resume. I need some additional information before we can start the interview. Please provide: ${missingFields.join(', ')}`
                : `Welcome! I've processed your resume successfully. Let's start the interview!`,
              timestamp: new Date().toLocaleTimeString(),
            };

            dispatch(addChatMessage(welcomeMessage));

            if (missingFields.length === 0) {
              console.log('starting interview')
              startInterview(interviewId , candidateId);
            }
            setError('');
            
            // uploadFile(file);
            } catch (err: any) {
              setError(err.message);
              if (inputRef.current) {
              inputRef.current.value = '';
            }
            }
                        setUploading(false);

          }
        

       

  return (
    <>
    <Card  className="shadow-lg p-6 rounded-lg text-center w-96">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Crisp</h2>
        <p className="text-gray-600">Let's start by uploading your resume</p>

        <Button
        //   onClick={() => handleFile}
          disabled={uploading}
        className="mt-4"
        >
          <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.docx"
          ref={inputRef}
          onChange={handleFileInput}
          disabled={uploading}
        />
          {
            uploading ? 'Uploading...' : 'Choose File'
          }
        </Button>
        {
          error && <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        }
  </Card>
   
    </>
  )
}

export default UploadResume