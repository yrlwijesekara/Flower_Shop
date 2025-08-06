import { useState } from 'react'
import Navbar from './components/Navbar'
import MiniNavbar from './components/MiniNavbar'
import { FiHome } from 'react-icons/fi'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const breadcrumbData = [
    { 
      label: 'Products', 
      href: '#products' 
    }
  ]

  const handleFilterToggle = (isOpen) => {
    setIsFilterOpen(isOpen)
    console.log('Filters are now:', isOpen ? 'open' : 'closed')
  }

  return (
    <>
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={true}
        onFilterToggle={handleFilterToggle}
        isFilterOpen={isFilterOpen}
      />
      
   
    </>
  )
}

export default App
