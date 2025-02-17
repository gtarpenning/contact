import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Add viewport meta tag for mobile responsiveness
    const viewport = document.createElement('meta')
    viewport.name = 'viewport'
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    document.head.appendChild(viewport)
  }, [])

  const handlePlayAgain = () => {
    setHistory([])
    setMode('game')
  }

  return (
    <>
      <Analytics />
      <div>
        {mode === 'splash' && <Splash onStart={() => setMode('game')} />}
        {mode === 'game' && <Game onEnd={(history) => {
          setMode('results')
          setHistory(history)
        }} />}
        {mode === 'results' && <Results 
          history={[...history].reverse()} 
          onPlayAgain={handlePlayAgain}
        />}
      </div>
    </>
  )
}

export default App
