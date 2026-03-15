import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CURATED_DESTINATIONS = [
  { name: 'Jaipur', country: 'India', img: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1200' },
  { name: 'Kerala', country: 'India', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200' },
  { name: 'Varanasi', country: 'India', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200' },
];

export const Home = () => {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate(`/search?destination=${encodeURIComponent(destination)}`);
    } else {
      navigate('/search');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="w-full flex flex-col bg-[#fcfbf9]">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#1a1a1a]">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070" 
            alt="India landscape" 
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Subtle gradient overlay for text readability but keeping it cinematic */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#fcfbf9]/90"></div>
        </div>
        
        <motion.div 
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 flex flex-col items-start"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={itemVariants} className="text-[#e8dbcc] tracking-[0.3em] text-sm uppercase font-medium mb-6">
            Incredible India
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] max-w-4xl">
            Discover the magic.<br />Explore Bharat.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 font-light max-w-xl mb-12 leading-relaxed">
            From the snow-capped Himalayas to the tropical beaches of Kerala. Book your perfect Indian holiday today.
          </motion.p>
          
          <motion.form variants={itemVariants} onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <div className="flex items-center border-b border-white/50 pb-3 group transition-colors focus-within:border-white">
              <Search className="w-6 h-6 text-white/70 mr-4 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-white text-xl md:text-2xl placeholder-white/50 font-serif"
                placeholder="Where will you journey?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <button 
                type="submit"
                className="ml-4 text-white hover:text-[#c29d7e] transition-colors p-2"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
      
      {/* Featured Section */}
      <div className="py-32 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-subtitle font-sans tracking-widest uppercase text-[#a97c5a] text-sm font-semibold mb-4">Curated Collection</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Iconic Destinations</h3>
          </div>
          <motion.button 
            whileHover={{ x: 5 }}
            onClick={() => navigate('/search')}
            className="flex items-center text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 uppercase tracking-widest text-xs font-semibold"
          >
            View All Journals <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CURATED_DESTINATIONS.map((dest, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  key={dest.name} 
                  className="group cursor-pointer" 
                  onClick={() => navigate(`/search?destination=${dest.name}`)}
                >
                    <div className="overflow-hidden aspect-[3/4] mb-6 relative">
                        <img 
                          src={dest.img} 
                          alt={dest.name} 
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-[#a97c5a] uppercase tracking-widest text-xs font-semibold mb-2">{dest.country}</span>
                        <h4 className="text-3xl font-serif text-[#1a1a1a]">{dest.name}</h4>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Editorial Banner */}
      <div className="w-full bg-[#1a1a1a] text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
           <h2 className="text-4xl md:text-6xl font-serif italic text-[#e8dbcc]">
             "To travel is to live."
           </h2>
           <p className="text-[#a97c5a] uppercase tracking-widest text-sm">— Hans Christian Andersen</p>
        </div>
      </div>

    </div>
  );
};
