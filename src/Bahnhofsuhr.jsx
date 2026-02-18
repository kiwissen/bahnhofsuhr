import { useEffect, useState, useRef } from 'react'

// Schweizer Bahnhofsuhr (SBB-Design)
// Der Sekundenzeiger pausiert bei 58.5s und springt dann auf 0
export default function Bahnhofsuhr({ size = 400 }) {
  const [time, setTime] = useState(new Date())
  const animFrameRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const tick = () => {
      setTime(new Date())
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [])

  const cx = size / 2
  const cy = size / 2
  const r = size / 2

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const ms = time.getMilliseconds()

  // Stunden: gleichmäßig, mit Minuten-Anteil
  const hourDeg = (hours + minutes / 60) * 30

  // Minuten: gleichmäßig mit Sekunden-Anteil
  const minuteDeg = (minutes + seconds / 60) * 6

  // Sekundenzeiger SBB-typisch:
  // Läuft 58.5s durch, pausiert dann kurz, springt auf 0
  const totalMs = seconds * 1000 + ms
  let secondDeg
  if (totalMs < 58500) {
    secondDeg = (totalMs / 58500) * 354 // 0..354° in 58.5s
  } else {
    secondDeg = 354 // Pause bis nächste Minute (bei ~58.5-60s)
  }

  // Hilfsfunktion: Punkt auf Kreis
  const pt = (angleDeg, radius) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + Math.cos(rad) * radius,
      y: cy + Math.sin(rad) * radius,
    }
  }

  // Stundenstriche
  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30
    const outer = pt(angle, r * 0.88)
    const inner = pt(angle, r * 0.72)
    return { angle, outer, inner }
  })

  // Minutenstriche (nicht Stunden)
  const minuteMarks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null
    const angle = i * 6
    const outer = pt(angle, r * 0.88)
    const inner = pt(angle, r * 0.82)
    return { angle, outer, inner }
  }).filter(Boolean)

  // Zeiger berechnen
  const hourTip = pt(hourDeg, r * 0.55)
  const hourTail = pt(hourDeg + 180, r * 0.12)

  const minTip = pt(minuteDeg, r * 0.78)
  const minTail = pt(minuteDeg + 180, r * 0.12)

  const secTip = pt(secondDeg, r * 0.82)
  const secTail = pt(secondDeg + 180, r * 0.2)

  const strokeWidth = size / 100

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.5))' }}
    >
      {/* Zifferblatt */}
      <circle cx={cx} cy={cy} r={r * 0.97} fill="white" />
      <circle cx={cx} cy={cy} r={r * 0.97} fill="none" stroke="#222" strokeWidth={r * 0.03} />

      {/* Minutenstriche */}
      {minuteMarks.map((m, i) => (
        <line
          key={i}
          x1={m.outer.x} y1={m.outer.y}
          x2={m.inner.x} y2={m.inner.y}
          stroke="#333"
          strokeWidth={strokeWidth * 0.8}
          strokeLinecap="round"
        />
      ))}

      {/* Stundenstriche */}
      {hourMarks.map((m, i) => (
        <line
          key={i}
          x1={m.outer.x} y1={m.outer.y}
          x2={m.inner.x} y2={m.inner.y}
          stroke="#111"
          strokeWidth={strokeWidth * 2.5}
          strokeLinecap="round"
        />
      ))}

      {/* Stundenzeiger */}
      <line
        x1={hourTail.x} y1={hourTail.y}
        x2={hourTip.x} y2={hourTip.y}
        stroke="#111"
        strokeWidth={strokeWidth * 4}
        strokeLinecap="round"
      />

      {/* Minutenzeiger */}
      <line
        x1={minTail.x} y1={minTail.y}
        x2={minTip.x} y2={minTip.y}
        stroke="#111"
        strokeWidth={strokeWidth * 3}
        strokeLinecap="round"
      />

      {/* Sekundenzeiger (rot, mit rundem Kopf) */}
      <line
        x1={secTail.x} y1={secTail.y}
        x2={secTip.x} y2={secTip.y}
        stroke="#e30613"
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
      />

      {/* Roter Kreis am Sekundenzeiger (SBB-typisch, ~75% des Radius) */}
      {(() => {
        const ballCenter = pt(secondDeg, r * 0.65)
        return (
          <circle
            cx={ballCenter.x}
            cy={ballCenter.y}
            r={r * 0.065}
            fill="#e30613"
          />
        )
      })()}

      {/* Mittelpunkt */}
      <circle cx={cx} cy={cy} r={r * 0.025} fill="#111" />
    </svg>
  )
}
