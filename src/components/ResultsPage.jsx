import { PollyGlotHeader } from './TranslateForm'
import './ResultsPage.css'

function ResultsPage({ originalText, translatedText, onStartOver }) {
  return (
    <div className="results-card">

      {/* Same header as the form */}
      <PollyGlotHeader />

      <div className="card-body">

        {/* Original Text */}
        <div className="text-block">
          <span className="block-label">Original text ⚡</span>
          <p className="block-content">{originalText}</p>
        </div>

        {/* Translation */}
        <div className="text-block">
          <span className="block-label">Your translation ⚡</span>
          <p className="block-content">{translatedText}</p>
        </div>

        {/* Start Over Button */}
        <button className="start-over-btn" onClick={onStartOver}>
          Start Over
        </button>

      </div>
    </div>
  )
}

export default ResultsPage