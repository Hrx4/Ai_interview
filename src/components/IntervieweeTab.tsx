import { useAppSelector as useSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from "../hooks/useAppDispatch";
import UploadResume from "./UploadResume"
import { useCallback, useState } from 'react';
import { Button, Card, Input } from 'antd';
import { updateCandidate } from '../store/candidatesSlice';
import { addChatMessage, updateSession } from '../store/sessionSlice';
import type { Candidate, ChatMessage, Interview } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addQuestion, createInterview, nextQuestion, updateInterview, updateQuestion } from '../store/interviewsSlice';
import { generateQuestion } from '../utils/generateQuestion';
import ChatInterface from './ChatInterface';
import { generateSummary } from '../utils/generateSummary';

const IntervieweeTab = ({isLoading , setIsLoading}: {isLoading: boolean, setIsLoading: (isLoading: boolean) => void}) => {

  const dispatch = useAppDispatch();
  const session = useSelector(state => state.session.currentSession);
  const candidates = useSelector(state => state.candidates.candidates);
  const interviews = useSelector(state => state.interviews.interviews);
    const currentCandidate = session ? candidates.find(c => c.id === session.candidateId) : null;
  const currentInterview = session ? interviews.find(i => i.id === session.interviewId) : null;

  const [collectionData, setCollectionData] = useState<{ name: string; email: string; phone: string }>({
    name: '',
    email: '',
    phone: ''
  });
    const [error, setError] = useState<string>('');

  

  const handleInfoCollection = () => {
    if (!session || !currentCandidate) return;

    const updates: Partial<Candidate> = {};
    if (collectionData.name) updates.name = collectionData.name;
    if (collectionData.email) updates.email = collectionData.email;
    if (collectionData.phone) updates.phone = collectionData.phone;

    dispatch(updateCandidate({ id: currentCandidate.id, updates }));
    dispatch(updateSession({ 
      currentStep: 'interview',
      missingFields: [] 
    }));

    const confirmMessage: ChatMessage = {
      id: uuidv4(),
      type: 'system',
      content: 'Perfect! Now let\'s begin your technical interview. You\'ll be asked 6 questions of increasing difficulty. Good luck!',
      timestamp: new Date().toLocaleTimeString(),
    };

    dispatch(addChatMessage(confirmMessage));
    startInterview(session.interviewId , session.candidateId);
  };

   const startInterview = async (interviewId: string , candidateId: string) => {
    console.log('Starting interview with ID:', interviewId );
    // if (!session) return;
    // console.log('Session found:', session);
    setIsLoading(true);
    try {
            const firstQuestion = await generateQuestion('easy');

      const interview: Interview = {
        id: interviewId,
        candidateId: candidateId,
        questions: [{
          id: uuidv4(),
          question: firstQuestion,
          difficulty: 'easy',
          timeLimit: 20,
        }],
        currentQuestionIndex: 0,
        status: 'in-progress',
        totalScore: 0,
        startedAt: new Date().toLocaleDateString(),
        isPaused: false,
      };

      dispatch(createInterview(interview));
      dispatch(updateCandidate({ 
        id: candidateId, 
        updates: { status: 'in-progress', startedAt: new Date().toLocaleDateString() } 
      }));
      dispatch(updateInterview({
        id: interviewId,
        updates:{
          currentQuestionIndex: 0
        }
      }));  

      // Show first question
      const questionMessage: ChatMessage = {
        id: uuidv4(),
        type: 'question',
        content: `**Question ${interview.currentQuestionIndex +1}/6** (EASY)\n\n${firstQuestion}`,
        timestamp: new Date().toLocaleTimeString(),
        questionId: uuidv4(),
        isCurrentQuestion: true,
      };

      dispatch(addChatMessage(questionMessage));
      setError('');
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('startInterview')
    } finally {
      setIsLoading(false);
    }
    };

    const showNextQuestion = async(nextQuestionIndex: number) => {
    if (!session || !currentInterview) return;
    setIsLoading(true);

    const questionType = nextQuestionIndex < 2 ? 'easy' 
    : nextQuestionIndex < 4 ? 'medium' : 'hard';
    console.log("Showing question for type:", questionType , nextQuestionIndex);

    const questionCount = nextQuestionIndex <2 ? 20
    : nextQuestionIndex < 4 ? 60
    : 120;
    let nextGeneratedQuestion = '';
    try {
      nextGeneratedQuestion = await generateQuestion(questionType);
      setError('');
    } catch (error) {
      setError('nextQuestion')
      return
    }
    //i need to set current message this later in the interview slice

    // dispatch(updateInterview({
    //   id: currentInterview.id,
    //   updates:{
    //     currentQuestionIndex: nextQuestionIndex
    //   }
    // }));


    const questionMessage: ChatMessage = {
        id: uuidv4(),
        type: 'question',
        content: `**Question ${nextQuestionIndex +1 }/6** (${questionType.toUpperCase()})\n\n${nextGeneratedQuestion}`,
        timestamp: new Date().toLocaleTimeString(),
        questionId: uuidv4(),
        isCurrentQuestion: true,
      };

      dispatch(addChatMessage(questionMessage));

      dispatch(addQuestion({
    interviewId: currentInterview.id,
    question: {
      id: questionMessage.questionId!,
      question: nextGeneratedQuestion,
      difficulty: questionType,
      timeLimit: questionCount,
    }
  }));
      setIsLoading(false);
  dispatch(nextQuestion(currentInterview.id));


    };

    const handleSummaryRetry = ({summary, score}:{summary:string, score:number}) => {

      const scoreMessage: ChatMessage = {
        id: uuidv4(),
        type: 'score',
        content: summary,
        timestamp: new Date().toLocaleTimeString(),
      };

      dispatch(addChatMessage(scoreMessage));
      dispatch(updateCandidate({
        id: currentCandidate?.id||"",
        updates:{
          score: score,
          summary: summary,
          status: 'completed',
          completedAt: new Date().toLocaleTimeString(),
        }
      }))
      // dispatch(clearSession())
      
    }

    const completeInterview = async () => {
      if (!session || !currentInterview) return;
      setIsLoading(true);
      const completeMessage: ChatMessage = {
        id: uuidv4(),
        type: 'system',
        content: 'Interview completed!',
        timestamp: new Date().toLocaleDateString(),
      };

      dispatch(addChatMessage(completeMessage));
      dispatch(updateSession({ 
        currentStep: 'completed',
        isActive: false,
      }));
      dispatch(updateInterview({
        id: currentInterview.id,
        updates:{
          status: 'completed',
          completedAt: new Date().toLocaleDateString(),
        }
      }));

      // Show score
      console.log("Generating summary for interview:", currentInterview.questions);
      let summary = "" , score = 0; 
      try {
        const response= await generateSummary(currentInterview.questions);
        summary = response.summary;
        score = response.score;
      } catch (error) {
        setError('summary') 
        return
      }
      handleSummaryRetry({summary, score});
      setIsLoading(false)
      
    };
    

    const handleSendMessage = useCallback(async (message: string) => {
      console.log("Handling send message:", message);
    if (!session || !currentInterview) return;
console.log("Current interview:", currentInterview);
    const currentQuestion = currentInterview.questions[currentInterview.currentQuestionIndex];
    if (!currentQuestion) return;
console.log("Current question:", currentQuestion);
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      questionId: currentQuestion.id,
    };

    dispatch(addChatMessage(userMessage));

    // Update question with answer
    dispatch(updateQuestion({
      interviewId: currentInterview.id,
      questionId: currentQuestion.id,
      updates: { answer: message
       }
    }));

    // Show loading message
    // const loadingMessage: ChatMessage = {
    //   id: uuidv4(),
    //   type: 'system',
    //   content: 'Evaluating your answer...',
    //   timestamp: new Date().toLocaleDateString(),
    // };

    // dispatch(addChatMessage(loadingMessage));

    try {
     
      // Move to next question or complete interview
      if (currentInterview.currentQuestionIndex < 5) {
        console.log("currentInterview.currentQuestionIndex", currentInterview.currentQuestionIndex +1);
          showNextQuestion(currentInterview.currentQuestionIndex + 1);
          // dispatch(updateInterview({
          //   id: currentInterview.id,
          //   updates:{
          //     currentQuestionIndex: currentInterview.currentQuestionIndex + 1
          //   }
          //   }));
      } else {
          completeInterview();
      }

    } catch (error) {
      console.error('Error evaluating answer:', error);
    }
  }, [session, currentInterview, dispatch, showNextQuestion, completeInterview]);

  const getCurrentQuestion = () => {
    console.log("Getting current question calling");
    if (!currentInterview || currentInterview.status === 'completed') return undefined;
    console.log("Current interview found:", currentInterview);
    const question = currentInterview.questions[currentInterview.currentQuestionIndex];
    if (!question || question.answer) return undefined;
console.log("Current question found:", question);
    return {
      id: question.id,
      question: question.question,
      timeLimit: question.timeLimit,
      difficulty: question.difficulty,
    };
  };

