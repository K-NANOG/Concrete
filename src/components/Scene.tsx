import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { generateBrutalistCell } from '@/lib/generators/structureGenerator'
import { createBrutalistAssembly } from '@/lib/generators/meshGenerator'

interface SceneProps {
  height?: number
  cellSize?: number
}

const Scene = ({ height = 4, cellSize = 6 }: SceneProps) => {
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    try {
      if (groupRef.current) {
        console.log('Clearing existing children...')
        // Clear existing children
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0])
        }

        console.log('Generating structure with params:', { height, cellSize })
        // Generate and add structure with current parameters
        const elements = generateBrutalistCell({
          cellSize,
          height,
          offset: new Vector3(-cellSize/2, 0, -cellSize/2) // Center based on cell size
        })
        
        console.log('Generated elements:', elements)
        const meshes = createBrutalistAssembly(elements)
        console.log('Created meshes:', meshes)
        
        meshes.forEach(mesh => {
          if (groupRef.current) {
            groupRef.current.add(mesh)
            console.log('Added mesh:', mesh)
          }
        })
      }
    } catch (error) {
      console.error('Error in Scene component:', error)
    }
  }, [height, cellSize]) // Regenerate when parameters change

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <>
      <group ref={groupRef} />
      <gridHelper args={[20, 20, '#666666', '#444444']} />
      <axesHelper args={[5]} />
    </>
  )
}

export default Scene 