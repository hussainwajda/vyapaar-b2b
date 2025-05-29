import React from 'react'
import './index.css'
import {  IndianRupee, LockIcon, Search } from 'lucide-react'
import BlurText from '../../assets/BlurText'
import SpotlightCard from '../../assets/SpotlightCard/SpotlightCard'
import Navbar from '../megaNav/Navbar2'
import { RocketIcon, TruckIcon  } from 'lucide-react'
import ExploreSection from './ExploreSection'
import CircularGallery from './CategoriesSection'
import CategoryGrid from '../../assets/categoryGrid'
import SearchBar from '../../assets/searchBar'
function HomePage() {

  const cards = [
    {
      icon: <RocketIcon size={30} />,
      title: "Grow Your Business",
      desc: "Get Your Products be marketed by us and grow your business.",
    },
    {
      icon: <LockIcon size={30} />,
      title: "Secured Transactions",
      desc: "Your data is safe with us and your transactions are secure.",
    },
    {
      icon: <TruckIcon size={30} />,
      title: "Shipment",
      desc: "Ship your products with Vyapaar to all over India securely and safely.",
    },
    {
      icon: <IndianRupee size={30} />,
      title: "Easy finance",
      desc: "Get finance for your business with Vyapaar and grow your business.",
    },
  ];

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
        <BlurText
        className="text-3xl md:text-5xl font-bold overflow-hidden"
        text="Vyapaar, A B2B Platform for Trade in India"
        delay={150}
        direction='top'
        />
        
        <SearchBar />

        <a href="#" className="text-lg underline mt-2 block">
          Find out more about Vyapaar
        </a>

        
      </div>
    </div>

    {/* feature cards */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      padding: "3rem",
      
    }}
    className='bg-[var(--color-primary)]'>
      {cards.map((card, index) => (
        <SpotlightCard key={index}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </div>
        </SpotlightCard>
      ))}
    </div>

    <ExploreSection />

    <CategoryGrid />

  </div>
  )
}

export default HomePage