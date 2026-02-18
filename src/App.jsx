import { useState, useEffect } from 'react'
import Bahnhofsuhr from './Bahnhofsuhr'
import './App.css'

export default function App() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`

  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  const dateStr = `${dayNames[time.getDay()]}, ${time.getDate()}. ${monthNames[time.getMonth()]} ${time.getFullYear()}`

  return (
    <div className="app">
      <div className="station-board">
        <div className="station-name">Basel SBB</div>
        <div className="clock-container">
          <Bahnhofsuhr size={360} />
        </div>
        <div className="digital-time">{timeStr}</div>
        <div className="date">{dateStr}</div>
      </div>
    </div>
  )
}
