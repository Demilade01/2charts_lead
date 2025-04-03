export interface RawEnrollmentData {
  stage: string;
  leads: number;
  nextStage: string;
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