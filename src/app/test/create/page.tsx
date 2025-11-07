'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addTest } from '@/lib/mock-data';
import type { Question } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  startDate: z.date({ required_error: 'Start date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM).'),
  questionInputType: z.enum(['manual', 'csv']).default('manual'),
  manualQuestions: z.string().optional(),
  csvFile: z.instanceof(FileList).optional(),
});

export default function CreateTestPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startTime: '12:00',
      questionInputType: 'manual',
    },
  });

  function parseManualQuestions(text: string): Question[] {
    // Basic parser, can be made more robust
    const questionBlocks = text.split('---').filter(q => q.trim() !== '');
    return questionBlocks.map((block, index) => {
      const lines = block.trim().split('\n');
      const questionText = lines.shift()?.replace(/^Q[0-9]+\.\s*/, '') || '';
      const sectionLine = lines.find(l => l.toLowerCase().startsWith('section:'));
      const answerLine = lines.find(l => l.toLowerCase().startsWith('answer:'));
      
      const options = lines.filter(l => /^[A-D]\)\s/.test(l)).map(o => o.substring(3).trim());
      const correctAnswer = answerLine?.split(':')[1]?.trim() || '';
      const section = (sectionLine?.split(':')[1]?.trim() === 'Mathematics' ? 'Mathematics' : 'Physics & Chemistry') as 'Mathematics' | 'Physics & Chemistry';

      return {
        id: `q-${Date.now()}-${index}`,
        text: questionText,
        options,
        correctAnswer: options.find(o => o.startsWith(correctAnswer)) || correctAnswer,
        section,
      };
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [hours, minutes] = values.startTime.split(':').map(Number);
    const startTime = new Date(values.startDate);
    startTime.setHours(hours, minutes);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 3);

    let questions: Question[] = [];
    if (values.questionInputType === 'manual' && values.manualQuestions) {
        questions = parseManualQuestions(values.manualQuestions);
    } else if (values.questionInputType === 'csv' && values.csvFile && values.csvFile.length > 0) {
        // In a real app, you'd parse the CSV file here.
        // For now, we'll show a toast and use dummy questions.
        toast({ title: 'CSV parsing not implemented.', description: 'Using placeholder questions.' });
    }

    if (questions.length === 0) {
        toast({ variant: 'destructive', title: 'No Questions', description: 'Please add questions to create the test.' });
        return;
    }

    const newTest = {
      id: `test-${Date.now()}`,
      title: values.title,
      startTime,
      endTime,
      questions,
    };
    
    // In a real app, this would be a server action.
    addTest(newTest);

    toast({
      title: 'Test Created Successfully!',
      description: `"${values.title}" is now available.`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create New Test</CardTitle>
          <CardDescription>
            Set up a new MHT-CET practice test for your students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Weekly Mock Test - Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (24h format)</FormLabel>
                      <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                      </FormControl>
                      <FormDescription>The test window will be 3 hours from this time.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="questionInputType"
                render={({ field }) => (
                  <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Input</TabsTrigger>
                      <TabsTrigger value="csv">Upload CSV</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual">
                      <FormField
                        control={form.control}
                        name="manualQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Questions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  'Q1. Question text...\nA) Option 1\nB) Option 2\nAnswer: A\nSection: Physics & Chemistry\n---\nQ2. ...'
                                }
                                className="min-h-[250px] font-mono text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Separate questions with "---". Follow the format shown.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="csv">
                      <FormField
                        control={form.control}
                        name="csvFile"
                        render={({ field: {onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>CSV File</FormLabel>
                             <FormControl>
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">CSV file with columns: text, optionA, optionB, optionC, optionD, correctAnswer, section</p>
                                        </div>
                                        <Input id="csv-upload" type="file" className="hidden" accept=".csv" onChange={(e) => onChange(e.target.files)} {...field} />
                                    </label>
                                </div> 
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                )}
              />

              <Button type="submit" className="w-full md:w-auto" size="lg">
                Create Test
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
