import React, { useCallback, useEffect, useState } from 'react'
import { getInitialWord, handleMsg } from './llm'

type Props = {
  onEnd: () => void
}

export default function Game({ onEnd }: Props) {
  const [score, setScore] = useState(0)
  const [llmWord, setLlmWord] = useState('')
  const [userWord, setUserWord] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const submitWord = useCallback(async (word: string) => {
    // Store the user's submission locally without updating state immediately.
    const pendingUserWord = word
    // Wait for the LLM's response before updating any displayed word.
    const newLlmWord = llmWord === '' ? await getInitialWord() : await handleMsg(pendingUserWord, llmWord, history)
    if (pendingUserWord === newLlmWord) {
      onEnd()
      return
    }
    setHistory([...history, pendingUserWord, llmWord ?? newLlmWord].slice(-4))
    setScore(prev => prev + 1)
    setLlmWord(newLlmWord)
    // Update the displayed user word only after the result is computed.
    setUserWord(pendingUserWord)
  }, [history, llmWord, onEnd])

  const readyToShow = llmWord && userWord

  return (
    <div>
      <h3>Score: {score}</h3>
      <InputTextBox onSubmit={submitWord} placeholder="Enter your word" />
      <div>
        {userWord ? <p>Find the midpoint between:</p> : <p>Begin by entering a starting word</p>}
        {readyToShow && (
          <div style={{ display: 'flex', gap: '50px' }}>
            <span>{userWord}</span>
            <span>**{llmWord}**</span>
          </div>
        )}
      </div>
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