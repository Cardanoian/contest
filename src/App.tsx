import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { AwardSection } from './components/AwardSection';
import { useTheme } from './hooks/useTheme';
import winnersData from './data/winners.json';

interface Winner {
  id: number;
  award: string;
  programName: string;
  creator: {
    name: string;
    affiliation: string;
    position: string;
  };
  links: { 교사용?: string; 학생용?: string; 접속하기?: string };
  hashtags: string[];
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const winners: Array<Winner> = winnersData;

  // 검색 필터링
  const filteredWinners = useMemo(() => {
    if (!searchQuery.trim()) return winners;

    const query = searchQuery.toLowerCase();
    return winners.filter(
      (winner) =>
        winner.award.toLowerCase().includes(query) ||
        winner.programName.toLowerCase().includes(query) ||
        winner.creator.name.toLowerCase().includes(query) ||
        winner.creator.affiliation.toLowerCase().includes(query) ||
        winner.creator.position.toLowerCase().includes(query) ||
        winner.hashtags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, winners]);

  // 상별로 그룹화
  const awardOrder = ['대상', '금상', '은상', '동상', '장려상'];
  const groupedWinners = useMemo(() => {
    return awardOrder.map((award) => ({
      award,
      winners: filteredWinners.filter((w) => w.award === award),
    }));
  }, [filteredWinners]);

  return (
    <div className='min-h-screen bg-background'>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <main className='pb-16'>
        {filteredWinners.length === 0 ? (
          <div className='container mx-auto px-4 py-16 text-center'>
            <p className='text-xl text-muted-foreground'>
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          groupedWinners.map(
            ({ award, winners }) =>
              winners.length > 0 && (
                <AwardSection key={award} award={award} winners={winners} />
              )
          )
        )}
      </main>

      <footer className='border-t border-border py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          <p>2025 새(AI)로고침 우리 교실 앱 공모전</p>
          <p className='mt-2'>총 {winners.length}개의 수상작</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
