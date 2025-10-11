import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              2025 새(AI)로고침 우리 교실 앱 공모전
            </h1>
            <p className='mt-2 text-sm md:text-base text-muted-foreground'>
              AI로 만드는 교육의 미래
            </p>
          </div>
          <button
            onClick={onToggleTheme}
            className='ml-4 p-2 rounded-lg hover:bg-accent transition-colors'
            aria-label='테마 전환'
          >
            {theme === 'light' ? (
              <Moon className='h-5 w-5' />
            ) : (
              <Sun className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
