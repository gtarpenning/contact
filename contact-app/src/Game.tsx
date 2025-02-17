import { useCallback, useEffect, useRef, useState } from 'react'
import { getInitialWord, handleMsg } from './llm'
import { FinalResponse, HistoryEntry } from './types'

type GameProps = {
  onEnd: (history: HistoryEntry[]) => void
}

export default function Game({ onEnd }: GameProps) {
  const [llmWord, setLlmWord] = useState('')
  const [nextLLMWord, setNextLLMWord] = useState('')
  const [userWord, setUserWord] = useState('')

  const [wordHistory, setWordHistory] = useState<HistoryEntry[]>([])
  const loadingInitialWord = useRef(false)
  const [previousWords, setPreviousWords] = useState<{user: string, llm: string} | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // hack to reset state when the game is restarted
    // when the wordHistory is empty, the game is restarted
    if (wordHistory.length === 0 && llmWord !== '') {
      setLlmWord('')
      setNextLLMWord('')
      setUserWord('')
      setPreviousWords(null)
    }
  }, [wordHistory])

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

    // Set previous words before updating to new ones
    setPreviousWords({ user: userWord, llm: llmWord })
    setIsTransitioning(true)

    const newLlmWord = await handleMsg(word, nextLLMWord)
    
    setWordHistory([...wordHistory, { llmWord: nextLLMWord, userWord: word, llmResponse: newLlmWord }])

    setUserWord(word)
    setLlmWord(nextLLMWord)
    setNextLLMWord(newLlmWord)

    // Reset transition state after a delay
    setTimeout(() => {
      setIsTransitioning(false)
      setPreviousWords(null)
    }, 1000) // Back to 1000ms to accommodate the full animation sequence
  }, [wordHistory, llmWord, nextLLMWord, onEnd, userWord])

  const readyToShow = llmWord && userWord
  const showHint1 = userWord && wordHistory.length === 1
  const showHint2 = userWord && wordHistory.length === 2
  const showHint3 = userWord && wordHistory.length >= 3

  return (
    <div style={{ padding: '10px', maxWidth: '100vw' }}>
      {userWord === '' ? <h2>Begin by entering a starting word</h2> : <h3>Guesses: {wordHistory.length - 1}</h3>}
      {userWord === '' && <div style={{ fontStyle: 'italic', marginBottom: '30px' }}>
        How well can you think like an ai?
        </div>}
      {nextLLMWord !== '' && <InputTextBox onSubmit={submitWord} placeholder="Enter your word" />}
      <div>
        {showHint1 && <HintLine hint="Find the midpoint between the two words, guess it exactly to make contact!" />}
        {showHint2 && <HintLine hint="Now find the *new* midpoint between your guess and the AI's" />}
        {showHint3 && <HintLine hint="Find the midpoint" />}
        {readyToShow && (
          <WordRow 
            previousWords={previousWords}
            isTransitioning={isTransitioning}
            userWord={userWord}
            llmWord={llmWord} />
        )}
      </div>
    </div>
  )
}

const HintLine = ({ hint }: { hint: string }) => {
  return (
    <div style={{ 
      fontStyle: 'italic',
      height: '48px',  // Fixed height to accommodate two lines
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {hint}
    </div>
  )
}

const styles = `
  .word-row {
    display: grid;
    grid-template-columns: minmax(100px, 150px) minmax(100px, 150px);
    gap: 10px;
    justify-content: center;
    font-size: clamp(1rem, 4vw, 1.5rem);
    font-weight: 600;
    margin: 20px auto;
    margin-top: 30px;
    position: absolute;
    width: 100%;
  }

  .word {
    word-break: break-word;
  }

  .falling {
    animation: fallOut 0.5s ease-in forwards;
  }

  .entering {
    animation: fadeIn 0.5s ease-out;
    animation-delay: 0.7s;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  @keyframes fallOut {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(50px);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const WordRow = ({ previousWords, isTransitioning, userWord, llmWord }: { previousWords: {user: string, llm: string} | null, isTransitioning: boolean, userWord: string, llmWord: string }  ) => {
  return (
    <div style={{ position: 'relative' }}>
      <style>{styles}</style>
      {previousWords && (
        <div className="word-row falling">
          <div className="word">{previousWords.user}</div>
          <div className="word">{previousWords.llm}</div>
        </div>
      )}
      <div className={`word-row ${isTransitioning ? 'entering' : ''}`}>
        <div className="word">{userWord}</div>
        <div className="word">{llmWord}</div>
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

  const handleButtonSubmit = useCallback(() => {
    onSubmit(word)
    setWord('')
  }, [onSubmit, word])

  useEffect(() => {
    document.addEventListener('keydown', handleSubmit)
    return () => {
      document.removeEventListener('keydown', handleSubmit)
    }
  }, [handleSubmit])

  return (
    <div style={{ width: '300px', margin: '0 auto', display: 'flex', gap: '5px' }}>
      <input 
        type="text" 
        maxLength={20} 
        placeholder={placeholderText} 
        value={word} 
        onChange={(e) => setWord(e.target.value.toLowerCase().trim())}
        style={{
          flex: 1,
          padding: '10px',
          fontSize: '16px',
          margin: '10px 0',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={handleButtonSubmit}
        style={{
          padding: '0 15px',
          margin: '10px 0',
          cursor: 'pointer',
          color: 'white',
          borderRadius: '2px',
          fontSize: '16px'
        }}
      >
        Go
      </button>
    </div>
  )
}
