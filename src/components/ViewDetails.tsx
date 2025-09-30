import { Modal } from 'antd'
import { useAppSelector as useSelector } from '../hooks/useAppSelector';
import type { Candidate, Interview } from '../types'

const ViewDetails = ({detilsModalVisible, handleCancel , candidate}:{detilsModalVisible:boolean, handleCancel:()=>void , candidate:Candidate}) => {

      const interviews = useSelector(state => state.interviews.interviews);


const getCandidateInterview = (candidateId: string): Interview | undefined => {
    return interviews.find(interview => interview.candidateId === candidateId);
  };
        const interview = getCandidateInterview(candidate.id);

    

    return (
    <Modal
        title={candidate?.name || 'Candidate Details'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={detilsModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <div className="space-y-6">
          {/* Candidate Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Email:</span> {candidate?.email}</p>
                <p><span className="font-medium">Phone:</span> {candidate?.phone}</p>
                <p><span className="font-medium">Applied:</span>{candidate.createdAt} </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Interview Score</h4>
              <div className="space-y-2">
                {candidate?.score !== undefined ? (
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold `}>
                      {candidate?.score}/{60} ({((candidate?.score / 60) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ):(
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold `}>
                      0/60 (0%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {candidate?.summary && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Assessment Summary</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">{candidate?.summary}</p>
              </div>
            </div>
          )}

          {/* Questions & Answers */}
          {interview && interview.questions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Interview Questions & Answers</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {interview.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Question {index + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty.toUpperCase()}
                        </span>
                      </div>
                      {question.score !== undefined && (
                        <span className={`font-bold `}>
                          {question.score}/{question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{question.question}</p>
                      
                      {question.answer && (
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-sm text-gray-700">{question.answer}</p>
                        </div>
                      )}
                      
                      {question.aiEvaluation && (
                        <div className="bg-blue-50 rounded p-2">
                          <p className="text-xs text-blue-700">{question.aiEvaluation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
  )
}

export default ViewDetails