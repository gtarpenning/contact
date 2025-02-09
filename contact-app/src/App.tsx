import { useState } from 'react'

import './App.css'
import Splash from './Splash'
import Game from './Game'
import Results from './Results'

type Mode = 'splash' | 'game' | 'results'

function App() {
  const [mode, setMode] = useState<Mode>('splash')
  const [score, setScore] = useState<number>(0)

  return (
    <>
      <div>
        {mode === 'splash' && <Splash onStart={() => setMode('game')} />}
        {mode === 'game' && <Game onEnd={() => setMode('results')} onScoreChange={setScore} />}
        {mode === 'results' && <Results score={score} />}
      </div>
    </>
  )
}

export default App
