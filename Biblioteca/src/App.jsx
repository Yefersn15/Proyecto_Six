import { useState } from 'react'
import './App.css'
import LayOut from './components/LayOut'
import Rutas from './components/Rutas'

function App() {
  return (
    <>
    <LayOut>
      <Rutas />
    </LayOut>
    </>
  )
}

export default App