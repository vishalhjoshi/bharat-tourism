import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const destinationParam = searchParams.get('destination') || '';

  const [destination, setDestination] = useState(destinationParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchTravels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (destination) params.append('destination', destination);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const res = await axios.get(`/api/travel/search?${params.toString()}`);
      setTravels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (destination) params.destination = destination;
    setSearchParams(params);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16 border-b border-[#e8dbcc] pb-12 text-center md:text-left">
          <h1 className="text-sm tracking-widest uppercase text-[#a97c5a] font-semibold mb-4">Discover Destinations</h1>
          <h2 className="text-5xl md:text-6xl font-serif text-[#1a1a1a]">Curated Journeys</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-32">
              <h3 className="text-2xl font-serif text-[#1a1a1a] mb-8">Refine Search</h3>
              <form onSubmit={handleSearch} className="space-y-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#a97c5a] font-medium mb-3">Location</label>
                  <div className="relative border-b border-[#1a1a1a] pb-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mb-2">
                        <MapPin className="h-4 w-4 text-[#1a1a1a]" />
                      </div>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-8 py-1 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] font-serif text-lg placeholder-[#1a1a1a]/40"
                        placeholder="E.g. Paris"
                      />
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-widest text-[#a97c5a] font-medium mb-3">Min Price</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full py-2 border-b border-[#e8dbcc] bg-transparent focus:border-[#1a1a1a] transition-colors outline-none text-[#1a1a1a] font-serif"
                      placeholder="$"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-widest text-[#a97c5a] font-medium mb-3">Max Price</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full py-2 border-b border-[#e8dbcc] bg-transparent focus:border-[#1a1a1a] transition-colors outline-none text-[#1a1a1a] font-serif"
                      placeholder="$"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fcfbf9] uppercase tracking-widest text-xs font-semibold py-4 transition-colors duration-300 flex items-center justify-center">
                  <SearchIcon className="w-4 h-4 mr-2" /> Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Results Grid */}
          <div className="w-full lg:w-3/4">
             {loading ? (
                <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-2 border-[#a97c5a] border-t-transparent rounded-full animate-spin"></div></div>
             ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10"
                >
                    {travels.length === 0 ? (
                        <div className="col-span-full py-24 text-center border border-[#e8dbcc]">
                            <h3 className="text-2xl font-serif text-[#1a1a1a] mb-2">No journeys found</h3>
                            <p className="text-[#1a1a1a]/60 font-light">Refine your criteria to explore other available destinations.</p>
                        </div>
                    ) : (
                        travels.map(t => (
                            <motion.div variants={itemVariants} key={t.id}>
                                <Link to={`/travel/${t.id}`} className="group block h-full flex flex-col">
                                    <div className="relative overflow-hidden aspect-[4/3] mb-6">
                                        <img 
                                          src={t.images[0] || `https://source.unsplash.com/800x600/?${t.destination},travel`} 
                                          alt={t.title} 
                                          className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
                                          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80')}
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-2xl font-serif text-[#1a1a1a] group-hover:text-[#a97c5a] transition-colors line-clamp-2 pr-4">{t.title}</h3>
                                            <span className="text-lg font-serif text-[#1a1a1a]">${t.price}</span>
                                        </div>
                                        <p className="uppercase tracking-widest text-[#1a1a1a]/50 text-xs font-semibold">{t.destination}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>
             )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
