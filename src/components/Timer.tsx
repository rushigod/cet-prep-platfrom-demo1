'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer as TimerIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type TimerProps = {
  endTime: Date;
  onTimeUp: () => void;
};

export default function Timer({ endTime, onTimeUp }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    const calculateRemainingTime = () => {
        const now = new Date();
        const secondsLeft = differenceInSeconds(endTime, now);
        setRemainingTime(secondsLeft > 0 ? secondsLeft : 0);

        if (secondsLeft <= 0) {
            onTimeUp();
        }
    }
    
    calculateRemainingTime();

    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  };

  const isLowTime = remainingTime !== null && remainingTime <= 300; // 5 minutes

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-lg font-mono transition-colors",
        isLowTime && "bg-destructive text-destructive-foreground animate-pulse"
      )}
    >
      <TimerIcon className="h-5 w-5" />
      <span>{remainingTime !== null ? formatTime(remainingTime) : 'Loading...'}</span>
    </Badge>
  );
}
