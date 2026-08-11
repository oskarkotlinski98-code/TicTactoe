import { useEffect, useState } from 'react'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
]

function getResult(cells) {
  for (const [a, b, c] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] }
    }
  }
  if (cells.every(Boolean)) return { winner: 'draw', line: [] }
  return null
}

function Mark({ value }) {
  if (value === 'X') {
    return (
      <svg viewBox="0 0 100 100" className="mark mark-x" aria-hidden="true">
        <line x1="18" y1="18" x2="82" y2="82" />
        <line x1="82" y1="18" x2="18" y2="82" />
      </svg>
    )
  }
  if (value === 'O') {
    return (
      <svg viewBox="0 0 100 100" className="mark mark-o" aria-hidden="true">
        <circle cx="50" cy="50" r="34" />
      </svg>
    )
  }
  return null
}

export default function App() {
  const [cells, setCells] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState('X')
  const [score, setScore] = useState(() => {
    try {
      const saved = localStorage.getItem('ttt-score')
      return saved ? JSON.parse(saved) : { X: 0, O: 0, draw: 0 }
    } catch {
      return { X: 0, O: 0, draw: 0 }
    }
  })

  const result = getResult(cells)

  useEffect(() => {
    if (!result) return
    setScore((prev) => {
      const next = { ...prev, [result.winner]: prev[result.winner] + 1 }
      try {
        localStorage.setItem('ttt-score', JSON.stringify(next))
      } catch {
        /* storage unavailable, ignore */
      }
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.winner])

  function playAt(index) {
    if (cells[index] || result) return
    const next = cells.slice()
    next[index] = turn
    setCells(next)
    setTurn(turn === 'X' ? 'O' : 'X')
  }

  function newRound() {
    setCells(Array(9).fill(null))
    setTurn((prev) => (result?.winner === 'draw' ? prev : result ? result.winner : prev))
  }

  function resetMatch() {
    setCells(Array(9).fill(null))
    setTurn('X')
    setScore({ X: 0, O: 0, draw: 0 })
    try {
      localStorage.removeItem('ttt-score')
    } catch {
      /* ignore */
    }
  }

  const statusText = result
    ? result.winner === 'draw'
      ? 'Stalemate'
      : `${result.winner} takes the round`
    : `${turn} to move`

  return (
    <div className="page">
      <header className="masthead">
        <span className="masthead-eyebrow">Ledger No. 3</span>
        <h1>Tic · Tac · Toe</h1>
      </header>

      <div className="status-row" role="status" aria-live="polite">
        <span className={`status-text ${result ? 'status-text--done' : ''}`}>{statusText}</span>
      </div>

      <div className={`board board--${turn.toLowerCase()}`}>
        {cells.map((value, i) => {
          const isWinning = result?.line.includes(i)
          return (
            <button
              key={i}
              className={`cell ${isWinning ? 'cell--win' : ''}`}
              onClick={() => playAt(i)}
              disabled={Boolean(value) || Boolean(result)}
              aria-label={`Cell ${i + 1}${value ? `, ${value}` : ', empty'}`}
            >
              <Mark value={value} />
            </button>
          )
        })}
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={newRound}>
          {result ? 'Next round' : 'Clear board'}
        </button>
        <button className="btn btn-ghost" onClick={resetMatch}>
          Reset match
        </button>
      </div>

      <table className="tally" aria-label="Match tally">
        <thead>
          <tr>
            <th scope="col">X</th>
            <th scope="col">Draws</th>
            <th scope="col">O</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{score.X}</td>
            <td>{score.draw}</td>
            <td>{score.O}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