//  const handleTimeUp = useCallback(async (message: string) => {
//   if (!currentInterview) return;

//   const currentQuestion = currentInterview.questions[currentInterview.currentQuestionIndex];
//   if (!currentQuestion || currentQuestion.answer) return;

//   await handleSendMessage(message);
// }, [currentInterview, handleSendMessage]);

  const handleRetry = async()=>{
    if(error === 'nextQuestion' && currentInterview )
    {
      showNextQuestion(currentInterview.currentQuestionIndex + 1);
    }
    else if(error === 'startInterview' && session)
    {
      startInterview(session.interviewId , session.candidateId);
    }
    else if(error === 'summary' && currentInterview)
    {
      let summary = "" , score = 0;
      try {
        const response= await generateSummary(currentInterview.questions);
        summary = response.summary;
        score = response.score;
        setError('');
      } catch (error) {
        setError('summary')
        return
      }
      handleSummaryRetry({summary, score});
    }
  }


  if(!session){
          return(
            <div className=" h-full w-full flex items-center justify-center">
            <UploadResume startInterview={startInterview} />
        </div>
          )
        }


        if (session.currentStep === 'info-collection') {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center">Complete Your Profile</h2>
              <p className="text-gray-600 text-center">
                Please fill in the missing information to continue
              </p>

              <div className="space-y-3">
                {session.missingFields.includes('name') && (
                  <Input
                    value={collectionData.name}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                )}
                
                {session.missingFields.includes('email') && (
                  <Input
                    type="email"
                    value={collectionData.email}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                )}
                
                {session.missingFields.includes('phone') && (
                  <Input
                    value={collectionData.phone}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                )}
              </div>

              <Button
                onClick={handleInfoCollection}
                disabled={session.missingFields.some(field => !collectionData[field as keyof typeof collectionData])}
                className="w-full"
              >
                Continue to Interview
              </Button>
            </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const isInterviewCompleted = session.currentStep === 'completed';



  return (
        <>
        <ChatInterface
        messages={session.chatHistory}
        onSendMessage={handleSendMessage}
        currentQuestion={currentQuestion}
        // onTimeUp={handleTimeUp}
        isTimerActive={!!currentQuestion && !isLoading}
        disabled={isInterviewCompleted || isLoading}
        error = {error}
        // setError={setError}
        handleRetry={handleRetry}
        isLoading={isLoading}
        />
        </>
  )
}

export default IntervieweeTab