export interface FunnelStage {
  name: string;
  value: number;
  conversionRate?: number; // as float (e.g. 0.583)
}

export interface ProcessedEnrollmentData {
  from: string;
  to: string;
  weight: number;
  percentage?: number;
}

export interface EnrollmentFunnelProps {
  data: ProcessedEnrollmentData[];
}

export interface LeadFunnelData {
  map: any;
  title: string;
  description: string;
  stages: FunnelStage[];
  benchmarks?: {
    local: number;
    implied: number;
  };
}

export const leadFunnelData: LeadFunnelData = {
  title: "Lead Funnel & Performance",
  description: "Qualified Leads Comparison - Compare funnel performance to a benchmark.",
  stages: [
    { name: "Discovery/Dev.", value: 156, conversionRate: 0.583 },
    { name: "App. Started", value: 91, conversionRate: 0.945 },
    { name: "App. Submitted", value: 86, conversionRate: 0.872 },
    { name: "App. Complete", value: 75, conversionRate: 0.893 },
    { name: "Admission Offered", value: 67, conversionRate: 0.97 },
    { name: "Admission Accepted", value: 65, conversionRate: 0.923 },
    { name: "Enrolled", value: 60 }
  ],
  benchmarks: {
    local: 94,
    implied: 60
  },
  map: undefined
};
