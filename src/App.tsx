import { AdSpendView } from './modules/ad-spend/AdSpendView';
import { LeadScoreView } from './modules/lead-source/LeadScoreView';
import { SpendScoreView } from './modules/spend-score/SpendScoreView';
import EnrollmentFunnelContainer from './modules/enrollment-funnel/EnrollmentFunnelContainer';
import { useState } from 'react';
import { semesterDataMap, semesters } from './data/stagesData';
import LeadFunnelChart from './components/LeadFunnelChart';

function App() {
  const [selectSemester] = useState(semesters[0].value)
  const [stagesData] = useState(semesterDataMap[selectSemester])
  return (
    <>
      <AdSpendView />
      <LeadScoreView />
      <SpendScoreView />
      <EnrollmentFunnelContainer />
      <div className="app-container">
        <div className="lead-funnel-container">
          <LeadFunnelChart stagesData={stagesData} />
        </div>
      </div>
    </>
  );
}

export default App;
