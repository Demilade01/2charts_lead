import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Sankey from 'highcharts/modules/sankey';

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
      height: '600',
      marginTop: 150,
      spacingRight: 58,
      events: {
        load() {
          const chart = this;

          // Top labels
          const topLabels = [
            { text: 'Discovery', x: 0, y: 120 },
            { text: 'App Started', x: 150, y: 120 },
            { text: 'App Submitted', x: 300, y: 120 },
            { text: 'App Complete', x: 450, y: 120 },
            { text: 'Admission Offered', x: 600, y: 120 },
            { text: 'Admission Accepted', x: 750, y: 120 },
            { text: 'Enrolled', x: 900, y: 120 },
            { text: 'Lost', x: 900, y: 300 },
          ];

          // Bottom values
          const bottomLabels = [
            { text: '156', x: 0, y: 140 },
            { text: '91', x: 150, y: 140 },
            { text: '86', x: 300, y: 140 },
            { text: '75', x: 450, y: 140 },
            { text: '67', x: 600, y: 140 },
            { text: '65', x: 750, y: 140 },
            { text: '60', x: 900, y: 140 },
            { text: '94', x: 900, y: 320 },
          ];

          topLabels.forEach(({ text, x, y }) => {
            chart.renderer
              .text(text, x, y)
              .css({
                fontSize: '13px',
                fontWeight: 'normal',
                color: '#333',
              })
              .add();
          });

          bottomLabels.forEach(({ text, x, y }) => {
            chart.renderer
              .text(text, x, y)
              .css({
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000',
              })
              .add();
          });
        }
      }
    },
    title: {
      text: 'Lead Funnel & Performance'
    },
    subtitle: {
      text: 'Qualified Leads Conversion for Spring ’25'
    },
    xAxis: [{
      visible: false,
    }],
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
        nodePadding: -100,
        nodeWidth: 7,
        nodeAlignment: 'top',
        curveFactor: -0.1,
        nodeDistance: 100,
        colorByPoint: false,

        nodes: [
          {
            id: 'Discovery/Dev.',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500;">58.3%</div>',
              style: {
                textOutline: 'none',
              },
              x: 50,
              y: -60,
            }
          },
          {
            id: 'App. Started',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500; text-align: center;">94.5%</div>',
              style: {
                textOutline: 'none'
              },
              x: 50,
              y: 0,
            }
          },
          {
            id: 'App. Submitted',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500; text-align: right;">87.2%</div>',
              style: {
                textOutline: 'none'
              },
              x: 50,
              y: 0,
            }
          },
          {
            id: 'App. Complete',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500; text-align: right;">89.3%</div>',
              style: {
                textOutline: 'none'
              },
              x: 50,
              y: 0,
            }
          },
          {
            id: 'Admission Offered',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500; text-align: right;">97%</div>',
              style: {
                textOutline: 'none'
              },
              x: 50,
              y: 0,
            }
          },
          {
            id: 'Admission Accepted',
            color: '#57b9b3',
            dataLabels: {
              format: '<div style="font-size: 25px; color: #777; font-weight: 500; text-align: right;">92.3%</div>',
              style: {
                textOutline: 'none'
              },
              x: 50,
              y: 0,
            }
          },
          {
            id: 'Enrolled',
            color: '#57b9b3',
            dataLabels: {
              enabled: false,
            }
          },
          {
            id: 'Lost',
            color: '#cccccc',
            offsetVertical: 180,
            dataLabels: {
              enabled: false,
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
