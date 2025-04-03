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
  percentage?: number;
}

const EnrollmentFunnelContainer: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedEnrollmentData[]>([]);

  const mockData: RawEnrollmentData[] = [
    { stage: 'Discovery/Dev.', leads: 150, nextStage: 'App. Started' },
    { stage: 'App. Started', leads: 87, nextStage: 'App. Submitted' },
    { stage: 'App. Submitted', leads: 82, nextStage: 'App. Complete' },
    { stage: 'App. Complete', leads: 71, nextStage: 'Admission Offered' },
    { stage: 'Admission Offered', leads: 63, nextStage: 'Admission Accepted' },
    { stage: 'Admission Accepted', leads: 61, nextStage: 'Enrolled' },
    { stage: 'Enrolled', leads: 56, nextStage: '' },
  ];

  useEffect(() => {
    const processData = (rawData: RawEnrollmentData[]): ProcessedEnrollmentData[] => {
      const processed: ProcessedEnrollmentData[] = [];

      rawData.forEach((item) => {
        if (item.nextStage) {
          const nextItem = rawData.find(d => d.stage === item.nextStage);
          if (nextItem) {
            const percentage = +((nextItem.leads / item.leads) * 100).toFixed(1);
            processed.push({
              from: item.stage,
              to: item.nextStage,
              weight: nextItem.leads,
              percentage: percentage
            });

            // Calculate loss
            const loss = item.leads - nextItem.leads;
            if (loss > 0) {
              processed.push({
                from: item.stage,
                to: 'Conversion and Loss',
                weight: loss
              });
            }
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