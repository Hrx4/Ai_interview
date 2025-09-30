import { Button, Input } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";
import { useAppSelector as useSelector } from '../hooks/useAppSelector';
import Timer from "./Timer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { updateInterview, updateQuestion } from "../store/interviewsSlice";
import ResumeModal from "./ResumeModal";


interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentQuestion?: {
    id: string;
    question: string;
    timeLimit: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  // onTimeUp: (message:string) => void;
  isTimerActive: boolean;
  disabled?: boolean;
  error: string;
  setError: (error: string) => void;
  handleRetry: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentQuestion,
  // onTimeUp,
  isTimerActive,
  disabled = false,
  error,
  setError,
  handleRetry
}) =>  {
  const dispatch = useAppDispatch();

const session = useSelector(state => state.session.currentSession);
  const interviews = useSelector(state => state.interviews.interviews);
  const currentInterview = session ? interviews.find(i => i.id === session.interviewId) : null;
  


    const [inputValue, setInputValue] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [resumeModal , setResumeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


   const handleSubmit = useCallback(() => {
    if ( !disabled) {
      onSendMessage(inputValue.trim()||'');
      setInputValue('');
      console.log(currentQuestion)
    }
  },[disabled,inputValue,onSendMessage]);

  const onPause =(timeLimit:number)=>{
    setIsPaused(!isPaused);
    dispatch(updateInterview({
      id: currentInterview?.id!,
      updates: {
        isPaused: !isPaused,
      }
    }))
    dispatch(updateQuestion({
      interviewId: currentInterview?.id!,
      questionId: currentQuestion?.id!,
      updates: {
        timeLimit:timeLimit
      }

    }))
    setResumeModal(true);
  }

  const onResume =()=>{
    setIsPaused(false);
    dispatch(updateInterview({
      id: currentInterview?.id!,
      updates: {
        isPaused: false,
      }
    }))
    setResumeModal(false);
  }
  // const onTimeUp = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (inputValue.trim() && !disabled) {
  //     onSendMessage(inputValue.trim());
  //     setInputValue('');
  //   }
  // }


  return (
         <>
         <ResumeModal title="Interview Paused" isPaused={isPaused}  onResume={onResume} /> 
     <div className="flex flex-col h-full">
      {/* Timer Section */}
      {currentQuestion && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium `}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Question {messages.filter(m => m.type === 'question').length} of 6
              </span>
            </div>
            <Timer
              duration={currentQuestion.timeLimit}
              questionId={currentQuestion.id}
              onTimeUp={handleSubmit}
              isActive={isTimerActive}
              onPause={onPause}
              isPaused={isPaused}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-4'
                  : message.type === 'question'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  : message.type === 'score'
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
               
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {
      error ? (
        <div className="p-4 bg-red-100 text-red-700 text-center">
          <p>Error: LLM error</p>
          <Button type="primary" onClick={handleRetry} >Retry</Button>
        </div>
        ) : (
          <div className="border-t border-gray-200 p-4">
        <form  className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={disabled ? "Interview completed" : "Type your answer..."}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            disabled={!inputValue.trim() || disabled}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </form>
      </div>
        )
      }
    </div>
    </>
  )
}

export default ChatInterface