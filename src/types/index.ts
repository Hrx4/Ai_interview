export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFile?: File;
  resumeContent?: string;
  score?: number;
  status: 'pending' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  summary?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  answer?: string;
  score?: number;
  timeUsed?: number;
  aiEvaluation?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  questions: Question[];
  currentQuestionIndex: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  totalScore: number;
  startedAt?: string;
  completedAt?: string;
  isPaused: boolean;
  pausedAt?: string;
}

export interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'ai' | 'question' | 'timer' | 'score';
  content: string;
  timestamp: string;
  questionId?: string;
  isCurrentQuestion?: boolean;
}

export interface InterviewSession {
  candidateId: string;
  interviewId: string;
  chatHistory: ChatMessage[];
  currentStep: 'resume-upload' | 'info-collection' | 'interview' | 'completed';
  missingFields: string[];
  isActive: boolean;
  showWelcomeBack: boolean;
}