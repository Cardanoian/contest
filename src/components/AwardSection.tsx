import { AwardCard } from './AwardCard';

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

interface AwardSectionProps {
  award: string;
  winners: Winner[];
}

export function AwardSection({ award, winners }: AwardSectionProps) {
  if (winners.length === 0) return null;

  return (
    <section className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        {award} ({winners.length}명)
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {winners.map((winner) => (
          <AwardCard key={winner.id} winner={winner} />
        ))}
      </div>
    </section>
  );
}
