import { useMemo } from "react";
import { Tooltip } from "./Tooltip";
import "./AdSpend.scss"


interface AdSpendSeries {
    label: string;
    value: number;
    target: number;
}
interface AdSpendProps {
    series: AdSpendSeries[]
}


const colors = ['#2469f6', '#ff2500', '#027bb6'];
const tooltipTemplate = [
    [
        "{value} is your total spend on Meta for selected time period",
        "{value} is your total budget for Meta this fiscal year [fiscal year dates in format MM/DD/YYY to MM/DD/YYY]",
    ],
    [
        "{value} is your total spend on Google Ads for selected time period",
        "{value} is your total budget for Google Ads this fiscal year [fiscal year dates in format MM/DD/YYY to MM/DD/YYY]",
    ],
    [
        "{value} is your total spend on Linkedin for selected time period",
        "{value} is your budget for Linkedin this fiscal ear [fiscal year dates in format MM/DD/YYY to MM/DD/YYY]"
    ],
    [
        "{value} is your total spend across all channels for the selected time period.",
        "{value} is your total budget for all channels for this fiscal year [fiscal year dates in format MM/DD/YYY to MM/DD/YYY]"
    ],
]

export const AdSpend = ({ series }: AdSpendProps) => {
    const total = useMemo(() => {
        return {
            label: 'Total Spend',
            value: '$'+ series.reduce((acc, s) => acc + s.value, 0).toLocaleString(),
            target: '$'+ series.reduce((acc, s) => acc + s.target, 0).toLocaleString(),
            tooltipTemplate: tooltipTemplate[3],
        }
    }, [])

    const normalizedSeries = useMemo(() => series.map((s, idx) => ({
        label: s.label,
        value: '$'+ s.value.toLocaleString(),
        target: '$' + s.target.toLocaleString(),
        color: colors[idx%colors.length],
        tooltipTemplate: tooltipTemplate[idx],
    })), [series])

  return (
    <div className="ad-spend__main">
        <div className="ad-spend__grid">
            {normalizedSeries.map((s) => (
                <div className="ad-spend__item">
                    <span className="ad-spend__item__label">{s.label}</span>
                    <span className="ad-spend__item__divider" style={{backgroundColor: s.color}}></span>
                    <Tooltip content={
                        <span className="ad-spend__item__value">{s.value}</span>
                    } tooltipText={s.tooltipTemplate[0].replace('{value}', s.value)} />
                    <Tooltip content={
                        <span className="ad-spend__item__target">{s.target}</span>
                    } tooltipText={s.tooltipTemplate[1].replace('{value}', s.target)} />
                </div>
            ))}
            <div className="ad-spend__total">
                <span className="ad-spend__total__label">{total.label}</span>
                <Tooltip content={
                    <span className="ad-spend__total__value">{total.value}</span>
                } tooltipText={total.tooltipTemplate[0].replace('{value}', total.value)} />
                <Tooltip content={
                    <span className="ad-spend__total__target">{total.target}</span>
                } tooltipText={total.tooltipTemplate[1].replace('{value}', total.value)} />
            </div>
        </div>
    </div>
  );
}
