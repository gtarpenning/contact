import HistoryList from './components/HistoryList'
import { HistoryEntry } from './types'

const Results = ({ history }: { history: HistoryEntry[] }) => {

  return (
  <div>
    <h1>CONTACT</h1>
    <div>
        <p>You just made contact with an AI...</p>
        <p>It only took you {history.length - 1} guesses!</p>
    </div>
    <div style={{ marginTop: '100px' }}>
        <HistoryList history={history} />
    </div>
  </div>
  )
}

export default Results
