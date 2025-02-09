import { useCallback, useEffect, useRef, useState } from 'react'
import { getInitialWord, handleMsg } from './llm'

const HISTORY_SIZE = 10

type Props = {
  onEnd: () => void
  score: number
  onScoreChange: (score: number) => void
}

type HistoryEntry = {
    llmWord: string
    userWord: string
    llmResponse: string
}


export default function Game({ onEnd, score, onScoreChange }: Props) {
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
    if (word.trim() === '') {
      return
    }
    if (word === nextLLMWord) {
        onEnd()
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
    onScoreChange(score + 1)

    setUserWord(word)
    setLlmWord(nextLLMWord)
    setNextLLMWord(newLlmWord)
  }, [wordHistory, llmWord, nextLLMWord, onEnd, score, onScoreChange])

  const readyToShow = llmWord && userWord

  return (
    <div>
      {userWord === '' ? <h2>Begin by entering a starting word</h2> : <h3>Guesses: {score}</h3>}
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
      <HistoryList history={wordHistory} />
    </div>
  )
}

async function getLLMWord(userWord: string, llmWord: string, history: string[]) {
    return await handleMsg(userWord, llmWord, history.slice(-HISTORY_SIZE))
  }

function wordInHistory(word: string, history: HistoryEntry[]) {
  return history.some(entry => entry.llmWord === word || entry.userWord === word)
}

function flattenHistory(history: HistoryEntry[]) {
    const rawHistory: string[] = []
    history.slice(0, -1).map(entry => {
        rawHistory.push(entry.llmWord)
        rawHistory.push(entry.userWord)
        return entry.llmResponse
    })
    return rawHistory
}

function HistoryList({ history }: { history: HistoryEntry[] }) {

    const fullHistory = [...history].reverse().slice(1)
  return (
    fullHistory.length > 0 && (
    <div style={{marginTop: '50px'}}>
      <h3>History</h3>
      {fullHistory.map((entry, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '100px 100px 0px 100px', gap: '10px' }}>
          <div>{entry.userWord}</div>
          <div>{entry.llmWord}</div>
          <div>→</div>
          <div>{entry.llmResponse}</div>
        </div>
      ))}
    </div>
  ))
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
      <input type="text" maxLength={20} placeholder={placeholderText} value={word} onChange={(e) => setWord(e.target.value.toLowerCase())} />
    </div>
  )
}