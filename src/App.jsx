import { useEffect, useState } from 'react'
import CinematicIntro from './components/CinematicIntro'
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import ThemeToggle from './components/ThemeToggle'
import Hero from './components/Hero'
import WhoIAm from './components/WhoIAm'
import SelectedWork from './components/SelectedWork'
import WhatIDo from './components/WhatIDo'
import Experiments from './components/Experiments'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import BuyMeCoffee from './components/BuyMeCoffee'
import { useScrollVelocity } from './hooks/useScrollVelocity'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false)
  useScrollVelocity()

  useEffect(() => {
    document.body.classList.toggle('is-loading', loading)
    if (!loading) document.body.classList.remove('is-loading')
  }, [loading])

  return (
    <>
      <CustomCursor />
      <CinematicIntro />
      {loading && <Loader onDone={() => setLoading(false)} />}
      <div className="page">
        <ThemeToggle className="theme-toggle-floating" />
        <main>
          <Hero />
          <WhoIAm />
          <SelectedWork />
          <WhatIDo />
          <Experiments />
          <FinalCTA onOpenCoffee={() => setCoffeeModalOpen(true)} />
        </main>
        <Footer />
      </div>

      <BuyMeCoffee
        isOpen={coffeeModalOpen}
        onOpen={() => setCoffeeModalOpen(true)}
        onClose={() => setCoffeeModalOpen(false)}
      />
    </>
  )
}

export default App