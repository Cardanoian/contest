import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='relative max-w-2xl mx-auto'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        <input
          type='text'
          placeholder='상 이름, 프로그램명, 제작자, 소속, 해시태그로 검색...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
        />
      </div>
    </div>
  );
}
