import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sankey from 'highcharts/modules/sankey';

// Initialize the Sankey module4
if (typeof Highcharts === 'function') {
  sankey(Highcharts);
}

interface EnrollmentData {
  from: string;
  to: string;
  weight: number;
  percentage?: number;
}

interface EnrollmentFunnelProps {
  data: EnrollmentData[];
}

const EnrollmentFunnel: React.FC<EnrollmentFunnelProps> = ({ data }) => {
  const nodes = [
    { id: 'Discovery/Dev.', name: 'Discovery/Dev.' },
    { id: 'App. Started', name: 'App. Started' },
    { id: 'App. Submitted', name: 'App. Submitted' },
    { id: 'App. Complete', name: 'App. Complete' },
    { id: 'Admission Offered', name: 'Admission Offered' },
    { id: 'Admission Accepted', name: 'Admission Accepted' },
    { id: 'Enrolled', name: 'Enrolled' },
    { id: 'Conversion and Loss', name: 'Conversion and Loss' },
  ];

  const options: Highcharts.Options = {
    title: { text: 'Enrollment Funnel' },
    accessibility: { enabled: false },
    series: [{
      type: 'sankey',
      keys: ['from', 'to', 'weight', 'percentage'],
      nodes: nodes,
      data: data.map(link => [link.from, link.to, link.weight, link.percentage ?? 0]),
      tooltip: {
        headerFormat: '',
        nodeFormatter: function() {
          const totalWeight = data
            .filter(link => link.to === this.name)
            .reduce((sum, link) => sum + link.weight, 0);
          return `<b>${this.name}</b><br>${totalWeight} leads have progressed to this stage`;
        },
        pointFormatter: function() {
          if (this.percentage) {
            return `${this.percentage}% of leads moved to next stage`;
          }
          return `${this.options.weight} leads lost`;
        }
      },
      nodeWidth: 20,
      showInLegend: false
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