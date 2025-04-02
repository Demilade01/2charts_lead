import SemiDonutChart from './SpendScore';

const map = [0, 0.2, 0.8, 1.5, 2, 2.8, 3];
const target = 1.8;

export const SpendScoreView = () => {
  const value = map[1]

  return (
    <div className="App w-[500px] mx-auto border-1 rounded mt-6 p-4">
      <h1 className='text-3xl'>Spend Score</h1>
      <p>Including YoY comparison</p>
      <SemiDonutChart prevValue={0.7} value={value} target={target} min={0} max={3} />
    </div>
  );
}
