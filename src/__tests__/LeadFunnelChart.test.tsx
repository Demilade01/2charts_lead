import { StagesData } from "../data/stagesData";
import { render, screen } from "@testing-library/react";

// Get the mock function for assertions
const mockHighchartsReact = jest.fn().mockImplementation(({ options }) => {
  // Store the options for testing
  (global as any).lastHighchartsOptions = options;
  return <div data-testid="highcharts-container" />;
});

// Mock modules
jest.mock("highcharts-react-official", () => ({
  __esModule: true,
  default: mockHighchartsReact,
}));

jest.mock("highcharts", () => ({
  __esModule: true,
  default: {
    Chart: jest.fn(),
  },
}));

jest.mock("highcharts/modules/sankey.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/generateBracket", () => ({
  generateBracketSvg: jest.fn().mockImplementation(() => "<svg></svg>"),
}));

// Import after mocks
import LeadFunnelChart from "../components/LeadFunnelChart";

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = "";
  jest.clearAllMocks();
  (global as any).lastHighchartsOptions = null;
});

describe("LeadFunnelChart Component", () => {
  // Standard valid test data with moderate drop-off
  const validStagesData: StagesData = {
    discovery: { value: 100, name: "Discovery" },
    started: { value: 80, name: "Started" },
    submitted: { value: 60, name: "Submitted" },
    complete: { value: 40, name: "Complete" },
  };

  // Extended test data with more stages
  const extendedStagesData: StagesData = {
    discovery: { value: 200, name: "Discovery" },
    interested: { value: 180, name: "Interested" },
    applied: { value: 150, name: "Applied" },
    qualified: { value: 120, name: "Qualified" },
    interviewed: { value: 90, name: "Interviewed" },
    offered: { value: 70, name: "Offered" },
    accepted: { value: 50, name: "Accepted" },
    enrolled: { value: 40, name: "Enrolled" },
  };

  // Test data with high retention (small drop-offs)
  const highRetentionData: StagesData = {
    discovery: { value: 100, name: "Discovery" },
    started: { value: 95, name: "Started" },
    submitted: { value: 92, name: "Submitted" },
    complete: { value: 90, name: "Complete" },
  };

  // Test data with low retention (large drop-offs)
  const lowRetentionData: StagesData = {
    discovery: { value: 100, name: "Discovery" },
    started: { value: 40, name: "Started" },
    submitted: { value: 15, name: "Submitted" },
    complete: { value: 5, name: "Complete" },
  };

  // Test data with large values (to test scaling)
  const largeValuesData: StagesData = {
    discovery: { value: 10000, name: "Discovery" },
    started: { value: 7500, name: "Started" },
    submitted: { value: 5000, name: "Submitted" },
    complete: { value: 2500, name: "Complete" },
  };

  // Test data with small values (to test scaling)
  const smallValuesData: StagesData = {
    discovery: { value: 10, name: "Discovery" },
    started: { value: 8, name: "Started" },
    submitted: { value: 6, name: "Submitted" },
    complete: { value: 4, name: "Complete" },
  };

  // Test data with identical values (no drop-off)
  const identicalValuesData: StagesData = {
    discovery: { value: 100, name: "Discovery" },
    started: { value: 100, name: "Started" },
    submitted: { value: 100, name: "Submitted" },
    complete: { value: 100, name: "Complete" },
  };

  // Test data with zero values
  const zeroValuesData: StagesData = {
    discovery: { value: 100, name: "Discovery" },
    started: { value: 0, name: "Started" },
    submitted: { value: 0, name: "Submitted" },
    complete: { value: 0, name: "Complete" },
  };

  // Invalid test data (empty object)
  const emptyStagesData: StagesData = {};

  // Invalid test data (with negative values)
  const negativeStagesData: StagesData = {
    discovery: { value: -10, name: "Discovery" },
    started: { value: -5, name: "Started" },
  };

  // Invalid test data (with missing properties)
  const incompleteStagesData = {
    discovery: { value: 100 }, // missing name
    started: { name: "Started" }, // missing value
  } as any;

  // Test data with custom names
  const customNamesData: StagesData = {
    phase1: { value: 100, name: "Phase 1: Awareness" },
    phase2: { value: 75, name: "Phase 2: Consideration" },
    phase3: { value: 50, name: "Phase 3: Decision" },
    phase4: { value: 25, name: "Phase 4: Action" },
  };

  beforeEach(() => {
    // Reset the stored options before each test
    (global as any).lastHighchartsOptions = null;
    jest.clearAllMocks();
  });

  it("renders with valid data", () => {
    render(<LeadFunnelChart stagesData={validStagesData} />);
    expect(screen.getByTestId("highcharts-container")).toBeTruthy();
    expect(mockHighchartsReact).toHaveBeenCalled();
  });

  it("renders with default data when no data is provided", () => {
    render(<LeadFunnelChart stagesData={undefined as any} />);
    expect(screen.getByTestId("highcharts-container")).toBeTruthy();
    expect(mockHighchartsReact).toHaveBeenCalled();
  });

  it("calculates total lost value correctly", () => {
    render(<LeadFunnelChart stagesData={validStagesData} />);

    // Total lost should be (100-80) + (80-60) + (60-40) = 20 + 20 + 20 = 60
    const options = (global as any).lastHighchartsOptions;
    const nodes = options.series[0].nodes;

    // Find the "Lost" node
    const lostNode = nodes.find((node: any) => node.name === "Lost");
    expect(lostNode).toBeDefined();
    expect(lostNode.value).toBe(60);
  });

  it("generates correct nodes and links structure", () => {
    render(<LeadFunnelChart stagesData={validStagesData} />);

    const options = (global as any).lastHighchartsOptions;
    const nodes = options.series[0].nodes;
    const data = options.series[0].data;

    // Check nodes
    // Should have nodes for each stage plus one for "Lost"
    expect(nodes.length).toBe(Object.keys(validStagesData).length + 1);

    // Check main flow links
    const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
    expect(mainFlowLinks.length).toBe(Object.keys(validStagesData).length - 1);

    // Check loss flow links
    const lossFlowLinks = data.filter((link: any) => link.to === "Lost");
    expect(lossFlowLinks.length).toBe(Object.keys(validStagesData).length - 1);

    // Check total links
    expect(data.length).toBe(mainFlowLinks.length + lossFlowLinks.length);
  });

  it("calculates percentages correctly for main flow links", () => {
    render(<LeadFunnelChart stagesData={validStagesData} />);

    const options = (global as any).lastHighchartsOptions;
    const data = options.series[0].data;

    // Filter for main flow links (not to "Lost")
    const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");

    // Check the first link (Discovery to Started)
    const firstLink = mainFlowLinks.find(
      (link: any) => link.from === "Discovery" && link.to === "Started"
    );

    expect(firstLink).toBeDefined();
    expect(firstLink.labelText).toBe("80.0%"); // (80/100) * 100 = 80.0%
  });

  it("handles empty data gracefully", () => {
    render(<LeadFunnelChart stagesData={emptyStagesData} />);
    expect(screen.getByTestId("highcharts-container")).toBeTruthy();
  });

  it("handles negative values correctly", () => {
    render(<LeadFunnelChart stagesData={negativeStagesData} />);
    const options = (global as any).lastHighchartsOptions;
    const nodes = options.series[0].nodes;

    // Nodes should still be created
    expect(nodes.length).toBe(Object.keys(negativeStagesData).length + 1);

    // Lost value calculation should handle negative values
    const lostNode = nodes.find((node: any) => node.name === "Lost");
    expect(lostNode).toBeDefined();
    expect(lostNode.value).toBe(-5); // The actual implementation returns -5
  });

  it("handles incomplete data gracefully", () => {
    render(<LeadFunnelChart stagesData={incompleteStagesData} />);
    expect(screen.getByTestId("highcharts-container")).toBeTruthy();
  });

  // Tests for extended data with more stages
  describe("with extended data (more stages)", () => {
    it("handles extended data correctly", () => {
      render(<LeadFunnelChart stagesData={extendedStagesData} />);

      // Check rendering
      expect(screen.getByTestId("highcharts-container")).toBeTruthy();
      expect(mockHighchartsReact).toHaveBeenCalled();

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;

      // Check node count
      expect(nodes.length).toBe(Object.keys(extendedStagesData).length + 1);

      // Calculate expected lost value
      const stagesArray = Object.values(extendedStagesData);
      const expectedLostValue = stagesArray
        .slice(0, -1)
        .reduce(
          (sum, current, i) => sum + current.value - stagesArray[i + 1].value,
          0
        );

      // Check lost value
      const lostNode = nodes.find((node: any) => node.name === "Lost");
      expect(lostNode).toBeDefined();
      expect(lostNode.value).toBe(expectedLostValue);
    });
  });

  // Tests for different retention rates
  describe("with different retention rates", () => {
    it("handles high retention data correctly", () => {
      render(<LeadFunnelChart stagesData={highRetentionData} />);

      const options = (global as any).lastHighchartsOptions;
      const data = options.series[0].data;

      // Check percentages
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) => link.from === "Discovery" && link.to === "Started"
      );
      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("95.0%"); // (95/100) * 100 = 95.0%

      // Check loss flow
      const lossFlowLinks = data.filter((link: any) => link.to === "Lost");
      const discoveryToLostLink = lossFlowLinks.find(
        (link: any) => link.from === "Discovery"
      );
      expect(discoveryToLostLink).toBeDefined();
      expect(discoveryToLostLink.weight).toBe(5); // 100 - 95 = 5
    });

    it("handles low retention data correctly", () => {
      render(<LeadFunnelChart stagesData={lowRetentionData} />);

      const options = (global as any).lastHighchartsOptions;
      const data = options.series[0].data;

      // Check percentages
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) => link.from === "Discovery" && link.to === "Started"
      );
      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("40.0%"); // (40/100) * 100 = 40.0%

      // Check loss flow
      const lossFlowLinks = data.filter((link: any) => link.to === "Lost");
      const discoveryToLostLink = lossFlowLinks.find(
        (link: any) => link.from === "Discovery"
      );
      expect(discoveryToLostLink).toBeDefined();
      expect(discoveryToLostLink.weight).toBe(60); // 100 - 40 = 60
    });
  });

  // Tests for scaling with different value ranges
  describe("with different value ranges (scaling)", () => {
    it("handles large values correctly", () => {
      render(<LeadFunnelChart stagesData={largeValuesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node value
      const firstNode = nodes.find((node: any) => node.name === "Discovery");
      expect(firstNode).toBeDefined();
      expect(firstNode.value).toBe(10000);

      // Check percentage calculation
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) => link.from === "Discovery" && link.to === "Started"
      );
      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("75.0%"); // (7500/10000) * 100 = 75.0%
    });

    it("handles small values correctly", () => {
      render(<LeadFunnelChart stagesData={smallValuesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node value
      const firstNode = nodes.find((node: any) => node.name === "Discovery");
      expect(firstNode).toBeDefined();
      expect(firstNode.value).toBe(10);

      // Check percentage calculation
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) => link.from === "Discovery" && link.to === "Started"
      );
      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("80.0%"); // (8/10) * 100 = 80.0%
    });
  });

  // Tests for edge cases (identical values and zero values)
  describe("with edge case values", () => {
    it("handles identical values correctly", () => {
      render(<LeadFunnelChart stagesData={identicalValuesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node values
      const nodeValues = nodes
        .filter((node: any) => node.name !== "Lost")
        .map((node: any) => node.value);
      expect(nodeValues.every((value: number) => value === 100)).toBe(true);

      // Check percentages
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const percentages = mainFlowLinks.map((link: any) => link.labelText);
      expect(
        percentages.every((percentage: string) => percentage === "100.0%")
      ).toBe(true);

      // Check lost value
      const lostNode = nodes.find((node: any) => node.name === "Lost");
      expect(lostNode).toBeDefined();
      expect(lostNode.value).toBe(0);
    });

    it("handles zero values correctly", () => {
      render(<LeadFunnelChart stagesData={zeroValuesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node values
      const startedNode = nodes.find((node: any) => node.name === "Started");
      expect(startedNode).toBeDefined();
      expect(startedNode.value).toBe(0);

      // Check percentages
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) => link.from === "Discovery" && link.to === "Started"
      );
      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("0.0%"); // (0/100) * 100 = 0.0%
    });
  });

  // Tests for custom stage names
  describe("with custom stage names", () => {
    it("handles custom stage names correctly", () => {
      render(<LeadFunnelChart stagesData={customNamesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node names
      const nodeNames = nodes
        .filter((node: any) => node.name !== "Lost")
        .map((node: any) => node.name);

      expect(nodeNames).toContain("Phase 1: Awareness");
      expect(nodeNames).toContain("Phase 2: Consideration");
      expect(nodeNames).toContain("Phase 3: Decision");
      expect(nodeNames).toContain("Phase 4: Action");

      // Check percentage calculation
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks.find(
        (link: any) =>
          link.from === "Phase 1: Awareness" &&
          link.to === "Phase 2: Consideration"
      );

      expect(firstLink).toBeDefined();
      expect(firstLink.labelText).toBe("75.0%"); // (75/100) * 100 = 75.0%
    });
  });

  // Tests for chart styling and configuration
  describe("chart styling and configuration", () => {
    it("applies correct styling and configuration", () => {
      render(<LeadFunnelChart stagesData={validStagesData} />);

      const options = (global as any).lastHighchartsOptions;
      const nodes = options.series[0].nodes;
      const data = options.series[0].data;

      // Check node colors
      const regularNode = nodes.find((node: any) => node.name === "Discovery");
      expect(regularNode).toBeDefined();
      expect(regularNode.color).toBe("#57b9b3");

      const lostNode = nodes.find((node: any) => node.name === "Lost");
      expect(lostNode).toBeDefined();
      expect(lostNode.color).toBe("#D9D9D9");

      // Check link colors
      const mainFlowLinks = data.filter((link: any) => link.to !== "Lost");
      const firstLink = mainFlowLinks[0];
      expect(firstLink.color).toHaveProperty("linearGradient");
      expect(firstLink.color).toHaveProperty("stops");

      const lossFlowLinks = data.filter((link: any) => link.to === "Lost");
      const firstLossLink = lossFlowLinks[0];
      expect(firstLossLink.color).toBe("#F2F2F2");

      // Check chart configuration
      expect(options.chart.type).toBe("sankey");
      expect(options.credits.enabled).toBe(false);
      expect(options.tooltip.enabled).toBe(true);
      expect(options.tooltip.formatter).toBeDefined();

      // Check sankey options
      expect(options.plotOptions.sankey).toBeDefined();
      expect(options.plotOptions.sankey.nodePadding).toBeDefined();
      expect(options.plotOptions.sankey.nodeWidth).toBeDefined();

      // Check render events
      expect(options.chart.events).toBeDefined();
      expect(options.chart.events.render).toBeDefined();
    });
  });

  // Tests for custom features
  describe("custom chart features", () => {
    it("configures custom rendering features correctly", () => {
      // Render the component
      render(<LeadFunnelChart stagesData={validStagesData} />);

      // Get chart options
      const options = (global as any).lastHighchartsOptions;

      // Check render function for custom Y-axis and cylinders
      const renderFn = options.chart.events.render;
      expect(renderFn).toBeDefined();
      expect(typeof renderFn).toBe("function");

      // Check dataLabels formatter for bracket SVG
      expect(options.plotOptions.sankey.dataLabels.formatter).toBeDefined();
    });

    it("configures render functions for different data scales", () => {
      // Render with large values
      render(<LeadFunnelChart stagesData={largeValuesData} />);
      const largeOptions = (global as any).lastHighchartsOptions;
      expect(largeOptions.chart.events.render).toBeDefined();
    });

    it("configures render functions for small data values", () => {
      // Render with small values
      render(<LeadFunnelChart stagesData={smallValuesData} />);
      const smallOptions = (global as any).lastHighchartsOptions;
      expect(smallOptions.chart.events.render).toBeDefined();
    });
  });
});
