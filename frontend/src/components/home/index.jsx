import React from 'react'
import './index.css'
import { Search } from 'lucide-react'
import Navbar from '../megaNav/Navbar2'

function HomePage() {
  return (
    <div>
      <div className="relative w-full h-[500px] md:h-[700px] bg-cover bg-right flex items-center px-6 md:px-12 hero-section">
      <div className="absolute top-0 w-full bg-transparent z-50" id='navbar'>
        <Navbar />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50" id='overlay'></div>

      

      {/* Content */}
      <div className="relative z-10 text-white max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold overflow-hidden">
          Vyapaar, A B2B Platform for Trade in India
        </h1>
        <a href="#" className="text-lg underline mt-2 block">
          Find out more about Vyapaar
        </a>

        {/* Search Bar */}
        <div className="mt-6 w-full flex items-center bg-white rounded-lg overflow-hidden shadow-md">
          <input
            type="text"
            placeholder="Search for products, services..."
            className="w-full p-3 text-black focus:outline-none"
          />
          <button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] cursor-pointer text-[var(--color-heading)] px-6 py-3 flex items-center gap-2 rounded-xl m-1 ">
            <span><Search className='w-5 h-5 mr-4'/></span> Search
          </button>
        </div>

        {/* Frequently Searched */}
        <p className="mt-4 text-gray-200">Frequently searched:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Steel Pipes", "Electronic Parts", "Machinery", "Office Supplies"].map((item, index) => (
            <button
              key={index}
              className="border border-white text-white px-4 py-2 rounded-lg bg-transparent hover:bg-white hover:text-black transition">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default HomePage