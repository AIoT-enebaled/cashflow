'use client'

import { useEffect, useState } from 'react'

export default function MatrixBackground({ density = 15 }: { density?: number }) {
  const [matrixChars, setMatrixChars] = useState<Array<{
    id: number
    left: string
    animationDelay: string
    animationDuration: string
    char: string
  }>>([])

  useEffect(() => {
    // Generate matrix characters only on client side to avoid hydration mismatch
    const chars = Array.from({ length: density }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 10}s`,
      char: String.fromCharCode(0x30A0 + Math.random() * 96)
    }))
    setMatrixChars(chars)
  }, [density])

  return (
    <div className="matrix-bg">
      {matrixChars.map((char) => (
        <div
          key={char.id}
          className="matrix-char"
          style={{
            left: char.left,
            animationDelay: char.animationDelay,
            animationDuration: char.animationDuration
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  )
}
