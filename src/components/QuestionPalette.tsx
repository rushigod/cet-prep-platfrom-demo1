'use client';

import type { Question } from '@/lib/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Circle, Star } from 'lucide-react';
import type { QuestionStatus } from './ExamInterface';

type QuestionPaletteProps = {
  questions: Question[];
  statuses: { [key: string]: QuestionStatus };
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
};

const statusStyles: { [key in QuestionStatus]: string } = {
  'answered': 'bg-green-500 text-white',
  'unanswered': 'bg-muted text-muted-foreground',
  'review': 'bg-accent text-accent-foreground',
  'answered-review': 'bg-accent text-accent-foreground relative',
};

const statusLegends = [
    { status: 'answered', label: 'Answered', color: 'bg-green-500' },
    { status: 'unanswered', label: 'Not Answered', color: 'bg-muted' },
    { status: 'review', label: 'Marked for Review', color: 'bg-accent' },
]

export default function QuestionPalette({
  questions,
  statuses,
  currentIndex,
  onSelectQuestion,
}: QuestionPaletteProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-7 gap-2">
        {questions.map((q, index) => {
          const status = statuses[q.id];
          const isCurrent = index === currentIndex;

          return (
            <Button
              key={q.id}
              variant="outline"
              size="icon"
              className={cn(
                'h-9 w-9 font-mono transition-all',
                statusStyles[status],
                isCurrent && 'ring-2 ring-primary ring-offset-2',
                status === 'answered-review' && 'after:content-["✔"] after:absolute after:text-white after:text-xs after:bottom-0.5 after:right-1'
              )}
              onClick={() => onSelectQuestion(index)}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground pt-4">
        {statusLegends.map(item => (
            <div key={item.label} className="flex items-center gap-2">
                <div className={cn("h-4 w-4 rounded-full", item.color)} />
                <span>{item.label}</span>
            </div>
        ))}
         <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full relative", statusStyles['answered-review'], 'after:hidden')}>
                 <span className="absolute text-white text-xs bottom-0 right-0.5">✔</span>
            </div>
            <span>Answered & Marked</span>
        </div>
      </div>
    </div>
  );
}
