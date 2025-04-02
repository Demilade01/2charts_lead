import { LeadScore, LeadScoreChartSource } from './LeadScore';

const sources: LeadScoreChartSource[] = [
  { label: 'Organic', value: 125  },
  { label: 'Paid', value: 75  }
];

export const LeadScoreView = () => {

  return (
    <div className="App w-[500px] mx-auto border-1 rounded mt-6 p-4">
      <h1 className='text-3xl'>Lead Score</h1>
      <p>{sources.map(s => s.label).join(' vs ')}</p>
      <LeadScore sources={sources} />
    </div>
  );
}
