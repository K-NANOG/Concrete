import { Vector3, Euler } from 'three'
import { BrutalistElement, BrutalistModule } from '@/types/assets/BrutalistAssets'
import brutalistAssets from '@/lib/assets/brutalistAssets'
import { createNoise3D } from 'simplex-noise'

interface GeneratorConfig {
  cellSize: number
  height: number
  offset: Vector3
  complexity?: number // 0-1, controls the complexity of the generated structure
  symmetry?: boolean // Whether to generate symmetrical structures
  seed?: number // Random seed for consistent generation
  floatingDensity?: number // Controls density of floating elements
  aggregationFactor?: number // Controls how much floating elements tend to aggregate
}

// Initialize noise generators
const noise3D = createNoise3D()

// Helper function to get random number between min and max
const random = (min: number, max: number, seed = Math.random()) => {
  return min + (max - min) * ((Math.sin(seed * 12.9898 + 78.233) * 43758.5453123) % 1)
}

// Helper function to get noise value at a point
const getNoise = (x: number, y: number, z: number, scale = 1) => {
  return (noise3D(x * scale, y * scale, z * scale) + 1) / 2
}

// Helper function to calculate disintegration effect
const calculateDisintegration = (position: Vector3, config: GeneratorConfig): boolean => {
  const heightFactor = position.y / config.height
  const noiseFactor = getNoise(position.x * 2, position.y * 2, position.z * 2)
  return noiseFactor < heightFactor * 0.6 // Fixed intensity
}

// Helper function to generate floating cube fragments
const generateFragments = (position: Vector3, size: number, config: GeneratorConfig): BrutalistElement[] => {
  const fragments: BrutalistElement[] = []
  const fragmentSize = size * 0.2
  const numFragments = Math.floor(random(3, 8, config.seed || Math.random()))
  
  for (let i = 0; i < numFragments; i++) {
    const fragmentSeed = (config.seed || Math.random()) + i
    const offset = new Vector3(
      random(-1, 1, fragmentSeed) * size,
      random(0.5, 2, fragmentSeed) * size,
      random(-1, 1, fragmentSeed) * size
    )
    
    fragments.push({
      ...brutalistAssets.modules.basicWall,
      id: `fragment_${i}`,
      geometry: {
        dimensions: new Vector3(fragmentSize, fragmentSize, fragmentSize),
        position: new Vector3(
          position.x + offset.x,
          position.y + offset.y,
          position.z + offset.z
        ),
        rotation: new Euler(
          random(0, Math.PI * 2, fragmentSeed),
          random(0, Math.PI * 2, fragmentSeed),
          random(0, Math.PI * 2, fragmentSeed)
        ),
        scale: new Vector3(1, 1, 1)
      },
      material: brutalistAssets.modules.basicWall.material
    })
  }
  
  return fragments
}

// Helper function to select a random wall type
const selectWallType = (x: number, y: number, z: number) => {
  const styleValue = getNoise(x, y, z, 0.2)
  if (styleValue < 0.5) return 'basicWall'
  return 'thickWall'
}

// Helper function to select a random column type
const selectColumnType = (x: number, y: number, z: number) => {
  const styleValue = getNoise(x, y, z, 0.3)
  if (styleValue < 0.33) return 'massiveColumn'
  if (styleValue < 0.66) return 'tColumn'
  return 'crossColumn'
}

// Helper function to select a random roof type
const selectRoofType = (x: number, y: number, z: number) => {
  const styleValue = getNoise(x, y, z, 0.25)
  if (styleValue < 0.4) return 'flatRoof'
  if (styleValue < 0.7) return 'cantileverRoof'
  return 'cofferedRoof'
}

// Helper function to ensure orthogonal rotation (90-degree increments)
const getOrthogonalRotation = (seed: number): Euler => {
  const rotationIndex = Math.floor(random(0, 4, seed))
  return new Euler(0, Math.PI * 0.5 * rotationIndex, 0)
}

