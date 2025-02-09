import React, { useCallback, useEffect, useState } from 'react'
import { getInitialWord, handleMsg } from './llm'

const HISTORY_SIZE = 10

type Props = {
  onEnd: () => void
}

export default function Game({ onEnd }: Props) {
  const [score, setScore] = useState(0)
  const [llmWord, setLlmWord] = useState('')
  const [userWord, setUserWord] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const [error, setError] = useState<string | null>(null)

  const submitWord = useCallback(async (word: string) => {
    if (history.slice(-HISTORY_SIZE).some(w => w === word)) {
      setError(`The last ${HISTORY_SIZE} words can't be guessed.`)
      return
    }
    if (word.trim() === '') {
      return
    }
    setError(null)
    // Store the user's submission locally without updating state immediately.
    const pendingUserWord = word
    // Wait for the LLM's response before updating any displayed word.
    const newLlmWord = llmWord === '' ? await getInitialWord() : await handleMsg(pendingUserWord, llmWord, history.slice(-HISTORY_SIZE))
    if (pendingUserWord === newLlmWord) {
      onEnd()
      return
    }
    setHistory([...history, newLlmWord, pendingUserWord])
    setScore(prev => prev + 1)
    setLlmWord(newLlmWord)
    // Update the displayed user word only after the result is computed.
    setUserWord(pendingUserWord)
  }, [history, llmWord, onEnd])

  const readyToShow = llmWord && userWord

  const reversedHistory = [...history].reverse()

  return (
    <div>
      {userWord === '' ? <h2>Begin by entering a starting word</h2> : <h3>Guesses: {score}</h3>}
      <div style={{ fontStyle: 'italic', marginBottom: '10px' }}>How well can you think like an ai?</div>
    <InputTextBox onSubmit={submitWord} placeholder="Enter your word" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {userWord && <p>Find the midpoint between:</p>}
        {readyToShow && (
          <div style={{ display: 'flex', gap: '50px' }}>
            <span>{userWord}</span>
            <span>**{llmWord}**</span>
          </div>
        )}
      </div>
      {history.length > 0 && (
        <div style={{ marginTop: '100px'}}>
          <div>
            <h3>History</h3>
            <div style={{ fontWeight: 'bold' }}>
            {reversedHistory.slice(0, HISTORY_SIZE).map(word => <div key={word}>{word}</div>)}
          </div>
          {history.length > HISTORY_SIZE && (
            <div>
              {reversedHistory.slice(HISTORY_SIZE, HISTORY_SIZE+6).map(word => <div key={word}>{word}</div>)}
              {history.length > HISTORY_SIZE+6 && (<span>...</span>)}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

const InputTextBox = ({ onSubmit, placeholder }: { onSubmit: (word: string) => void, placeholder?: string }) => {
  const [word, setWord] = useState('')
  const placeholderText = placeholder ?? 'Enter your word'

  const handleSubmit = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit(word)
      setWord('')
    }
  }, [onSubmit, word])

  // register the submitWord function to the enter key
  useEffect(() => {
    document.addEventListener('keydown', handleSubmit)
    return () => {
      document.removeEventListener('keydown', handleSubmit)
    }
  }, [handleSubmit])

  return (
    <div>
      <input type="text" maxLength={20} placeholder={placeholderText} value={word} onChange={(e) => setWord(e.target.value)} />
    </div>
  )
}