import { useState } from 'react'
import TranslateForm from './components/TranslateForm'
import ResultsPage from './components/ResultsPage'

// The /api/translate endpoint is a Cloudflare Pages Function (a Cloudflare Worker
// under the hood) that hides the OpenRouter API key. Same domain as the frontend
// → no CORS issues, no env var to configure.
const API_URL = 'https://pollyglot-api.ahmadi08zahra.workers.dev/translate'

function App() {
  const [view, setView] = useState('translate')
  const [originalText, setOriginalText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async (text, language) => {
    if (!text.trim()) {
      setError('Please enter some text to translate.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim(), language }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Translation failed')
      }

      const data = await response.json()
      setOriginalText(text.trim())
      setTranslatedText(data.translation)
      setView('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOver = () => {
    setView('translate')
    setOriginalText('')
    setTranslatedText('')
    setError('')
  }

  return (
    <div>
      {view === 'translate' ? (
        <TranslateForm
          onTranslate={handleTranslate}
          isLoading={isLoading}
          error={error}
          onClearError={() => setError('')}
        />
      ) : (
        <ResultsPage
          originalText={originalText}
          translatedText={translatedText}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  )
}

export default App