// Helper function to generate floating cube cluster
const generateFloatingCluster = (
  center: Vector3,
  size: number,
  config: GeneratorConfig
): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { seed = Math.random(), aggregationFactor = 0.6 } = config
  const numCubes = Math.floor(random(3, 12, seed))
  
  for (let i = 0; i < numCubes; i++) {
    const cubeSeed = seed + i
    // Calculate position with tendency to cluster based on aggregationFactor
    const distance = random(0, size, cubeSeed) * (1 - aggregationFactor)
    const angle = random(0, Math.PI * 2, cubeSeed)
    const heightVar = random(-size/2, size/2, cubeSeed)
    
    const position = new Vector3(
      center.x + Math.cos(angle) * distance,
      center.y + heightVar,
      center.z + Math.sin(angle) * distance
    )
    
    // Vary cube size
    const scale = random(0.3, 1, cubeSeed)
    
    elements.push({
      ...brutalistAssets.modules.floatingCube,
      id: `floating_cube_${i}`,
      geometry: {
        ...brutalistAssets.modules.floatingCube.geometry,
        dimensions: new Vector3(scale, scale, scale),
        position,
        rotation: new Euler(
          random(0, Math.PI * 2, cubeSeed),
          random(0, Math.PI * 2, cubeSeed),
          random(0, Math.PI * 2, cubeSeed)
        ),
        scale: new Vector3(1, 1, 1)
      }
    })
  }
  
  return elements
}

