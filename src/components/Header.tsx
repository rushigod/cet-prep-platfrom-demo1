import Link from 'next/link';
import { Button } from './ui/button';
import { BookPlus, GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-headline font-bold text-primary">
            CET Prep Platform
          </h1>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/test/create">
              <BookPlus className="md:hidden" />
              <span className="hidden md:inline">Create Test</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
