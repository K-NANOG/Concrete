import { Vector3, Euler } from 'three'
import {
  BrutalistModule,
  BrutalistConnector,
  BrutalistDecorative,
  BrutalistAssetCollection
} from '@/types/assets/BrutalistAssets'

// Material variations for brutalist concrete
const materials = {
  copiedCityWhite: {
    roughness: 0.3,
    metalness: 0.1,
    color: '#ffffff',
    textureType: 'smooth' as const
  },
  copiedCityLight: {
    roughness: 0.4,
    metalness: 0.15,
    color: '#f5f5f5',
    textureType: 'smooth' as const
  },
  copiedCityMedium: {
    roughness: 0.5,
    metalness: 0.1,
    color: '#f0f0f0',
    textureType: 'smooth' as const
  },
  copiedCityDark: {
    roughness: 0.6,
    metalness: 0.05,
    color: '#e8e8e8',
    textureType: 'smooth' as const
  },
  roughConcrete: {
    roughness: 0.9,
    metalness: 0.1,
    color: '#cccccc',
    textureType: 'rough' as const
  },
  smoothConcrete: {
    roughness: 0.6,
    metalness: 0.15,
    color: '#d6d6d6',
    textureType: 'smooth' as const
  },
  weatheredConcrete: {
    roughness: 0.85,
    metalness: 0.05,
    color: '#b4b4b4',
    textureType: 'weathered' as const
  },
  boardformedConcrete: {
    roughness: 0.8,
    metalness: 0.1,
    color: '#c8c8c8',
    textureType: 'boardformed' as const
  },
  exposeAggregateConcrete: {
    roughness: 0.95,
    metalness: 0.05,
    color: '#c0c0c0',
    textureType: 'rough' as const
  }
}

