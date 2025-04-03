import React, { useState, useEffect } from 'react';
import EnrollmentFunnel from './EnrollmentFunnel';

interface RawEnrollmentData {
  stage: string;
  leads: number;
  nextStage: string;
}

interface ProcessedEnrollmentData {
  from: string;
  to: string;
  weight: number;
}

const EnrollmentFunnelContainer: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedEnrollmentData[]>([]);

  // This would typically come from an API or other data source
  const mockData: RawEnrollmentData[] = [
    { stage: 'Discovery/Dev.', leads: 1000, nextStage: 'App. Started' },
    { stage: 'App. Started', leads: 800, nextStage: 'App. Submitted' },
    { stage: 'App. Submitted', leads: 600, nextStage: 'App. Complete' },
    { stage: 'App. Complete', leads: 400, nextStage: 'Admission Offered' },
    { stage: 'Admission Offered', leads: 300, nextStage: 'Admission Accepted' },
    { stage: 'Admission Accepted', leads: 200, nextStage: 'Enrolled' },
    { stage: 'Enrolled', leads: 150, nextStage: 'Conversion and Loss' }
  ];

  useEffect(() => {
    const processData = (rawData: RawEnrollmentData[]): ProcessedEnrollmentData[] => {
      const processed: ProcessedEnrollmentData[] = [];

      rawData.forEach((item, index) => {
        // Add the main flow
        processed.push({
          from: item.stage,
          to: item.nextStage,
          weight: item.leads
        });

        // Add loss data if not the last stage
        if (index < rawData.length - 1) {
          const nextItem = rawData[index + 1];
          const loss = item.leads - nextItem.leads;
          if (loss > 0) {
            processed.push({
              from: item.stage,
              to: 'Loss',
              weight: loss
            });
          }
        }
      });

      return processed;
    };

    setProcessedData(processData(mockData));
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Enrollment Funnel Analysis</h2>
      <EnrollmentFunnel data={processedData} />
    </div>
  );
};

export default EnrollmentFunnelContainer;