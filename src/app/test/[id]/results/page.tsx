'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

type ResultData = {
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  attempted: number;
  answers: { [key: string]: string };
  questions: Question[];
};

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const testId = params.id;
      const storedResult = localStorage.getItem(`test_result_${testId}`);
      if (storedResult) {
        setResult(JSON.parse(storedResult));
      }
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center p-10">Loading results...</div>;
  }

  if (!result) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center py-10">
        <Card className="max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Results Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We couldn't find the results for this test.</p>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    testTitle,
    score,
    totalQuestions,
    correctAnswers,
    attempted,
    questions,
    answers,
  } = result;

  const incorrectAnswers = attempted - correctAnswers;
  const unattempted = totalQuestions - attempted;

  const scoreColor =
    score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-2xl animate-in fade-in-50">
        <CardHeader className="text-center border-b pb-6">
          <CardDescription>Results for</CardDescription>
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            {testTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground">Your Score</p>
            <p className={cn('text-7xl font-bold font-headline', scoreColor)}>
              {score}%
            </p>
            <Progress value={score} className="max-w-sm mx-auto mt-4 h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-8">
            <div className="bg-secondary p-4 rounded-lg">
              <Target className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold">{correctAnswers}</p>
              <p className="text-sm text-green-800">Correct</p>
            </div>
             <div className="bg-red-100 p-4 rounded-lg">
              <XCircle className="mx-auto h-8 w-8 text-red-600 mb-2" />
              <p className="text-2xl font-bold">{incorrectAnswers}</p>
              <p className="text-sm text-red-800">Incorrect</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <AlertCircle className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{unattempted}</p>
              <p className="text-sm text-yellow-800">Unattempted</p>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="review">
              <AccordionTrigger className="text-lg font-headline">Review Answers</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 mt-4 max-h-[400px] overflow-y-auto pr-4">
                  {questions.map((q, i) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    const isAttempted = userAnswer !== undefined;

                    return (
                        <div key={q.id} className="border-b pb-4">
                            <p className="font-semibold">{i+1}. {q.text}</p>
                            <div className="mt-2 space-y-1 text-sm">
                                {!isAttempted ? (
                                    <p className="text-yellow-600 font-medium">Not Answered</p>
                                ) : (
                                    <p>Your Answer: <span className={cn("font-medium", isCorrect ? 'text-green-600' : 'text-red-600')}>{userAnswer}</span></p>
                                )}
                                <p>Correct Answer: <span className="font-medium text-green-600">{q.correctAnswer}</span></p>
                            </div>
                        </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4"/> Go to Dashboard
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
