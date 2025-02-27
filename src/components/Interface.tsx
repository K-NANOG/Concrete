import { useState } from 'react'
import styled from '@emotion/styled'

const InterfaceContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 10;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: 400;
`

const Input = styled.input`
  width: 200px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #ffffff;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`

interface InterfaceProps {
  onGenerate: (params: { height: number; cellSize: number }) => void
}

const Interface = ({ onGenerate }: InterfaceProps) => {
  const [height, setHeight] = useState(4)
  const [cellSize, setCellSize] = useState(6)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({ height, cellSize })
  }

  return (
    <InterfaceContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={1}
            max={10}
            step={0.5}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="cellSize">Cell Size</Label>
          <Input
            id="cellSize"
            type="number"
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            min={2}
            max={12}
            step={0.5}
          />
        </InputGroup>
        <Button type="submit">Generate</Button>
      </Form>
    </InterfaceContainer>
  )
}

export default Interface 