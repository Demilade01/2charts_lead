import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sankey from 'highcharts/modules/sankey';

// Initialize the Sankey module
if (typeof sankey === 'function') {

  sankey(Highcharts);
}

interface EnrollmentData {
  from: string;
  to: string;
  weight: number;
}

interface EnrollmentFunnelProps {
  data: EnrollmentData[];
}

const EnrollmentFunnel: React.FC<EnrollmentFunnelProps> = ({ data }) => {
  const options: Highcharts.Options = {
    title: {
      text: 'Enrollment Funnel'
    },
    series: [{
      keys: ['from', 'to', 'weight'],
      data: data,
      type: 'sankey',
      name: 'Enrollment Flow',
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '{point.fromNode.name} → {point.toNode.name}: {point.weight}',
        style: {
          fontSize: '12px'
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.fromNode.name} → {point.toNode.name}: {point.weight} leads<br/>' +
          'Percentage: {point.weight}%'
      }
    }]
  };

  return (
    <div className="w-full h-[600px] p-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default EnrollmentFunnel;