import { FinalResponse, HistoryEntry } from '../types';

export default function HistoryList({ history }: { history: HistoryEntry[] }) {
  return history.length > 0 ? (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        maxHeight: '400px',
        overflow: 'auto',
        padding: '0 10px',
        boxSizing: 'border-box',
      }}
    >
      <h3
        style={{
          position: 'sticky',
          top: 0,
          margin: '0',
          padding: '10px 0',
          backgroundColor: 'inherit',
        }}
      >
        History
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(80px, 100px) minmax(80px, 100px) 20px minmax(80px, 100px)',
          gap: '8px',
          fontSize: 'clamp(0.8rem, 3vw, 1rem)',
          justifyContent: 'center',
          position: 'sticky',
          top: '43px',
          padding: '10px 0',
          backgroundColor: 'inherit',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>You</div>
        <div style={{ fontWeight: 'bold' }}>AI</div>
        <div style={{ fontWeight: 'bold' }}></div>
        <div style={{ fontWeight: 'bold' }}>Midpoint</div>
      </div>
      {history.map((entry, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(80px, 100px) minmax(80px, 100px) 20px minmax(80px, 100px)',
            gap: '8px',
            fontSize: 'clamp(0.8rem, 3vw, 1rem)',
            justifyContent: 'center',
          }}
        >
          <div style={{ wordBreak: 'break-word' }}>{entry.userWord}</div>
          <div style={{ wordBreak: 'break-word' }}>{entry.llmWord}</div>
          {entry.llmResponse !== FinalResponse && (
            <>
              <div>→</div>
              <div style={{ wordBreak: 'break-word' }}>{entry.llmResponse}</div>
            </>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div />
  );
}
