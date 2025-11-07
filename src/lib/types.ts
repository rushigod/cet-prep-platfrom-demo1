export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  section: 'Physics & Chemistry' | 'Mathematics';
};

export type Test = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  questions: Question[];
};

export type UserAnswer = {
  [questionId: string]: string;
};

export type UserAttempt = {
    id: string;
    testId: string;
    userId: string; // In a real app, this would be a user's ID
    answers: UserAnswer;
    score: number;
    completedAt: Date;
}
