import { AdSpendView } from './modules/ad-spend/AdSpendView';
import { LeadScoreView } from './modules/lead-source/LeadScoreView';
import { SpendScoreView } from './modules/spend-score/SpendScoreView';
import EnrollmentFunnelContainer from './modules/enrollment-funnel/EnrollmentFunnelContainer';

function App() {
  return (
    <>
      <AdSpendView />
      <LeadScoreView />
      <SpendScoreView />
      <EnrollmentFunnelContainer />
    </>
  );
}

export default App;