// Helper function to apply brutalist principles
const applyBrutalistPrinciples = (elements: BrutalistElement[], config: GeneratorConfig): BrutalistElement[] => {
  const modified: BrutalistElement[] = []
  
  elements.forEach(element => {
    // 1. Raw materiality - exposed concrete surfaces
    const modifiedElement = {
      ...element,
      material: element.material.roughness > 0.3 ? 
        brutalistAssets.modules.monolithicWall.material :
        element.material
    }
    
    // 2. Horizontal emphasis and modular repetition
    if ((element as BrutalistModule).category === 'wall') {
      const horizontalEmphasis = random(1.5, 2.5, config.seed || Math.random())
      modifiedElement.geometry.dimensions = new Vector3(
        element.geometry.dimensions.x * horizontalEmphasis,
        element.geometry.dimensions.y,
        element.geometry.dimensions.z * 1.2
      )
    }
    
    // 3. Ensure orthogonal relationships
    modifiedElement.geometry.rotation = new Euler(
      0,
      Math.round(element.geometry.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
      0
    )
    
    modified.push(modifiedElement)
  })
  
  return modified
}

// Define structure types for varied generation
type StructureType = 'wide' | 'tall' | 'balanced'

interface StructureConfig extends GeneratorConfig {
  structureType: StructureType
}

const getStructureDimensions = (type: StructureType, baseSize: number): { width: number, height: number, depth: number } => {
  switch (type) {
    case 'wide':
      return {
        width: baseSize * random(2.0, 3.0, Math.random()),
        height: baseSize * random(0.8, 1.2, Math.random()),
        depth: baseSize * random(1.5, 2.0, Math.random())
      }
    case 'tall':
      return {
        width: baseSize * random(0.8, 1.2, Math.random()),
        height: baseSize * random(2.0, 3.0, Math.random()),
        depth: baseSize * random(0.8, 1.2, Math.random())
      }
    default: // balanced
      return {
        width: baseSize * random(1.2, 1.8, Math.random()),
        height: baseSize * random(1.2, 1.8, Math.random()),
        depth: baseSize * random(1.2, 1.8, Math.random())
      }
  }
}

const generateBrutalistStructure = (config: StructureConfig): BrutalistElement[] => {
  const { cellSize, structureType } = config
  const dimensions = getStructureDimensions(structureType, cellSize)
  const elements: BrutalistElement[] = []

  // Generate base living volume
  const livingSpace = generateLivingSpace({
    ...config,
    cellSize: dimensions.width,
    height: dimensions.height
  })

  // Apply brutalist principles to main structure
  elements.push(...applyBrutalistPrinciples(livingSpace, config))

  // Add characteristic residential features based on type
  switch (structureType) {
    case 'wide':
      // Single-story with extended terraces
      elements.push(...generateSingleStoryElements(dimensions, config))
      break
    case 'tall':
      // Multi-story with stacked volumes
      elements.push(...generateMultiStoryElements(dimensions, config))
      break
    case 'balanced':
      // Split-level with integrated outdoor spaces
      elements.push(...generateSplitLevelElements(dimensions, config))
      break
  }

  // Add floating elements as sculptural features
  elements.push(...generateFloatingElements(dimensions, config))

  return elements
}

const generateLivingSpace = (config: GeneratorConfig): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { cellSize, height, offset, seed = Math.random() } = config
  
  // Create L-shaped or U-shaped main volume using planes
  const wallThickness = 0.4
  const innerOffset = cellSize * 0.3 // Size of the carved out space
  
  // Determine if L-shaped (true) or U-shaped (false) with 50/50 probability
  const isLShaped = random(0, 1, seed) < 0.5
  
  // Primary vertical wall (long side)
  elements.push({
    ...brutalistAssets.modules.monolithicWall,
    id: 'main_wall_long',
    geometry: {
      dimensions: new Vector3(cellSize, height, wallThickness),
      position: new Vector3(
        offset.x + cellSize / 2,
        offset.y + height / 2,
        offset.z
      ),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    }
  })
  
  // Secondary vertical wall (short side)
  elements.push({
    ...brutalistAssets.modules.monolithicWall,
    id: 'main_wall_short',
    geometry: {
      dimensions: new Vector3(wallThickness, height, cellSize * 0.7),
      position: new Vector3(
        offset.x,
        offset.y + height / 2,
        offset.z + cellSize * 0.35
      ),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    }
  })
  
  // For U-shaped, add third wall
  if (!isLShaped) {
    elements.push({
      ...brutalistAssets.modules.monolithicWall,
      id: 'main_wall_third',
      geometry: {
        dimensions: new Vector3(wallThickness, height, cellSize * 0.7),
        position: new Vector3(
          offset.x + cellSize,
          offset.y + height / 2,
          offset.z + cellSize * 0.35
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }
  
  // Add floor plane
  elements.push({
    ...brutalistAssets.modules.flatRoof,
    id: 'floor_plane',
    geometry: {
      dimensions: new Vector3(cellSize, wallThickness, cellSize * 0.7),
      position: new Vector3(
        offset.x + cellSize / 2,
        offset.y,
        offset.z + cellSize * 0.35
      ),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    }
  })
  
  // Add roof plane
  elements.push({
    ...brutalistAssets.modules.flatRoof,
    id: 'roof_plane',
    geometry: {
      dimensions: new Vector3(cellSize, wallThickness, cellSize * 0.7),
      position: new Vector3(
        offset.x + cellSize / 2,
        offset.y + height,
        offset.z + cellSize * 0.35
      ),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    }
  })
  
  // Add interior dividing walls
  const numDividers = Math.floor(random(1, 3, seed))
  for (let i = 0; i < numDividers; i++) {
    const dividerPosition = random(0.3, 0.7, seed + i)
    elements.push({
      ...brutalistAssets.modules.thickWall,
      id: `divider_${i}`,
      geometry: {
        dimensions: new Vector3(wallThickness, height * 0.8, cellSize * 0.4),
        position: new Vector3(
          offset.x + cellSize * dividerPosition,
          offset.y + height * 0.4,
          offset.z + cellSize * 0.35
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }
  
  // Add windows in the carved-out space
  const numWindows = Math.floor(random(2, 4, seed))
  for (let i = 0; i < numWindows; i++) {
    elements.push({
      ...brutalistAssets.decorative.brutalWindow,
      id: `window_${i}`,
      geometry: {
        dimensions: new Vector3(2.0, height * 0.4, 0.3),
        position: new Vector3(
          offset.x + cellSize * (i + 1) / (numWindows + 1),
          offset.y + height * 0.5,
          offset.z
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }
  
  // Add courtyard elements in the carved-out space
  if (!isLShaped) {
    // For U-shaped buildings, add central courtyard feature
    elements.push({
      ...brutalistAssets.modules.flatRoof,
      id: 'courtyard_platform',
      geometry: {
        dimensions: new Vector3(cellSize * 0.4, 0.2, cellSize * 0.4),
        position: new Vector3(
          offset.x + cellSize * 0.5,
          offset.y + 0.1,
          offset.z + cellSize * 0.35
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  } else {
    // For L-shaped buildings, add corner feature
    elements.push({
      ...brutalistAssets.modules.massiveColumn,
      id: 'corner_feature',
      geometry: {
        dimensions: new Vector3(1.0, height * 0.7, 1.0),
        position: new Vector3(
          offset.x + cellSize * 0.8,
          offset.y + height * 0.35,
          offset.z + cellSize * 0.6
        ),
        rotation: new Euler(0, Math.PI / 4, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }

  return elements
}

const generateSingleStoryElements = (
  dimensions: { width: number; height: number; depth: number },
  config: StructureConfig
): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { offset, seed = Math.random() } = config

  // Extended terrace with varying levels
  const numTerraces = Math.floor(random(2, 4, seed))
  for (let i = 0; i < numTerraces; i++) {
    const terraceHeight = dimensions.height * random(0.2, 0.4, seed + i)
    elements.push({
      ...brutalistAssets.modules.flatRoof,
      id: `extended_terrace_${i}`,
      geometry: {
        dimensions: new Vector3(
          dimensions.width * random(0.3, 0.6, seed + i),
          0.4,
          dimensions.depth * random(0.3, 0.5, seed + i)
        ),
        position: new Vector3(
          offset.x + dimensions.width * random(0.2, 0.8, seed + i),
          offset.y + terraceHeight,
          offset.z + dimensions.depth * random(0.5, 1.0, seed + i)
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }

  // Add large windows
  const numWindows = Math.floor(random(3, 5, seed))
  for (let i = 0; i < numWindows; i++) {
    elements.push({
      ...brutalistAssets.modules.brutalWindow,
      id: `window_${i}`,
      geometry: {
        dimensions: new Vector3(2.5, 2.0, 0.4),
        position: new Vector3(
          offset.x + dimensions.width * (i + 1) / (numWindows + 1),
          offset.y + dimensions.height * 0.4,
          offset.z
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })
  }

  return elements
}

const generateMultiStoryElements = (
  dimensions: { width: number; height: number; depth: number },
  config: StructureConfig
): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { offset, seed = Math.random() } = config
  const numFloors = Math.floor(dimensions.height / 3)
  const baseWidth = dimensions.width * 0.6 // Narrower base for vertical emphasis

  // Core structure - vertical spine
  elements.push({
    ...brutalistAssets.modules.monolithicWall,
    id: 'vertical_core',
    geometry: {
      dimensions: new Vector3(
        baseWidth * 0.4,
        dimensions.height,
        dimensions.depth * 0.4
      ),
      position: new Vector3(
        offset.x + dimensions.width * 0.3,
        offset.y + dimensions.height / 2,
        offset.z + dimensions.depth * 0.3
      ),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    }
  })

  // Generate interlocking volumes at different heights
  for (let i = 0; i < numFloors; i++) {
    const floorHeight = dimensions.height / numFloors
    const yPosition = offset.y + i * floorHeight
    
    // Alternate between different volume types
    if (i % 3 === 0) {
      // Cantilevered box extending outward
      elements.push({
        ...brutalistAssets.modules.monolithicWall,
        id: `cantilever_${i}`,
        geometry: {
          dimensions: new Vector3(
            baseWidth * random(0.8, 1.2, seed + i),
            floorHeight * 1.2,
            dimensions.depth * 0.6
          ),
          position: new Vector3(
            offset.x + dimensions.width * 0.6,
            yPosition + floorHeight / 2,
            offset.z + dimensions.depth * 0.4
          ),
          rotation: new Euler(0, 0, 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    } else if (i % 3 === 1) {
      // Perpendicular volume
      elements.push({
        ...brutalistAssets.modules.monolithicWall,
        id: `perpendicular_${i}`,
        geometry: {
          dimensions: new Vector3(
            baseWidth * 0.5,
            floorHeight * 1.5,
            dimensions.depth * random(0.8, 1.2, seed + i)
          ),
          position: new Vector3(
            offset.x + dimensions.width * 0.2,
            yPosition + floorHeight / 2,
            offset.z + dimensions.depth * 0.7
          ),
          rotation: new Euler(0, 0, 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    } else {
      // Offset stacked volume
      const xOffset = random(-0.3, 0.3, seed + i)
      elements.push({
        ...brutalistAssets.modules.monolithicWall,
        id: `offset_volume_${i}`,
        geometry: {
          dimensions: new Vector3(
            baseWidth * 0.7,
            floorHeight * 0.9,
            dimensions.depth * 0.7
          ),
          position: new Vector3(
            offset.x + dimensions.width * (0.4 + xOffset),
            yPosition + floorHeight / 2,
            offset.z + dimensions.depth * 0.5
          ),
          rotation: new Euler(0, random(-Math.PI/6, Math.PI/6, seed + i), 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    }

    // Add dramatic horizontal elements
    if (i % 2 === 0) {
      elements.push({
        ...brutalistAssets.modules.cantileverRoof,
        id: `horizontal_plane_${i}`,
        geometry: {
          dimensions: new Vector3(
            baseWidth * random(1.2, 1.8, seed + i),
            0.4,
            dimensions.depth * 0.3
          ),
          position: new Vector3(
            offset.x + dimensions.width * random(0.2, 0.6, seed + i),
            yPosition + floorHeight * 0.8,
            offset.z + dimensions.depth * random(0.3, 0.7, seed + i)
          ),
          rotation: new Euler(0, random(-Math.PI/4, Math.PI/4, seed + i), 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    }

    // Add vertical circulation elements (stairs/elevator shafts)
    if (i % 2 === 0) {
      elements.push({
        ...brutalistAssets.modules.massiveColumn,
        id: `vertical_element_${i}`,
        geometry: {
          dimensions: new Vector3(
            baseWidth * 0.2,
            floorHeight * 2,
            baseWidth * 0.2
          ),
          position: new Vector3(
            offset.x + dimensions.width * 0.15,
            yPosition + floorHeight,
            offset.z + dimensions.depth * 0.15
          ),
          rotation: new Euler(0, 0, 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    }

    // Add window elements
    const numWindows = Math.floor(random(2, 4, seed + i))
    for (let w = 0; w < numWindows; w++) {
      elements.push({
        ...brutalistAssets.decorative.brutalWindow,
        id: `window_${i}_${w}`,
        geometry: {
          dimensions: new Vector3(
            1.5,
            floorHeight * 0.6,
            0.3
          ),
          position: new Vector3(
            offset.x + dimensions.width * (0.2 + w * 0.25),
            yPosition + floorHeight * 0.5,
            offset.z + dimensions.depth * (w % 2 === 0 ? 0.95 : 0.05)
          ),
          rotation: new Euler(0, w % 2 === 0 ? 0 : Math.PI, 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    }
  }

  return elements
}

const generateSplitLevelElements = (
  dimensions: { width: number; height: number; depth: number },
  config: StructureConfig
): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { offset, seed = Math.random() } = config

  // Split levels with interconnected spaces
  const numLevels = 3
  for (let i = 0; i < numLevels; i++) {
    const levelHeight = dimensions.height / 2
    const yOffset = i * levelHeight / 2

    // Level volume
    elements.push({
      ...brutalistAssets.modules.monolithicWall,
      id: `level_${i}`,
      geometry: {
        dimensions: new Vector3(
          dimensions.width * random(0.6, 0.8, seed + i),
          levelHeight,
          dimensions.depth * random(0.6, 0.8, seed + i)
        ),
        position: new Vector3(
          offset.x + dimensions.width * (0.3 + i * 0.2),
          offset.y + yOffset + levelHeight / 2,
          offset.z + dimensions.depth * (0.3 + i * 0.2)
        ),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }
    })

    // Connecting platforms
    if (i < numLevels - 1) {
      elements.push({
        ...brutalistAssets.modules.flatRoof,
        id: `connector_${i}`,
        geometry: {
          dimensions: new Vector3(
            dimensions.width * 0.3,
            0.4,
            dimensions.depth * 0.3
          ),
          position: new Vector3(
            offset.x + dimensions.width * (0.4 + i * 0.2),
            offset.y + yOffset + levelHeight,
            offset.z + dimensions.depth * (0.4 + i * 0.2)
          ),
          rotation: new Euler(0, 0, 0),
          scale: new Vector3(1, 1, 1)
        }
      })
    }
  }

  return elements
}

const generateFloatingElements = (
  dimensions: { width: number; height: number; depth: number },
  config: StructureConfig
): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { floatingDensity = 0.5, seed = Math.random() } = config
  
  // Generate individual floating cubes
  const numFloating = Math.floor(random(10, 20, seed) * floatingDensity)
  const spread = Math.max(dimensions.width, dimensions.height, dimensions.depth)
  
  for (let i = 0; i < numFloating; i++) {
    const size = random(0.3, 1.0, seed + i)
    elements.push({
      ...brutalistAssets.modules.floatingCube,
      id: `floating_cube_${i}`,
      geometry: {
        dimensions: new Vector3(size, size, size),
        position: new Vector3(
          config.offset.x + random(-spread/2, spread*1.5, seed + i),
          config.offset.y + random(0, spread*1.5, seed + i),
          config.offset.z + random(-spread/2, spread*1.5, seed + i)
        ),
        rotation: new Euler(
          random(0, Math.PI * 2, seed + i),
          random(0, Math.PI * 2, seed + i),
          random(0, Math.PI * 2, seed + i)
        ),
        scale: new Vector3(1, 1, 1)
      }
    })
  }
  
  return elements
}

export const generateBrutalistCell = (config: GeneratorConfig): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const typeRoll = Math.random()

  // 30% chance to generate a hybrid composition
  if (typeRoll < 0.3) {
    // Generate both horizontal and vertical structures
    const horizontalConfig = {
      ...config,
      offset: new Vector3(
        config.offset.x - config.cellSize * 0.6,
        config.offset.y,
        config.offset.z
      ),
      cellSize: config.cellSize * 0.8,
      height: config.height * 0.6,
      structureType: 'wide' as StructureType
    }

    const verticalConfig = {
      ...config,
      offset: new Vector3(
        config.offset.x + config.cellSize * 0.4,
        config.offset.y,
        config.offset.z + config.cellSize * 0.3
      ),
      cellSize: config.cellSize * 0.6,
      height: config.height * 1.5,
      structureType: 'tall' as StructureType
    }

    elements.push(...generateBrutalistStructure(horizontalConfig))
    elements.push(...generateBrutalistStructure(verticalConfig))
    return elements
  }

  // For non-hybrid generations, use existing weighted probability
  const structureType: StructureType = 
    typeRoll < 0.5 ? 'wide' :
    typeRoll < 0.7 ? 'balanced' :
    'tall'

  return generateBrutalistStructure({
    ...config,
    structureType
  })
}

// Helper function to generate main structure with brutalist principles
const generateMainStructure = (config: GeneratorConfig, providedWallThickness: number): BrutalistElement[] => {
  const elements: BrutalistElement[] = []
  const { 
    cellSize, 
    height,
    offset,
    complexity = 0.5,
    symmetry = false,
    seed = Math.random()
  } = config

  // Create modular grid system
  const gridSize = cellSize / 3
  const numModules = Math.floor(random(2, 4, seed))
  
  // Generate horizontal modules
  for (let i = 0; i < numModules; i++) {
    const moduleWidth = gridSize * random(1.5, 2.5, seed + i)
    const moduleDepth = gridSize * random(1.2, 2.0, seed + i + 0.1)
    const moduleHeight = height * random(0.8, 1.1, seed + i + 0.2)
    
    const moduleOffset = new Vector3(
      offset.x + i * gridSize * 1.2,
      offset.y,
      offset.z + (i % 2) * gridSize * 0.8 // Staggered arrangement
    )
    
    // Add main walls with brutalist proportions
    const wallType = selectWallType(moduleOffset.x, moduleOffset.y, moduleOffset.z)
    elements.push({
      ...brutalistAssets.modules[wallType],
      id: `module_wall_${i}`,
      geometry: {
        ...brutalistAssets.modules[wallType].geometry,
        dimensions: new Vector3(moduleWidth, moduleHeight, providedWallThickness),
        position: new Vector3(
          moduleOffset.x + moduleWidth/2,
          moduleOffset.y + moduleHeight/2,
          moduleOffset.z
        ),
        rotation: new Euler(0, 0, 0)
      }
    })
    
    // Add perpendicular walls for spatial definition
    if (random(0, 1, seed + i) > 0.3) {
      elements.push({
        ...brutalistAssets.modules[wallType],
        id: `module_side_wall_${i}`,
        geometry: {
          ...brutalistAssets.modules[wallType].geometry,
          dimensions: new Vector3(moduleDepth, moduleHeight * 0.8, providedWallThickness),
          position: new Vector3(
            moduleOffset.x,
            moduleOffset.y + moduleHeight * 0.4,
            moduleOffset.z + moduleDepth/2
          ),
          rotation: new Euler(0, Math.PI / 2, 0)
        }
      })
    }
  }
  
  // Add horizontal elements (platforms, cantilevers)
  const numPlatforms = Math.floor(random(1, 3, seed + 10))
  for (let i = 0; i < numPlatforms; i++) {
    const platformWidth = gridSize * random(2, 3, seed + i + 20)
    const platformDepth = gridSize * random(1.5, 2.5, seed + i + 21)
    
    elements.push({
      ...brutalistAssets.modules.flatRoof,
      id: `platform_${i}`,
      geometry: {
        ...brutalistAssets.modules.flatRoof.geometry,
        dimensions: new Vector3(platformWidth, 0.4, platformDepth),
        position: new Vector3(
          offset.x + random(0, cellSize - platformWidth, seed + i + 22),
          offset.y + height * random(0.3, 0.7, seed + i + 23),
          offset.z + random(0, cellSize - platformDepth, seed + i + 24)
        ),
        rotation: new Euler(0, 0, 0)
      }
    })
  }

  return elements
}

// Generate a brutalist structure with the specified configuration
export const generateMinimalStructure = (): BrutalistElement[] => {
  const config: GeneratorConfig = {
    cellSize: 6,
    height: 4,
    offset: new Vector3(-3, 0, -3), // Center the structure
    complexity: 0.7, // Medium-high complexity
    symmetry: true, // Enable symmetrical generation
    seed: Math.random() // Random seed for consistent generation
  }
  
  return generateBrutalistCell(config)
} 