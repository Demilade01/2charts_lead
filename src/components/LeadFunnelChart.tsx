import { StagesData } from "../data/stagesData";
import { generateBracketSvg } from "../lib/generateBracket";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SankeyModule from "highcharts/modules/sankey.js";

// Initialize Highcharts Sankey module for client-side rendering
if (typeof window === "undefined") {
  SankeyModule(Highcharts);
}

// Define interfaces for TypeScript
interface SankeyData {
  from: string;
  to: string;
  weight: number;
  color?: string | { linearGradient: any; stops: any[] };
  labelText?: string;
}

interface LeadFunnelChartProps {
  stagesData: StagesData;
}

const defaultData: StagesData = {
  discovery: { value: 156, name: "Discovery/Dev" },
  started: { value: 91, name: "App Started" },
  submitted: { value: 86, name: "App Submitted" },
  complete: { value: 75, name: "App Complete" },
  offered: { value: 67, name: "Admission Offered" },
  accepted: { value: 65, name: "Admission Accepted" },
  enrolled: { value: 60, name: "Enrolled" },
};

// Color theme constants
const COLOR_THEME = {
  BAR_COLOR: "#57b9b3",
  GRAY_COLOR: "#D9D9D9",
  GRADIENT_COLOR: {
    linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
    stops: [
      [0, "#dbfefc"],
      [1, "#ffffff"],
    ],
  },
  LOST_FLOW: "#F2F2F2",
};

