import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const TravelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [travel, setTravel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const res = await axios.get(`/api/travel/${id}`);
        setTravel(res.data);
        if (res.data.availableDates?.length > 0) {
          setSelectedDate(res.data.availableDates[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedDate) {
      setMessage('Please select a date');
      return;
    }
    setBookingLoading(true);
    setMessage('');
    try {
      await axios.post('/api/bookings/create', {
        travelId: parseInt(id as string),
        travelDate: selectedDate,
        travelers
      });
      setMessage('Booking successful. Preparing your itinerary...');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#fcfbf9]"><div className="w-10 h-10 border-2 border-[#a97c5a] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!travel) {
    return <div className="min-h-screen flex justify-center items-center text-2xl font-serif text-[#1a1a1a] bg-[#fcfbf9]">Journey not found</div>;
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Full-bleed Hero Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[60vh] md:h-[70vh] relative"
      >
        <img 
          src={travel.images?.[0] || `https://source.unsplash.com/1600x900/?${travel.destination},travel`} 
          alt={travel.title} 
          className="w-full h-full object-cover" 
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')} 
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-24 left-6 lg:left-12 flex items-center text-white hover:text-[#e8dbcc] transition-colors uppercase tracking-widest text-xs font-semibold z-10 mix-blend-difference"
        >
            <ChevronLeft className="w-4 h-4 mr-2" /> Return
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-10 pb-32">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-2/3 bg-[#fcfbf9] p-8 md:p-16 border border-[#e8dbcc] shadow-2xl"
          >
            <div className="border-b border-[#e8dbcc] pb-10 mb-10">
               <span className="uppercase tracking-widest text-[#a97c5a] text-sm font-semibold flex items-center mb-4"><MapPin className="w-4 h-4 mr-2" /> {travel.destination}</span>
               <h1 className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight mb-8">{travel.title}</h1>
               <div className="prose prose-lg prose-slate text-[#1a1a1a]/80 font-light leading-relaxed max-w-none">
                 <p>{travel.description || 'Embark on an elevated journey tailored for those who demand the finest in global exploration. Witness culture, architecture, and luxury intertwined perfectly into a singular experience.'}</p>
                 <br/>
                 <h3 className="font-serif text-2xl text-[#1a1a1a] mb-4">The Experience</h3>
                 <p>Every detail has been meticulously sourced to provide an unparalleled adventure. From private transfers to exclusive access at highly sought-after locations, this journey redefines modern luxury travel.</p>
               </div>
            </div>

            <div>
              <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">Signature Inclusions</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[#1a1a1a]/80">
                {[
                  'Bespoke Accommodations',
                  'Private Guided Tours',
                  'Culinary Excellence Daily',
                  'Chauffeur Airport Transfers',
                  'Dedicated Concierge',
                  'Curated VIP Access'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-sm uppercase tracking-wider font-medium">
                    <span className="w-1.5 h-1.5 bg-[#a97c5a] mr-4"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Booking Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full lg:w-1/3"
          >
            <div className="bg-[#1a1a1a] text-[#fcfbf9] p-10 lg:sticky top-32">
              <div className="border-b border-white/20 pb-8 mb-8">
                <span className="block text-[#a97c5a] uppercase tracking-widest text-xs font-semibold mb-2">Reserve your place</span>
                <div className="flex items-end">
                  <span className="text-5xl font-serif">${travel.price}</span>
                  <span className="text-white/50 ml-2 mb-1 text-sm uppercase tracking-widest">/ guest</span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/70 mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Select Date</label>
                  <select 
                    className="w-full bg-transparent border-b border-white/30 pb-3 outline-none text-white focus:border-[#a97c5a] transition-colors font-serif appearance-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="" className="text-black">Choose a date</option>
                    {travel.availableDates?.map((d: string, i: number) => (
                      <option key={i} value={d} className="text-black">{new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</option>
                    ))}
                    <option value={new Date().toISOString()} className="text-black">Open Ticket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/70 mb-3 flex items-center"><Users className="w-4 h-4 mr-2" /> Guests</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    className="w-full bg-transparent border-b border-white/30 pb-3 outline-none text-white focus:border-[#a97c5a] transition-colors font-serif"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                  />
                </div>
                
                <div className="pt-6 flex justify-between items-end font-serif">
                    <span className="text-white/70">Total Investment</span>
                    <span className="text-3xl">${(travel.price * travelers).toLocaleString()}</span>
                </div>
              </div>

              {message && (
                <div className={`p-4 mb-6 text-sm border-l-2 ${message.includes('successful') ? 'bg-[#fcfbf9]/10 border-[#a97c5a] text-white' : 'bg-red-900/30 border-red-500 text-red-200'}`}>
                  {message}
                </div>
              )}

              <button 
                onClick={handleBook}
                disabled={bookingLoading}
                className="w-full bg-[#fcfbf9] text-[#1a1a1a] hover:bg-[#a97c5a] hover:text-white uppercase tracking-widest text-sm font-bold py-5 transition-colors duration-300 disabled:opacity-50"
              >
                {bookingLoading ? 'Requesting...' : 'Confirm Availability'}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
