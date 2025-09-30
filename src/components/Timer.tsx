import React, { useState, useEffect } from 'react';
import { Button, Progress } from 'antd';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp:() => void;
  isActive: boolean;
  isPaused?: boolean;
  onPause: (timeLimit:number) => void;
  questionId: string;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive, isPaused , onPause,questionId }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration,questionId]);


  useEffect(() => {
    console.log('duration change test',duration)
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
            clearInterval(interval); // Clear immediately
          onTimeUp()
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused,duration,questionId]);

  
  

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;


  return (
    <div className="flex  space-x-4">
      <Button type="primary" onClick={()=>onPause(timeLeft)}>Pause</Button>
      <div className='w-32 justify-center flex items-center space-x-2 flex-col'>
        {minutes + ':' + (seconds < 10 ? '0' : '') + seconds}
      <Progress
        percent={percentage}
        showInfo={false}
        
      />
      </div>
      {isPaused && (
        <span className="text-sm text-gray-500">Paused</span>
      )}
    </div>
  );
};

export default Timer;