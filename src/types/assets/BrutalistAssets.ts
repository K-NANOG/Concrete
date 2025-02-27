import { Vector3, Euler } from 'three'

// Basic geometric properties
export interface GeometricProperties {
  dimensions: Vector3
  position: Vector3
  rotation: Euler
  scale: Vector3
}

// Material properties for brutalist concrete
export interface MaterialProperties {
  roughness: number
  metalness: number
  color: string
  bumpScale?: number
  textureType?: 'smooth' | 'rough' | 'weathered' | 'boardformed'
}

// Base interface for all brutalist elements
export interface BrutalistElement {
  id: string
  type: 'module' | 'connector' | 'decorative'
  geometry: GeometricProperties
  material: MaterialProperties
  symmetryAxes?: ('x' | 'y' | 'z')[]
  allowedConnections?: string[] // IDs of compatible elements
}

// Core building modules
export interface BrutalistModule extends BrutalistElement {
  type: 'module'
  category: 'wall' | 'floor' | 'column' | 'stair' | 'platform' | 'floating'
  structuralRole: 'primary' | 'secondary' | 'tertiary' | 'decorative'
  loadBearing: boolean
}

// Connector elements
export interface BrutalistConnector extends BrutalistElement {
  type: 'connector'
  category: 'joint' | 'bridge' | 'transition'
  connectionPoints: Vector3[]
}

// Decorative elements
export interface BrutalistDecorative extends BrutalistElement {
  type: 'decorative'
  category: 'pattern' | 'relief' | 'detail'
  depth: number // Relief depth for brutalist patterns
}

// Asset collection for organization
export interface BrutalistAssetCollection {
  modules: Record<string, BrutalistModule>
  connectors: Record<string, BrutalistConnector>
  decorative: Record<string, BrutalistDecorative>
} 