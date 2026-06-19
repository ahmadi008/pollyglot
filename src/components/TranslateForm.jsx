import { useState } from 'react'
import './TranslateForm.css'

const LANGUAGES = [
  { id: 'french',   label: 'French',   flag: '🇫🇷' },
  { id: 'spanish',  label: 'Spanish',  flag: '🇪🇸' },
  { id: 'japanese', label: 'Japanese', flag: '🇯🇵' },
]

/** Shared PollyGlot header used on both screens */
function PollyGlotHeader() {
  return (
    <div className="card-header">
      <div className="globe-decor" />
      <div className="logo-row">
        <div className="logo-badge">🦜</div>
        <div>
          <h1 className="logo-title">PollyGlot</h1>
          <p className="logo-tagline">Perfect Translation Every Time</p>
        </div>
      </div>
    </div>
  )
}

export { PollyGlotHeader }

function TranslateForm({ onTranslate, isLoading, error, onClearError }) {
  const [text, setText] = useState('')
  const [selectedLang, setSelectedLang] = useState('french')

  const handleSubmit = (e) => {
    e.preventDefault()
    onTranslate(text, selectedLang)
  }

  return (
    <div className="card">
      <PollyGlotHeader />

      <div className="card-body">
        <form onSubmit={handleSubmit} className="translate-form">

          {/* Text Input */}
          <div className="field-group">
            <label className="field-label" htmlFor="text-input">
              Text to translate ⚡
            </label>
            <textarea
              id="text-input"
              className="text-input"
              value={text}
              onChange={(e) => { setText(e.target.value); onClearError() }}
              placeholder="How are you?"
              rows={3}
              maxLength={500}
              required
            />
          </div>

          {/* Language Selector */}
          <div className="field-group">
            <span className="field-label">Select language ⚡</span>
            <div className="language-options">
              {LANGUAGES.map((lang) => (
                <label key={lang.id} className="language-option">
                  <input
                    type="radio"
                    name="language"
                    value={lang.id}
                    checked={selectedLang === lang.id}
                    onChange={() => setSelectedLang(lang.id)}
                  />
                  <span className="lang-name">{lang.label}</span>
                  <span className="lang-flag">{lang.flag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-msg" role="alert">⚠️ {error}</div>
          )}

          {/* Translate Button */}
          <button
            type="submit"
            className={`translate-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? 'Translating…' : 'Translate'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default TranslateForm