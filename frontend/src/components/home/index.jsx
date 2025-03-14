import React from 'react'
import { NavigationMenuDemo } from '../Navbar2'
import { Navigation } from 'lucide-react'

function HomePage() {
  return (
    <div className='container'>
        <NavigationMenuDemo />
        <div>
            <h1>Home Page</h1>
        </div>
    </div>
  )
}

export default HomePage