// Basic Modules
const modules: Record<string, BrutalistModule> = {
  // Floating Elements
  floatingCube: {
    id: 'floatingCube',
    type: 'module',
    category: 'floating',
    structuralRole: 'decorative',
    loadBearing: false,
    geometry: {
      dimensions: new Vector3(1, 1, 1),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.copiedCityWhite,
    symmetryAxes: ['x', 'y', 'z'],
    allowedConnections: ['cubeConnector']
  },
  floatingPlane: {
    id: 'floatingPlane',
    type: 'module',
    category: 'floating',
    structuralRole: 'decorative',
    loadBearing: false,
    geometry: {
      dimensions: new Vector3(2, 0.2, 2),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.copiedCityWhite,
    symmetryAxes: ['x', 'z'],
    allowedConnections: ['cubeConnector']
  },
  
  // Brutalist Modules
  monolithicWall: {
    id: 'monolithicWall',
    type: 'module',
    category: 'wall',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(8, 6, 0.4),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.copiedCityWhite,
    symmetryAxes: ['x', 'y'],
    allowedConnections: ['wallConnector']
  },
  basicWall: {
    id: 'basicWall',
    type: 'module',
    category: 'wall',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(4, 3, 0.3),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.roughConcrete,
    symmetryAxes: ['x', 'y'],
    allowedConnections: ['wallConnector', 'columnConnector']
  },
  thickWall: {
    id: 'thickWall',
    type: 'module',
    category: 'wall',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(4, 3, 0.6),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.boardformedConcrete,
    symmetryAxes: ['x', 'y'],
    allowedConnections: ['wallConnector', 'columnConnector']
  },
  buttressWall: {
    id: 'buttressWall',
    type: 'module',
    category: 'wall',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(5, 4, 0.4),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.boardformedConcrete,
    symmetryAxes: ['x', 'y'],
    allowedConnections: ['wallConnector', 'columnConnector']
  },

  // Columns
  massiveColumn: {
    id: 'massiveColumn',
    type: 'module',
    category: 'column',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(1, 4, 1),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['x', 'z'],
    allowedConnections: ['columnConnector', 'floorConnector']
  },
  tColumn: {
    id: 'tColumn',
    type: 'module',
    category: 'column',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(2, 4, 1),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['z'],
    allowedConnections: ['columnConnector', 'beamConnector']
  },
  crossColumn: {
    id: 'crossColumn',
    type: 'module',
    category: 'column',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(1.5, 5, 1.5),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.exposeAggregateConcrete,
    symmetryAxes: ['x', 'z'],
    allowedConnections: ['columnConnector', 'beamConnector']
  },

  // Roofs and Slabs
  flatRoof: {
    id: 'flatRoof',
    type: 'module',
    category: 'platform',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(6, 0.4, 6),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['x', 'z'],
    allowedConnections: ['beamConnector', 'columnConnector']
  },
  cantileverRoof: {
    id: 'cantileverRoof',
    type: 'module',
    category: 'platform',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(8, 0.5, 6),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['z'],
    allowedConnections: ['beamConnector', 'columnConnector']
  },
  cofferedRoof: {
    id: 'cofferedRoof',
    type: 'module',
    category: 'platform',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(6, 0.6, 6),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.boardformedConcrete,
    symmetryAxes: ['x', 'z'],
    allowedConnections: ['beamConnector', 'columnConnector']
  },

  // Beams and Support
  mainBeam: {
    id: 'mainBeam',
    type: 'module',
    category: 'floor',
    structuralRole: 'primary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(6, 0.8, 0.4),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['x'],
    allowedConnections: ['beamConnector', 'columnConnector']
  },
  crossBeam: {
    id: 'crossBeam',
    type: 'module',
    category: 'floor',
    structuralRole: 'secondary',
    loadBearing: true,
    geometry: {
      dimensions: new Vector3(4, 0.6, 0.3),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, Math.PI / 2, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    symmetryAxes: ['x'],
    allowedConnections: ['beamConnector']
  }
}

// Connectors
const connectors: Record<string, BrutalistConnector> = {
  wallConnector: {
    id: 'wallConnector',
    type: 'connector',
    category: 'joint',
    geometry: {
      dimensions: new Vector3(0.3, 3, 0.3),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.roughConcrete,
    connectionPoints: [
      new Vector3(0, 1.5, 0),
      new Vector3(0, -1.5, 0)
    ]
  },
  beamConnector: {
    id: 'beamConnector',
    type: 'connector',
    category: 'joint',
    geometry: {
      dimensions: new Vector3(0.4, 0.8, 0.4),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    connectionPoints: [
      new Vector3(0.2, 0, 0),
      new Vector3(-0.2, 0, 0)
    ]
  },
  columnConnector: {
    id: 'columnConnector',
    type: 'connector',
    category: 'joint',
    geometry: {
      dimensions: new Vector3(1, 0.4, 1),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete,
    connectionPoints: [
      new Vector3(0, 0.2, 0),
      new Vector3(0, -0.2, 0)
    ]
  }
}

// Decorative Elements
const decorative: Record<string, BrutalistDecorative> = {
  ribPattern: {
    id: 'ribPattern',
    type: 'decorative',
    category: 'pattern',
    depth: 0.05,
    geometry: {
      dimensions: new Vector3(2, 2, 0.05),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.roughConcrete
  },
  boardformTexture: {
    id: 'boardformTexture',
    type: 'decorative',
    category: 'pattern',
    depth: 0.02,
    geometry: {
      dimensions: new Vector3(2, 2, 0.02),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.boardformedConcrete
  },
  brutalWindow: {
    id: 'brutalWindow',
    type: 'decorative',
    category: 'detail',
    depth: 0.3,
    geometry: {
      dimensions: new Vector3(1.5, 2, 0.3),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.weatheredConcrete
  },
  sunshade: {
    id: 'sunshade',
    type: 'decorative',
    category: 'detail',
    depth: 0.8,
    geometry: {
      dimensions: new Vector3(2, 0.3, 0.8),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    },
    material: materials.smoothConcrete
  }
}

export const brutalistAssets: BrutalistAssetCollection = {
  modules,
  connectors,
  decorative
}

export default brutalistAssets 