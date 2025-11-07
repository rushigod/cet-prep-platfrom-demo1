import type { Test, Question, UserAttempt } from './types';
import { add } from 'date-fns';

const now = new Date();

const questions: Question[] = [
  // Physics & Chemistry
  {
    id: 'pc1',
    text: 'Which of the following is a dimensionally correct equation?',
    options: ['v = u + at', 'v^2 = u^2 + 2as^2', 's = ut + (1/2)at^3', 'All of the above'],
    correctAnswer: 'v = u + at',
    section: 'Physics & Chemistry',
  },
  {
    id: 'pc2',
    text: 'The pH of a neutral solution is:',
    options: ['0', '7', '14', '1'],
    correctAnswer: '7',
    section: 'Physics & Chemistry',
  },
  {
    id: 'pc3',
    text: 'What is the chemical formula for water?',
    options: ['H2O2', 'CO2', 'H2O', 'NaCl'],
    correctAnswer: 'H2O',
    section: 'Physics & Chemistry',
  },
  // Mathematics
  {
    id: 'm1',
    text: 'What is the derivative of x^2?',
    options: ['2x', 'x', 'x^3/3', '2'],
    correctAnswer: '2x',
    section: 'Mathematics',
  },
  {
    id: 'm2',
    text: 'The integral of cos(x) is:',
    options: ['-sin(x)', 'sin(x)', 'cos(x)', '-cos(x)'],
    correctAnswer: 'sin(x)',
    section: 'Mathematics',
  },
   {
    id: 'm3',
    text: 'If a matrix A has m rows and n columns, its order is:',
    options: ['n x m', 'm + n', 'm x n', 'm - n'],
    correctAnswer: 'm x n',
    section: 'Mathematics',
  },
];

const tests: Test[] = [
  {
    id: 'mock-test-1',
    title: 'MHT-CET Mock Test 1',
    startTime: add(now, { minutes: -90 }),
    endTime: add(now, { hours: 1, minutes: 30 }),
    questions: questions,
  },
  {
    id: 'mock-test-2',
    title: 'Full Length Practice Test',
    startTime: add(now, { days: 1 }),
    endTime: add(now, { days: 1, hours: 3 }),
    questions: questions,
  },
  {
    id: 'mock-test-3',
    title: 'Previous Year Paper (2023)',
    startTime: add(now, { days: -2 }),
    endTime: add(now, { days: -2, hours: 3 }),
    questions: questions,
  },
];

const userAttempts: UserAttempt[] = [
    {
        id: 'attempt-1',
        testId: 'mock-test-3',
        userId: 'user-123',
        answers: { pc1: 'v = u + at', m1: 'x' },
        score: 25,
        completedAt: add(now, {days: -2, hours: 2})
    }
];

// In a real app, these would fetch from a database.
export const getTests = (): Test[] => tests;
export const getTestById = (id: string): Test | undefined => tests.find(t => t.id === id);
export const getUserAttempts = (): UserAttempt[] => userAttempts;

// This function simulates adding a new test to the "database".
// In a real app, this would be a server action that writes to a DB.
export const addTest = (test: Test) => {
    tests.unshift(test);
}
