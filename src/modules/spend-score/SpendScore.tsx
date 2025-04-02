import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from "react-dom/server";
import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import 'highcharts/modules/accessibility';

const ChartLabel = ({ valueDiff, targetValue }: { valueDiff: number; targetValue: number }) => {
    return (
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative" }}>
            {valueDiff !== 0 ? (<div style={{ position: "absolute", right: '-20%', bottom: '10%' }}>
                {valueDiff > 0 ? (
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <polygon points="10,0 20,15 0,15" fill="black" />
                  </svg>
                ) : null}
                {valueDiff < 0 ? (
                 <svg width="20" height="20" viewBox="0 0 20 20">
                    <polygon points="10,20 0,5 20,5" fill="black" />
                 </svg>
                ) : null}
              <span style={{ color: valueDiff > 0 ? 'green' : 'red' }}>{Math.abs(valueDiff)}</span>
            </div>) : null}
            <span style={{ fontSize: 32 }}>{'{y}'}</span>
            <br />
          </div>
          <span style={{ fontSize: 18, fontWeight: 400, whiteSpace: "nowrap" }}>
            Target: {targetValue}
          </span>
        </div>
      );
}

const formatLabelToHtml = ({ valueDiff, targetValue }: { valueDiff: number; targetValue: number }) => {
    const htmlString = ReactDOMServer.renderToStaticMarkup(<ChartLabel valueDiff={valueDiff} targetValue={targetValue} />);
    // console.log(htmlString); // Outputs pure HTML string
    return htmlString;
};


const normalizeRangeValue = (min: number, max: number, value: number): number => 
    (value - min) / (max - min);

interface ChartProps {
    prevValue: number;
    value: number;
    target: number;
    min: number;
    max: number;
}
const SemiDonutChart = ({target: targetValue, value, prevValue, min, max}: ChartProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chartSpeed, setChartSpeed] = useState<Highcharts.Chart | null>(null)
    const valueDiff = Number((value - prevValue).toFixed(2));

    const createChart = () => {
        const gaugeOptions = {
            chart: {
                type: 'solidgauge'
            },
            title: null,
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: Highcharts.color('#f4f0f0').get(),
                    borderRadius: 5,
                    borderWidth: 0,
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            // the value axis
            yAxis: {
                min,
                max,
                tickPositions: [min, max], // Ensure only 0 and 3 are shown assuming min=0 and max=3
                labels: {
                    y: 25,
                    style: {
                        fontSize: '18px', // Increase font size
                        fontWeight: 'bold', // Make it bold if needed
                        color: '#000' // Ensure visibility
                    }
                },
                stops: [
                    [normalizeRangeValue(min, max, 1), Highcharts.color('#EA4335').get()], // red
                    [normalizeRangeValue(min, max, 1.5), Highcharts.color('#EF9544').get()], // orange
                    [normalizeRangeValue(min, max, targetValue > 2 || targetValue < 1.5 ? 1.8 : targetValue), Highcharts.color('#F4EF59').get()], // yellow
                    [normalizeRangeValue(min, max, 2), Highcharts.color('#c0da66').get()], // line-green
                    [normalizeRangeValue(min, max, 3), Highcharts.color('#00A308').get()], // green
                ],
                lineWidth: 0,
                tickWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
            },
            plotOptions: {
                solidgauge: {
                    borderRadius: 3,
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            series: [{
                name: 'Score',
                data: [value],
                dataLabels: {
                    y: -50,
                    format: formatLabelToHtml({ targetValue, valueDiff })
                },
                tooltip: {
                    valueSuffix: ' Points'
                }
            },  {
                name: 'Benchmark',
                isRectanglePoint: true,
                type: 'gauge',
                data: [targetValue],
                dial: {
                  backgroundColor: Highcharts.color('#9b9a9a').get(),
                  rearLength: '-53%',
                  baseLength: '100%',
                  radius: '105%',
                },
                dataLabels: {
                  enabled: false
                },
                pivot: {
                    radius: 0
                }
              }]
        };
        
        // @ts-ignore
        const chart = Highcharts.chart(chartRef.current as HTMLDivElement, gaugeOptions)
        setChartSpeed(chart);
    }

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartRef.current && !chartSpeed) {
            createChart()
        }
    }, [chartRef, chartSpeed])

    useEffect(() => {
        if (!chartSpeed) return;
        let point = chartSpeed.series[0].points[0] as Highcharts.Point;
        point.update(value);
    }, [value])

    useEffect(() => {
        if (!chartSpeed) return;
        chartSpeed.destroy();
        createChart()
    }, [min, max, targetValue, value])

  return (
    <div style={{height: '300px', width: '100%'}} ref={chartRef}></div>
  );
};

export default SemiDonutChart;
