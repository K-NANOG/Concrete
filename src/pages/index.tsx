import { useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import styled from '@emotion/styled'
import Scene from '@/components/Scene'
import Interface from '@/components/Interface'
import Head from 'next/head'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingFallback = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333333;
  font-size: 1rem;
  letter-spacing: 0.1em;
`

interface GenerationParams {
  height: number
  cellSize: number
}

export default function Home() {
  const [key, setKey] = useState(0)
  const [params, setParams] = useState<GenerationParams>({ height: 4, cellSize: 6 })

  const handleGenerate = useCallback((newParams: GenerationParams) => {
    setParams(newParams)
    // Force Scene remount to regenerate structure
    setKey(prev => prev + 1)
  }, [])

  return (
    <Container>
      <Head>
        <title>Concrete | Brutalist Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <CanvasWrapper>
        <Canvas
          camera={{ position: [10, 10, 10], fov: 75 }}
          style={{ background: '#000000' }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
          shadows
          dpr={[1, 2]} // Responsive to device pixel ratio
        >
          <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
            <Scene key={key} height={params.height} cellSize={params.cellSize} />
            <OrbitControls 
              enableDamping
              dampingFactor={0.05}
              minDistance={5}
              maxDistance={50}
            />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <hemisphereLight 
              args={['#ffffff', '#cccccc', 0.3]}
              position={[0, 50, 0]}
            />
          </Suspense>
        </Canvas>
      </CanvasWrapper>
      <Interface onGenerate={handleGenerate} />
    </Container>
  )
} 