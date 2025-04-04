import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sankey from 'highcharts/modules/sankey';

// Initialize the Sankey module
if (typeof Highcharts === 'function') {
  sankey(Highcharts);
}

interface ProcessedEnrollmentData {
  from: string;
  to: string;
  weight: number;
  percentage?: string;
}

const EnrollmentFunnel: React.FC = () => {
  const [data, setData] = useState<ProcessedEnrollmentData[]>([]);

  const mockStages = [
    { stage: 'Discovery/Dev.', leads: 156, conversionRate: '58.3%' },
    { stage: 'App. Started', leads: 91, conversionRate: '94.5%' },
    { stage: 'App. Submitted', leads: 86, conversionRate: '87.2%' },
    { stage: 'App. Complete', leads: 75, conversionRate: '89.3%' },
    { stage: 'Admission Offered', leads: 67, conversionRate: '97%' },
    { stage: 'Admission Accepted', leads: 65, conversionRate: '92.3%' },
    { stage: 'Enrolled', leads: 60 }
  ];

  useEffect(() => {
    const processed: ProcessedEnrollmentData[] = [];

    for (let i = 0; i < mockStages.length - 1; i++) {
      const current = mockStages[i];
      const next = mockStages[i + 1];

      processed.push({
        from: current.stage,
        to: next.stage,
        weight: next.leads,
        percentage: current.conversionRate
      });

      const loss = current.leads - next.leads;
      if (loss > 0) {
        processed.push({
          from: current.stage,
          to: 'Lost',
          weight: loss
        });
      }
    }

    // Last stage loss (Admission Accepted to Enrolled)
    const last = mockStages[mockStages.length - 2];
    const final = mockStages[mockStages.length - 1];
    const lastLoss = last.leads - final.leads;
    if (lastLoss > 0) {
      processed.push({
        from: last.stage,
        to: 'Lost',
        weight: lastLoss
      });
    }

    setData(processed);
  }, []);

  const options: Highcharts.Options = {
    chart: {
      type: 'sankey',
      height: '600px'
    },
    title: {
      text: 'Lead Funnel & Performance',
      align: 'left'
    },
    subtitle: {
      text: 'Qualified Leads Comparison – Spring ’25'
    },
    tooltip: {
      pointFormatter: function () {
        const p = this as any;
        if (p.to === 'Lost') {
          return `<b>Loss</b><br/>${p.weight} leads lost`;
        }
        return `<b>${p.from} → ${p.to}</b><br/>${p.weight} leads${p.percentage ? ` (${p.percentage})` : ''}`;
      }
    },
    series: [{
      type: 'sankey',
      name: 'Lead Funnel',
      keys: ['from', 'to', 'weight', 'percentage'],
      data: data,
      nodes: [
        { id: 'Discovery/Dev.' },
        { id: 'App. Started' },
        { id: 'App. Submitted' },
        { id: 'App. Complete' },
        { id: 'Admission Offered' },
        { id: 'Admission Accepted' },
        { id: 'Enrolled' },
        { id: 'Lost', color: '#cccccc' }
      ],
      dataLabels: {
        enabled: true,
        format: '{point.name}',
        style: {
          fontWeight: 'bold',
          textOutline: 'none'
        }
      },
      nodeWidth: 20,
      nodePadding: 15
    }]
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Funnel & Performance</h2>
          <p className="text-sm text-gray-600">Qualified Leads Comparison – Compare funnel performance to a benchmark</p>
        </div>
        <div className="flex gap-2">
          <select className="border p-1 rounded">
            <option>Select Program</option>
          </select>
          <select className="border p-1 rounded">
            <option>Spring ’25</option>
          </select>
        </div>
      </div>
      <div className="mb-4 flex gap-4">
        <button className="border px-3 py-1 rounded bg-gray-200">Conversion and Loss</button>
        <button className="border px-3 py-1 rounded">Time in Stage</button>
        <button className="border px-3 py-1 rounded">Source</button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default EnrollmentFunnel;