export default function LeadFunnelChart({
  stagesData = defaultData,
}: LeadFunnelChartProps) {
  // Use provided stages or default dat

  const stagesArray = Object.values(stagesData);

  // Calculate total lost value
  const totalLost = stagesArray
    .slice(0, -1)
    .reduce(
      (sum, current, i) => sum + current.value - stagesArray[i + 1].value,
      0
    );

  const allStages = {
    ...stagesData,
    lost: { value: totalLost, name: "Lost" },
  };

  // Generate Sankey nodes
  const nodes = Object.entries(allStages).map(
    ([key, { value, name }], index) => ({
      id: name,
      name,
      value,
      color: key === "lost" ? COLOR_THEME.GRAY_COLOR : COLOR_THEME.BAR_COLOR,
      column: key === "lost" ? stagesArray.length - 1 : index,
      offset: 0,
      dataLabels: {
        nodeFormatter: function (this: any) {
          return `
          <div>
            <div style="font-size: 12px; color: #6a7282; margin-bottom: -px;">${this.point.name}</div>
            <div style="font-size: 14px; font-weight: bold; margin: 3px 0;">${this.point.value}</div>
          </div>
        `;
        },
      },
    })
  );

  // Generate main flow links
  const mainFlow: SankeyData[] = Object.keys(stagesData)
    .slice(0, -1)
    .map((key, index) => {
      const stageKeys = Object.keys(stagesData);
      const currentStage = stagesData[key as keyof typeof stagesData];
      const nextStage =
        stagesData[stageKeys[index + 1] as keyof typeof stagesData];
      const percentage = ((nextStage.value / currentStage.value) * 100).toFixed(
        1
      );
      return {
        from: currentStage.name,
        to: nextStage.name,
        weight: nextStage.value,
        color: COLOR_THEME.GRADIENT_COLOR,
        labelText: `${percentage}%`,
      };
    });

  // Generate loss flow links
  const lossFlow: SankeyData[] = Object.keys(stagesData)
    .slice(0, -1)
    .reverse()
    .map((_, index) => {
      const reversedKeys = Object.keys(stagesData).slice(0, -1).reverse();
      const currentKey = reversedKeys[index];
      const currentStage = stagesData[currentKey as keyof typeof stagesData];
      const nextStageIndex = Object.keys(stagesData).indexOf(currentKey) + 1;
      const nextStage =
        stagesData[
          Object.keys(stagesData)[nextStageIndex] as keyof typeof stagesData
        ];
      const lostValue = currentStage.value - nextStage.value;
      return {
        from: currentStage.name,
        to: "Lost",
        weight: lostValue,
        color: COLOR_THEME.LOST_FLOW,
      };
    });

  // Function to draw loss flow cylinders
  const drawCylinders = (
    chart: Highcharts.Chart & { customCylinders?: Highcharts.SVGElement[] }
  ) => {
    const sankeySeries = chart.series[0] as Highcharts.Series & {
      nodes: any[];
    };
    const cylinderWidth = 10;

    // Clean up existing cylinders
    if (chart.customCylinders) {
      chart.customCylinders.forEach((cyl) => cyl?.destroy());
    }
    chart.customCylinders = [];

    // Group links by source
    const linksBySource = sankeySeries.points.reduce(
      (acc: Record<string, any[]>, point: any) => {
        const source = point.from;
        acc[source] = acc[source] || [];
        acc[source].push(point);
        return acc;
      },
      {}
    );

    sankeySeries.points.forEach((point: any) => {
      if (point.to !== "Lost") return;
      const fromNode = sankeySeries.nodes.find((n) => n.id === point.from);
      if (!fromNode?.shapeArgs) return;

      const sourceLinks = linksBySource[point.from] || [];
      const sortedLinks = sourceLinks.sort((a: any, b: any) => a.y - b.y);
      const linkIndex = sortedLinks.indexOf(point);
      const cumulativeHeight = sortedLinks
        .slice(0, linkIndex)
        .reduce((sum: number, l: any) => sum + l.weight, 0);

      const nodeHeight = fromNode.shapeArgs.height;
      const cylinderHeight = (point.weight / fromNode.sum) * nodeHeight;
      const cylinderY =
        fromNode.shapeArgs.y + (cumulativeHeight / fromNode.sum) * nodeHeight;
      const cylinderX = fromNode.shapeArgs.x + fromNode.shapeArgs.width + 1;

      const cylinder = chart.renderer
        .rect(cylinderX + 49, cylinderY + 50, cylinderWidth, cylinderHeight, 5)
        .attr({ fill: COLOR_THEME.GRAY_COLOR, stroke: "none", zIndex: 4 })
        .add();
      // @ts-expect-error - Custom property for cylinders
      chart.customCylinders.push(cylinder);
    });
  };

  // Function to draw custom y-axis
  const drawCustomYAxis = (
    chart: Highcharts.Chart & { customYAxisElements?: Highcharts.SVGElement[] }
  ) => {
    const chartHeight = chart.plotHeight;
    const chartTop = chart.plotTop;
    const maxDataValue = Math.max(...stagesArray.map((stage) => stage.value));
    const firstNode = (chart.series[0] as any).nodes[0];
    const nodeHeight = firstNode?.shapeArgs?.height || 0;
    const nodeValue = firstNode?.sum || maxDataValue;
    const pixelsPerUnit = nodeHeight / nodeValue;
    const maxYAxisValue = Math.ceil(chartHeight / pixelsPerUnit / 50) * 50;

    // Clean up existing y-axis elements
    if (chart.customYAxisElements) {
      chart.customYAxisElements.forEach((el) => el?.destroy());
    }
    chart.customYAxisElements = [];

    const yAxisXPosition = chart.plotLeft - 5;
    for (let i = 0; i <= maxYAxisValue; i += 25) {
      const isMajorTick = i % 50 === 0;
      const tickLength = isMajorTick ? 20 : 8;
      const tickY = chartTop + i * pixelsPerUnit;

      const tick = chart.renderer
        // @ts-expect-error - Highcharts internal structure
        .path([
          "M",
          yAxisXPosition,
          tickY,
          "L",
          yAxisXPosition - tickLength,
          tickY,
        ])
        .attr({ stroke: "#6a7282", "stroke-width": 1 })
        .add();
      chart.customYAxisElements.push(tick);

      if (isMajorTick) {
        const label = chart.renderer
          .text(i.toString(), yAxisXPosition - tickLength - 5, tickY + 4)
          .css({ fontSize: "10px", color: "#6a7282" })
          .attr({ align: "right" })
          .add();
        chart.customYAxisElements.push(label);
      }
    }
  };

  // Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: "sankey",
      events: {
        render: function () {
          drawCylinders(this as any);
          drawCustomYAxis(this as any);
        },
      },
      backgroundColor: "transparent",
      spacing: [50, 50, 10, 50],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      enabled: true,
      outside: true,
      useHTML: true,
      formatter: function (this: any) {
        if (this.point.isNode) {
          let text = "leads have progressed to this stage of the funnel";

          if (this.point.name === "Lost") {
            text = "leads were lost";
          }

          return `
            <div style="padding: 10px;">
              <b>${this.point.value}</b> ${text}
            </div>
          `;
        }
        if ("to" in this.point) {
          let text = `leads from ${this.point.from} moved to ${this.point.to}`;

          if (this.point.to === "Lost") {
            text = `leads from ${this.point.from} were lost`;
          }

          return `
            <div style="padding: 10px;">
              <b>${this.point.weight}</b> ${text}
            </div>
          `;
        }

        return false;
      },
    },
    plotOptions: {
      sankey: {
        dataLabels: {
          enabled: true,
          align: "left",
          verticalAlign: "top",

          style: {
            fontSize: "10px",
            fontWeight: "normal",
            textOutline: "none",
          },
          y: -50,
          x: -5,
          inside: false,
          overflow: "allow",
          crop: false,
          useHTML: true,
          formatter: function (this: any) {
            if (this.point.options.labelText) {
              return `
                ${generateBracketSvg(this.point.dlBox?.height || 0)}
                <div style="position: absolute; top: ${
                  (this.point.dlBox?.height || 0) / 2 + 37
                }px; left: -40px; font-size: 14px; color: #386b67;">
                  ${this.point.options.labelText}
                </div>
              `;
            }
            return "";
          },
        },
        nodePadding: 50,
        nodeWidth: 10,
        curveFactor: 0.6,
        linkOpacity: 0.5,
        // @ts-expect-error - Custom property for border radius
        borderRadius: 5,
      },
    },
    navigation: {
      buttonOptions: { enabled: true, verticalAlign: "top" },
    },
    series: [
      {
        type: "sankey",
        name: "Lead Flow",
        data: [...mainFlow, ...lossFlow],
        nodes,
        nodeAlignment: "top",
      },
    ],
  };

  return (
    <div className="overflow-visible">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: "100%", overflow: "visible" } }}
      />
    </div>
  );
}
