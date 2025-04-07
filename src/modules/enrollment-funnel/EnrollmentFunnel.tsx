import React from 'react';
import Highcharts from 'highcharts';
import Sankey from 'highcharts/modules/sankey';
import HighchartsReact from 'highcharts-react-official';

if (typeof Highcharts === 'function') {
  Sankey(Highcharts);
}

const EnrollmentFunnel: React.FC = () => {
  const funnelData = [
    { from: 'Discovery/Dev.', to: 'App. Started', weight: 9 },
    { from: 'App. Started', to: 'App. Submitted', weight: 8 },
    { from: 'App. Submitted', to: 'App. Complete', weight: 7 },
    { from: 'App. Complete', to: 'Admission Offered', weight: 6 },
    { from: 'Admission Offered', to: 'Admission Accepted', weight: 6 },
    { from: 'Admission Accepted', to: 'Enrolled', weight: 4 },
    { from: 'Admission Accepted', to: 'Lost', weight: 3 },
    { from: 'Admission Offered', to: 'Lost', weight: 1 },
    { from: 'App. Complete', to: 'Lost', weight: 2 },
    { from: 'App. Submitted', to: 'Lost', weight: 2 },
    { from: 'App. Started', to: 'Lost', weight: 2 },
    { from: 'Discovery/Dev.', to: 'Lost', weight: 7 },
  ];

  const totalLost = funnelData
    .filter((d) => d.to === 'Lost')
    .reduce((sum, d) => sum + d.weight, 0);

  const progressionColors = [
    '#c2edea', '#c2edea', '#c2edea', '#c2edea', '#c2edea', '#c2edea',
  ];

  const tooltipFormatter = function (this: any) {
    const from = this.point.fromNode.name;
    const to = this.point.toNode.name;
    const weight = this.point.weight;

    if (to === 'Lost') {
      return `<b>${weight} leads</b> dropped out at <b>${from}</b>`;
    }

    return `<b>${weight} leads</b> progressed from <b>${from}</b> to <b>${to}</b>`;
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'sankey',
      height: '600px',
    },
    title: {
      text: 'Lead Funnel & Performance'
    },
    subtitle: {
      text: 'Qualified Leads Conversion for Spring ’25'
    },
    tooltip: {
      formatter: tooltipFormatter
    },
    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
      }
    },
    plotOptions: {
      series: {
        point: {
          events: {
            click: function () {
              const { from, to, weight } = this.options;
              if (to === 'Lost') {
                alert(`${weight} leads dropped at ${from}`);
              } else {
                alert(`${weight} leads moved from ${from} to ${to}`);
              }
            }
          }
        }
      }
    },
    series: [
      {
        keys: ['from', 'to', 'weight'],
        type: 'sankey',
        name: 'Lead Funnel',
        nodePadding: 10,
        nodeWidth: 8,
        colorByPoint: false,
        nodes: [
          {
            id: 'Discovery/Dev.',
            color: '#57b9b3',
            offsetVertical: 0,
            dataLabels: {
              format: 'Discovery/Dev.<br><span style="color:gray">156 leads</span>'
            }
          },
          {
            id: 'App. Started',
            color: '#57b9b3',
            offsetVertical: -70,
            dataLabels: {
              format: 'App. Started<br><span style="color:gray">58.3% converted</span>'
            }
          },
          {
            id: 'App. Submitted',
            color: '#57b9b3',
            offsetVertical: -80,
            dataLabels: {
              format: 'App. Submitted<br><span style="color:gray">94.5% converted</span>'
            }
          },
          {
            id: 'App. Complete',
            color: '#57b9b3',
            offsetVertical: -90,
            dataLabels: {
              format: 'App. Complete<br><span style="color:gray">87.2% converted</span>'
            }
          },
          {
            id: 'Admission Offered',
            color: '#57b9b3',
            offsetVertical: -100,
            dataLabels: {
              format: 'Admission Offered<br><span style="color:gray">89.3% converted</span>'
            }
          },
          {
            id: 'Admission Accepted',
            color: '#57b9b3',
            offsetVertical: -100,
            dataLabels: {
              format: 'Admission Accepted<br><span style="color:gray">97% converted</span>'
            }
          },
          {
            id: 'Enrolled',
            color: '#57b9b3',
            offsetVertical: 80,
            dataLabels: {
              format: 'Enrolled<br><span style="color:gray">92.3% converted</span>'
            }
          },
          {
            id: 'Lost',
            color: '#cccccc',
            offsetVertical: 130,
            dataLabels: {
              format: 'Lost<br><span style="color:gray">Total Lost: ' + totalLost + '</span>'
            }
          }
        ],
        data: funnelData.map((item, i) => ({
          ...item,
          color: item.to === 'Lost' ? '#e0e0e0' : progressionColors[i] || '#57b9b3'
        }))
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768,
          },
          chartOptions: {
            chart: {
              height: '400px',
            },
            title: {
              style: { fontSize: '14px' },
            },
            subtitle: {
              style: { fontSize: '12px' },
            }
          }
        }
      ]
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-5xl mx-auto overflow-x-auto mt-10">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default EnrollmentFunnel;
