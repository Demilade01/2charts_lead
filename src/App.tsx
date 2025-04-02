import { AdSpendView } from './modules/ad-spend/AdSpendView';
import { LeadScoreView } from './modules/lead-source/LeadScoreView';
import { SpendScoreView } from './modules/spend-score/SpendScoreView';

function App() {
  return (
    <>
      <AdSpendView />
      <LeadScoreView />
      <SpendScoreView />
    </>
  );
}

export default App;
