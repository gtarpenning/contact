import { useState } from 'react'

import './App.css'
import Splash from './Splash'
import Game from './Game'

type Mode = 'splash' | 'game' | 'results'

function App() {
  const [mode, setMode] = useState<Mode>('splash')

  return (
    <>
      <div>
        {mode === 'splash' && <Splash onStart={() => setMode('game')} />}
        {mode === 'game' && <Game onEnd={() => setMode('results')} />}
        {/* {mode === 'results' && <Results />} */}
      </div>
    </>
  )
}

export default App
