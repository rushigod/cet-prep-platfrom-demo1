'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookPlus, Timer } from 'lucide-react';
import { getTests, getUserAttempts } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function Home() {
  const availableTests = getTests();
  const userAttempts = getUserAttempts();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Welcome to the CET Prep Platform
          </h1>
          <p className="text-muted-foreground mt-2">
            Your journey to MHT-CET success starts here.
          </p>
        </div>
        <Button asChild>
          <Link href="/test/create">
            <BookPlus /> Create New Test
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Available Tests</CardTitle>
            <CardDescription>
              Choose a test to start your practice session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableTests.length > 0 ? (
                availableTests.map((test) => {
                  const now = new Date();
                  const isUpcoming = test.startTime > now;
                  const isOver = test.endTime < now;
                  const isActive = !isUpcoming && !isOver;

                  return (
                    <div
                      key={test.id}
                      className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">{test.title}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Timer className="h-4 w-4" />
                          <span>
                            {format(test.startTime, 'MMM d, h:mm a')} -{' '}
                            {format(test.endTime, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {isActive && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                        {isOver && <Badge variant="destructive">Finished</Badge>}
                        <Button
                          asChild
                          size="sm"
                          disabled={!isActive}
                          aria-label={`Start ${test.title}`}
                        >
                          <Link href={`/test/${test.id}`}>
                            Start Test <ArrowRight />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No tests are available at the moment.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">My Attempts</CardTitle>
            <CardDescription>
              Review your past performance and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userAttempts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">
                        {availableTests.find((t) => t.id === attempt.testId)?.title || 'Unknown Test'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={attempt.score > 50 ? 'default' : 'destructive'}
                          className="font-mono"
                        >
                          {attempt.score}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(attempt.completedAt, 'PP')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">You haven't attempted any tests yet.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="#available-tests">Start your first test</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
