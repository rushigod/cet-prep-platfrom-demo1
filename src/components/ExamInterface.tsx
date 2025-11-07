'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Test, Question, UserAnswer } from '@/lib/types';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import Timer from './Timer';
import QuestionPalette from './QuestionPalette';
import { Bookmark, ChevronLeft, ChevronRight, Check } from 'lucide-react';

type ExamInterfaceProps = {
  test: Test;
};

type QuestionStatus = 'unanswered' | 'answered' | 'review' | 'answered-review';

export default function ExamInterface({ test }: ExamInterfaceProps) {
  const router = useRouter();

  const sections = ['Physics & Chemistry', 'Mathematics'];
  const [activeSection, setActiveSection] = useState<'Physics & Chemistry' | 'Mathematics'>(sections[0]);
  
  const questionsInSection = useMemo(() => 
    test.questions.filter(q => q.section === activeSection),
    [test.questions, activeSection]
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());

  const currentQuestion = questionsInSection[currentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [activeSection]);


  const getQuestionStatus = (question: Question): QuestionStatus => {
    const isAnswered = answers[question.id] !== undefined;
    const isMarked = markedForReview.has(question.id);
    if (isAnswered && isMarked) return 'answered-review';
    if (isMarked) return 'review';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const questionStatuses = useMemo(() => {
    const statuses: { [key: string]: QuestionStatus } = {};
    test.questions.forEach(q => {
        statuses[q.id] = getQuestionStatus(q);
    });
    return statuses;
  }, [answers, markedForReview, test.questions]);

  const handleNext = () => {
    if (currentQuestionIndex < questionsInSection.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleClearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
  };
  
  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestion.id)) {
      newMarked.delete(currentQuestion.id);
    } else {
      newMarked.add(currentQuestion.id);
    }
    setMarkedForReview(newMarked);
    handleNext();
  };

  const handleSubmitTest = () => {
    // In a real app, this would be a server action posting to a DB.
    // Here, we'll calculate results and store in localStorage for the results page.
    const correctAnswers = test.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / test.questions.length) * 100);

    const result = {
      testId: test.id,
      testTitle: test.title,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      attempted: Object.keys(answers).length,
      answers,
      questions: test.questions,
    };
    
    try {
        localStorage.setItem(`test_result_${test.id}`, JSON.stringify(result));
    } catch (error) {
        console.error("Could not save to localStorage", error);
    }
    
    router.push(`/test/${test.id}/results`);
  };

  const progress = (Object.keys(answers).length / test.questions.length) * 100;

  if (!currentQuestion) {
    return <div className="p-8">This section has no questions.</div>
  }

  return (
    <div className="flex flex-col h-full bg-secondary/50">
      <header className="bg-card border-b p-2 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-headline text-lg md:text-xl text-primary">{test.title}</h1>
          <Timer endTime={test.endTime} onTimeUp={handleSubmitTest} />
        </div>
      </header>

      <div className="container mx-auto py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-4">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="border-b">
                 <div className="flex justify-between items-center">
                    <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as any)} className="w-full">
                        <TabsList>
                            <TabsTrigger value="Physics & Chemistry">Physics & Chemistry</TabsTrigger>
                            <TabsTrigger value="Mathematics">Mathematics</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="hidden lg:block ml-4">
                        Question {currentQuestionIndex + 1} of {questionsInSection.length}
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-6 px-4 md:px-8 space-y-6">
                <p className="font-semibold text-lg leading-relaxed">
                  {currentQuestion.text}
                </p>
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleAnswerChange}
                  className="space-y-4 text-base"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="font-normal text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="border-t bg-secondary/30 p-3 md:p-4 flex flex-wrap justify-between items-center gap-2">
                <Button variant="outline" onClick={handleMarkForReview}>
                  <Bookmark /> Mark for Review & Next
                </Button>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                        <ChevronLeft /> Previous
                    </Button>
                    <Button onClick={handleNext} disabled={currentQuestionIndex === questionsInSection.length - 1}>
                        Save & Next <ChevronRight />
                    </Button>
                </div>
                <Button variant="destructive" onClick={handleClearResponse}>Clear</Button>
              </CardFooter>
            </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Question Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionPalette
                questions={questionsInSection}
                statuses={questionStatuses}
                currentIndex={currentQuestionIndex}
                onSelectQuestion={setCurrentQuestionIndex}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Test Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                    {Object.keys(answers).length} of {test.questions.length} questions answered.
                </p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                            <Check/> Submit Test
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You cannot change your answers after submitting. Please review your test before finalizing.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Review Test</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmitTest}>
                            Yes, Submit
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
