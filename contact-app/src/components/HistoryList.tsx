import { FinalResponse, HistoryEntry } from "../types"


export default function HistoryList({ history }: { history: HistoryEntry[] }) {

  return (
    history.length > 0 ? (
    <div style={{marginTop: '50px'}}>
      <h3>History</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 0px 120px', gap: '10px' }}>
        <div style={{fontWeight: 'bold'}}>You</div>
        <div style={{fontWeight: 'bold'}}>AI</div>
      </div>
      {history.map((entry, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '120px 120px 0px 120px', gap: '10px' }}>
          <div>{entry.userWord}</div>
          <div>{entry.llmWord}</div>
          {entry.llmResponse !== FinalResponse && (
            <>
              <div>→</div>
              <div>{entry.llmResponse}</div>
            </>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div />
  )
)}