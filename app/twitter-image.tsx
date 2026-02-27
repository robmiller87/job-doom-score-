import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Are You Doomed? - AI Job Risk Calculator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>😬</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          ARE YOU DOOMED?
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#888',
            textAlign: 'center',
          }}
        >
          AI Job Risk Calculator
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#666',
            marginTop: 40,
          }}
        >
          Drop your LinkedIn → Get your doom score
        </div>
      </div>
    ),
    { ...size }
  )
}
