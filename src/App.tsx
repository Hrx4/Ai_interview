
import { useEffect, useState } from 'react';
import './App.css'
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerDashboard from './components/InterviewerDashboard';
import WelcomeBackModal from './components/WelcomeBackModal';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useAppSelector as useSelector } from './hooks/useAppSelector';
import { clearSession, setWelcomeBack } from './store/sessionSlice';


type TabType = 'interviewee' | 'interviewer';

const tabs = [
    {
      id: 'interviewee' as TabType,
      name: 'Interviewee',
      description: 'Take the interview'
    },
    {
      id: 'interviewer' as TabType,
      name: 'Interviewer',
      description: 'View candidates'
    }
  ];


const AppContent = () => {

  const dispatch = useAppDispatch();
  const session = useSelector(state => state.session.currentSession);

    const [activeTab, setActiveTab] = useState<TabType>('interviewee');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    // Check for active session on app load
    if (session && session.isActive && session.currentStep !== 'completed') {
      dispatch(setWelcomeBack(true));
    }else{
      dispatch(clearSession())
    }
  }, []);


  return (
    <>
    <div className="h-screen bg-gray-50 flex flex-col">
      <WelcomeBackModal/>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 text-white bg-blue-600 rounded-lg flex items-center justify-center">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Interview Assistant</h1>
              <p className="text-sm text-gray-600">Full Stack Developer Interview</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'interviewee' ? (
          <IntervieweeTab isLoading={isLoading} setIsLoading={setIsLoading} />
        ) : (
          <InterviewerDashboard />
        )}
      </div>
    </div>
    </>
  )
}

const App = () => {

  return (
   <>
   <Provider store={store}>
      <PersistGate loading={
        <div className="h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      } persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
   </>
  )
}

export default App
