import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import EnrollmentFunnel from './EnrollmentFunnel';

// Mock Highcharts and the Sankey module to prevent SeriesRegistry errors
jest.mock('highcharts', () => ({
  ...jest.requireActual('highcharts'), // Keep the actual Highcharts behavior
  modules: {
    // Mock the Sankey module to avoid errors related to SeriesRegistry
    sankey: jest.fn().mockImplementation(() => {}),
  },
}));

// Mock Highcharts React Component
jest.mock('highcharts-react-official', () => ({
  __esModule: true,
  default: ({ options }: { options: any }) => (
    <div>
      <div>Mocked Highcharts Component</div>
      <pre>{JSON.stringify(options, null, 2)}</pre>
    </div>
  ),
}));

describe('EnrollmentFunnel Component', () => {
  // Test if the component renders correctly
  test('should render EnrollmentFunnel component', () => {
    render(<EnrollmentFunnel />);

    // Assert that the component renders and the mock chart is displayed
    expect(screen.getByText(/Mocked Highcharts Component/i)).toBeInTheDocument();
  });

  // Test if the chart data is passed correctly
  test('should generate chart data correctly', () => {
    render(<EnrollmentFunnel />);

    // Check if the mock component contains the expected chart options
    const chartOptions = screen.getByText(/"data":/i).textContent;
    expect(chartOptions).toContain('Discovery/Dev.');
    expect(chartOptions).toContain('App. Started');
    expect(chartOptions).toContain('Lost');
    expect(chartOptions).toContain('weight');
  });

  // Test if the tooltip shows the correct information
  test('should display correct tooltip for loss', () => {
    render(<EnrollmentFunnel />);

    // Simulate mouse over event for 'Lost'
    fireEvent.mouseOver(screen.getByText(/Mocked Highcharts Component/i));

    // Assuming tooltip appears on hover, you can mock or spy on tooltip behavior
    // In this case, we check the chart data for 'Lost' and simulate its tooltip
    expect(screen.getByText(/Loss/i)).toBeInTheDocument();
    expect(screen.getByText(/leads dropped/i)).toBeInTheDocument();
  });
});
