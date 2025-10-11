import { ExternalLink, Award } from 'lucide-react';

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

interface AwardCardProps {
  winner: Winner;
}

const awardColors = {
  대상: 'from-blue-400 via-blue-500 to-blue-600',
  금상: 'from-yellow-400 via-yellow-500 to-amber-500',
  은상: 'from-gray-300 via-gray-400 to-gray-500',
  동상: 'from-orange-300 via-orange-400 to-orange-500',
  장려상: 'from-green-400 via-emerald-500 to-teal-500',
};

const awardBadgeColors = {
  대상: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
  금상: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  은상: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
  동상: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
  장려상: 'bg-gradient-to-r from-green-400 to-teal-600 text-white',
};

export function AwardCard({ winner }: AwardCardProps) {
  const gradientColor =
    awardColors[winner.award as keyof typeof awardColors] ||
    'from-gray-400 to-gray-600';
  const badgeColor =
    awardBadgeColors[winner.award as keyof typeof awardBadgeColors] ||
    'bg-gray-500 text-white';

  return (
    <div className='group block'>
      <div className='relative h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50'>
        {/* 그라데이션 상단 바 */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${gradientColor}`}
        />

        {/* 상 배지 */}
        <div className='flex items-center justify-between mb-4'>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}
          >
            <Award className='h-4 w-4' />
            {winner.award}
          </span>
        </div>

        {/* 프로그램명 */}
        <h3 className='text-xl font-bold text-foreground mb-3 line-clamp-2'>
          {winner.programName}
        </h3>

        {/* 제작자 정보 */}
        <div className='space-y-1 mb-4'>
          <p className='text-sm text-muted-foreground'>
            {winner.creator.affiliation}
          </p>
          <p className='text-sm font-medium text-foreground'>
            {winner.creator.position} {winner.creator.name}
          </p>
        </div>

        {/* 해시태그 */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {winner.hashtags.map((tag, index) => (
            <span
              key={index}
              className='text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 링크 버튼들 */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {Object.entries(winner.links).map(([label, url]) => (
            <a
              key={label}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium'
            >
              {label}
              <ExternalLink className='h-3 w-3' />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
