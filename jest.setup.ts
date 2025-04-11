import "@testing-library/jest-dom";

// Mock for Highcharts Sankey module
jest.mock("highcharts/modules/sankey.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock for generateBracketSvg
jest.mock("@/lib/generateBracket", () => ({
  generateBracketSvg: jest.fn().mockImplementation(() => "<svg></svg>"),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
