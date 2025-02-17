import HistoryList from './components/HistoryList';
import { HistoryEntry } from './types';

const Results = ({
  history,
  onPlayAgain,
}: {
  history: HistoryEntry[];
  onPlayAgain: () => void;
}) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>CONTACT</h1>
      <div>
        <p>You just made contact with an AI...</p>
        <p>It only took you {history.length - 1} guesses!</p>
      </div>
      <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <HistoryList history={history} />
      </div>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={onPlayAgain}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Results;
