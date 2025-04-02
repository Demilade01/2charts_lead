import { AdSpend } from './AdSpend';

const series = [
    {label: 'Meta', value: 82980, target: 200000},
    {label: 'Google Ads', value: 111506, target: 400000},
    {label: 'LinkedIn', value: 47366, target: 100000},
];

export const AdSpendView = () => {

  return (
    <div className="App w-[700px] mx-auto border-1 rounded mt-6 p-4">
      <h1 className='text-3xl'>Ad Spend</h1>
      <p>Includes budget for this fiscal year [var mm/dd/this -year to mm/dd/this-year]</p>
      <AdSpend series={series} />
    </div>
  );
}
