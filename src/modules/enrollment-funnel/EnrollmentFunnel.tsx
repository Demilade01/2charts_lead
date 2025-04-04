// Final corrected version: Clean horizontal Sankey with Lost in column 7, no offsetVertical

import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sankey from 'highcharts/modules/sankey';

if (typeof Highcharts === 'function') {
  sankey(Highcharts);
}

interface ProcessedEnrollmentData {
  from: string;
  to: string;
  weight: number;
  percentage?: string;
}

const mockStages = [
  { stage: 'Discovery/Dev.', leads: 156, conversionRate: '58.3%' },
  { stage: 'App. Started', leads: 91, conversionRate: '94.5%' },
  { stage: 'App. Submitted', leads: 86, conversionRate: '87.2%' },
  { stage: 'App. Complete', leads: 75, conversionRate: '89.3%' },
  { stage: 'Admission Offered', leads: 67, conversionRate: '97%' },
  { stage: 'Admission Accepted', leads: 65, conversionRate: '92.3%' },
  { stage: 'Enrolled', leads: 60 }
];

const generateChartData = (): ProcessedEnrollmentData[] => {
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

  return processed;
};

const getChartOptions = (data: ProcessedEnrollmentData[]): Highcharts.Options => {
  return {
    chart: {
      type: 'sankey',
      height: '400px',
      spacingBottom: 100
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
    plotOptions: {
      sankey: {
        nodePadding: 40,
        clip: false,
        curveFactor: 0.33
      }
    },
    series: [{
      type: 'sankey',
      name: 'Lead Funnel',
      keys: ['from', 'to', 'weight', 'percentage'],
      data: data,
      nodes: [
        { id: 'Discovery/Dev.', column: 0, color: '#57b9b3' },
        { id: 'App. Started', column: 1, color: '#57b9b3' },
        { id: 'App. Submitted', column: 2, color: '#57b9b3' },
        { id: 'App. Complete', column: 3, color: '#57b9b3' },
        { id: 'Admission Offered', column: 4, color: '#57b9b3' },
        { id: 'Admission Accepted', column: 5, color: '#57b9b3' },
        { id: 'Enrolled', column: 6, color: '#57b9b3' },
        { id: 'Lost', column: 7, color: '#cccccc',}
      ],
      dataLabels: {
        enabled: true,
        format: '{point.name}',
        style: {
          fontWeight: 'bold',
          textOutline: 'none'
        }
      },
      nodeWidth: 20
    }]
  };
};

const EnrollmentFunnel: React.FC = () => {
  const [chartData, setChartData] = useState<ProcessedEnrollmentData[]>([]);

  useEffect(() => {
    const data = generateChartData();
    setChartData(data);
  }, []);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions(chartData)}
      />
    </div>
  );
};

export default EnrollmentFunnel;
