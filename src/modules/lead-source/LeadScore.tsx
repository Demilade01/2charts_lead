import { useEffect, useRef, useState } from "react";
import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import 'highcharts/modules/accessibility';

export interface LeadScoreChartSource {
     label: string, value: number;
}
export interface LeadScoreChartProps {
    sources: LeadScoreChartSource[];
}

const colors = ['#1E255E', '#E8973C']

export const LeadScore = (props: LeadScoreChartProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chartInstance, setChartSpeed] = useState<Highcharts.Chart | null>(null)
        const createChart = () => {
            const options = {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    format: '<span>{y}% of your leads are from <strong>{name}</strong> sources.<br/>Organic sources include brand, webinars, and lead list uploads</span>',
                    shared: true
                },
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    layout: 'vertical',
                    symbolRadius: 0,
                    x: -20,
                    y: 100
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [
                   {
                        name: 'Traffic Source',
                        data: props.sources.map((source, idx) => ({
                            name: source.label,
                            y: (source.value / props.sources.reduce((acc, s) => acc + s.value, 0)) * 100,
                            color: colors[idx%colors.length]
                        }))
                    }
                ]
            };
            
            // @ts-expect-error some complain about method overload
            const chart = Highcharts.chart(chartRef.current as HTMLDivElement, options)
            setChartSpeed(chart);
        }
    
        useEffect(() => {
            if (!chartRef.current) return;
    
            if (chartRef.current && !chartInstance) {
                createChart()
            }
        }, [chartRef, chartInstance])
        
    return (
        <div style={{height: '300px', width: '100%'}} ref={chartRef}></div>
    )
}
