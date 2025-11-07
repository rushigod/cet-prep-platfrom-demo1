import { getTestById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import ExamInterface from '@/components/ExamInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ExamPageProps = {
  params: { id: string };
};

export default function ExamPage({ params }: ExamPageProps) {
  const test = getTestById(params.id);

  if (!test) {
    notFound();
  }

  const now = new Date();
  const isUpcoming = test.startTime > now;
  const isOver = test.endTime < now;
  const isActive = !isUpcoming && !isOver;

  if (!isActive) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center py-10">
        <Card className="max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Test Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {isUpcoming
                ? 'This test has not started yet.'
                : 'The time window for this test has ended.'}
            </p>
            <p className="text-muted-foreground text-sm">
              Please check the scheduled time and try again.
            </p>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ExamInterface test={test} />;
}
