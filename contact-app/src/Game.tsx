import { useCallback, useEffect, useRef, useState } from 'react'
import { getInitialWord, handleMsg } from './llm'
import { FinalResponse, HistoryEntry } from './types'
import HistoryList from './components/HistoryList'

const HISTORY_SIZE = 10

type Props = {
  onEnd: (history: HistoryEntry[]) => void
}

export default function Game({ onEnd }: Props) {
  const [llmWord, setLlmWord] = useState('')
  const [nextLLMWord, setNextLLMWord] = useState('')
  const [userWord, setUserWord] = useState('')

  const [wordHistory, setWordHistory] = useState<HistoryEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadingInitialWord = useRef(false)

  useEffect(() => {
    if (wordHistory.length > 0 || loadingInitialWord.current) {
        return
    }
    loadingInitialWord.current = true
    getInitialWord().then((w) => {
        setNextLLMWord(w)
        loadingInitialWord.current = false
    })
  }, [wordHistory])

  const submitWord = useCallback(async (word: string) => {
    if (wordInHistory(word, wordHistory)) {
      setError(`The last ${HISTORY_SIZE} words can't be guessed.`)
      return
    }
    if (word === '') {
      return
    }
    if (word === nextLLMWord) {
        onEnd([...wordHistory, { llmWord: nextLLMWord, userWord: word, llmResponse: FinalResponse }])
        return
    }
    if (!nextLLMWord) {
        console.error('No next LLM word', wordHistory, llmWord, word)
        return
    }
    setError(null)

    const flattenedHistory = flattenHistory(wordHistory)
    const newLlmWord = await getLLMWord(word, nextLLMWord, flattenedHistory)
    
    setWordHistory([...wordHistory, { llmWord: nextLLMWord, userWord: word, llmResponse: newLlmWord }])

    setUserWord(word)
    setLlmWord(nextLLMWord)
    setNextLLMWord(newLlmWord)
  }, [wordHistory, llmWord, nextLLMWord, onEnd])

  const readyToShow = llmWord && userWord

  const historyReversed = [...wordHistory].reverse().slice(1)

  return (
    <div>
      {userWord === '' ? <h2>Begin by entering a starting word</h2> : <h3>Guesses: {wordHistory.length}</h3>}
      {userWord === '' && <div style={{ fontStyle: 'italic', marginBottom: '10px' }}>How well can you think like an ai?</div>}
    <InputTextBox onSubmit={submitWord} placeholder="Enter your word" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {userWord && <p>Find the midpoint</p>}
        {readyToShow && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '150px 150px', 
            gap: '10px',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            <div>{userWord}</div>
            <div>{llmWord}</div>
          </div>
        )}
      </div>
      <HistoryList history={historyReversed} />
    </div>
  )
}

async function getLLMWord(userWord: string, llmWord: string, history: string[]) {
    return await handleMsg(userWord, llmWord, history.slice(-HISTORY_SIZE))
  }

function wordInHistory(word: string, history: HistoryEntry[]) {
  return history.slice(-HISTORY_SIZE).some(entry => entry.llmWord === word || entry.userWord === word)
}

function flattenHistory(history: HistoryEntry[]) {
    const rawHistory: string[] = []
    history.map(entry => {
        rawHistory.push(entry.llmWord)
        rawHistory.push(entry.userWord)
        return entry.llmResponse
    })
    return rawHistory
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
      <input type="text" maxLength={20} placeholder={placeholderText} value={word} onChange={(e) => setWord(e.target.value.toLowerCase().trim())} />
    </div>
  )
}