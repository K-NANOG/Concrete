import { BoxGeometry, Mesh, MeshStandardMaterial, BufferGeometry, Material } from 'three'
import type { BrutalistElement } from '@/types/assets/BrutalistAssets'

const disposeMesh = (mesh: Mesh) => {
  if (mesh.geometry) {
    mesh.geometry.dispose()
  }
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(material => material.dispose())
    } else {
      mesh.material.dispose()
    }
  }
}

export const createMeshFromElement = (element: BrutalistElement): Mesh => {
  try {
    // Create geometry based on dimensions
    const geometry = new BoxGeometry(
      element.geometry.dimensions.x,
      element.geometry.dimensions.y,
      element.geometry.dimensions.z
    )

    // Create material with brutalist properties
    const material = new MeshStandardMaterial({
      color: element.material.color,
      roughness: element.material.roughness,
      metalness: element.material.metalness,
      flatShading: true // Enhance brutalist appearance
    })

    // Create mesh and set transform properties
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(element.geometry.position)
    mesh.rotation.copy(element.geometry.rotation)
    mesh.scale.copy(element.geometry.scale)

    // Enable shadows
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Add custom properties for identification
    mesh.userData = {
      elementId: element.id,
      elementType: element.type,
      allowedConnections: element.allowedConnections
    }

    // Optimize geometry
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()

    return mesh
  } catch (error) {
    console.error('Error creating mesh for element:', element.id, error)
    // Return a minimal fallback mesh rather than crashing
    const fallbackGeometry = new BoxGeometry(1, 1, 1)
    const fallbackMaterial = new MeshStandardMaterial({ color: '#ff0000' })
    const fallbackMesh = new Mesh(fallbackGeometry, fallbackMaterial)
    fallbackMesh.userData = { error: true, originalElementId: element.id }
    return fallbackMesh
  }
}

export const createBrutalistAssembly = (elements: BrutalistElement[]): Mesh[] => {
  const meshes: Mesh[] = []
  
  try {
    elements.forEach(element => {
      try {
        const mesh = createMeshFromElement(element)
        meshes.push(mesh)
      } catch (error) {
        console.error('Error creating mesh for element:', element.id, error)
      }
    })

    // If no meshes were created successfully, create a fallback mesh
    if (meshes.length === 0) {
      console.warn('No meshes created, adding fallback cube')
      const fallbackGeometry = new BoxGeometry(1, 1, 1)
      const fallbackMaterial = new MeshStandardMaterial({ color: '#ff0000' })
      const fallbackMesh = new Mesh(fallbackGeometry, fallbackMaterial)
      fallbackMesh.userData = { error: true, message: 'Failed to create any meshes' }
      meshes.push(fallbackMesh)
    }

    return meshes
  } catch (error) {
    console.error('Error in createBrutalistAssembly:', error)
    // Return a single fallback mesh rather than crashing
    const fallbackGeometry = new BoxGeometry(1, 1, 1)
    const fallbackMaterial = new MeshStandardMaterial({ color: '#ff0000' })
    const fallbackMesh = new Mesh(fallbackGeometry, fallbackMaterial)
    fallbackMesh.userData = { error: true, message: 'Assembly creation failed' }
    return [fallbackMesh]
  }
} 