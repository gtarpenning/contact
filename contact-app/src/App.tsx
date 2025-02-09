import { useState } from 'react'
import { Analytics } from "@vercel/analytics/react"

import './App.css'
import Splash from './Splash'
import Game from './Game'
import Results from './Results'
import { HistoryEntry } from './types'

type Mode = 'splash' | 'game' | 'results'

function App() {
  const [mode, setMode] = useState<Mode>('splash')
  const [history, setHistory] = useState<HistoryEntry[]>([])

  return (
    <>
      <Analytics />
      <div>
        {mode === 'splash' && <Splash onStart={() => setMode('game')} />}
        {mode === 'game' && <Game onEnd={(history) => {
          setMode('results')
          setHistory(history)
        }} />}
        {mode === 'results' && <Results history={[...history].reverse()} />}
      </div>
    </>
  )
}

export default App
