import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Clock, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if(window.confirm('Retract this distinguished reservation?')) {
        try {
          await axios.put(`/api/bookings/cancel/${id}`);
          setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: 'CANCELLED' } : b));
        } catch (err) {
          alert('Failed to retract booking');
        }
    }
  };

  if (!user) return <div className="p-32 text-center text-[#1a1a1a] font-serif text-2xl">Authentication required to view itinerary.</div>;

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center md:items-start md:flex-row gap-10 mb-20 border-b border-[#e8dbcc] pb-16"
        >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#1a1a1a] text-white flex items-center justify-center text-5xl font-serif">
                {user.name.charAt(0)}
            </div>
            <div className="text-center md:text-left pt-2">
                <h1 className="text-sm tracking-widest uppercase text-[#a97c5a] font-semibold mb-2">Member Profile</h1>
                <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-2">{user.name}</h2>
                <p className="text-[#1a1a1a]/60 italic font-serif text-lg">{user.email}</p>
            </div>
        </motion.div>

        {/* Bookings */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-serif text-[#1a1a1a] mb-10">Your Itineraries</h2>
          
          {loading ? (
             <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-[#a97c5a] border-t-transparent rounded-full animate-spin"></div></div>
          ) : bookings.length === 0 ? (
            <div className="border border-[#e8dbcc] p-16 text-center text-[#1a1a1a]">
                <h3 className="text-2xl font-serif mb-4">The map remains blank.</h3>
                <p className="text-[#1a1a1a]/60 uppercase tracking-widest text-xs font-semibold">Commence your journey through our curated destinations.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {bookings.map(booking => (
                <div key={booking.id} className="group flex flex-col md:flex-row border border-[#e8dbcc] hover:border-[#a97c5a] transition-colors duration-500 bg-white">
                  <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-auto md:h-64 relative overflow-hidden">
                      <img src={booking.travel.images?.[0] || `https://source.unsplash.com/600x400/?${booking.travel.destination},travel`} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80')}/>
                  </div>
                  
                  <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs uppercase tracking-widest font-semibold text-[#a97c5a] flex items-center">
                              {booking.bookingStatus === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                              {booking.bookingStatus === 'CANCELLED' && <X className="w-3 h-3 mr-1" />}
                              {booking.bookingStatus === 'CONFIRMED' && <CheckCircle className="w-3 h-3 mr-1 text-[#a97c5a]" />}
                              {booking.bookingStatus === 'CONFIRMED' ? 'RESERVATION CONFIRMED' : booking.bookingStatus}
                            </span>
                            <span className="font-serif text-xl border-b border-[#1a1a1a]">${booking.totalPrice}</span>
                        </div>
                        <h3 className="text-3xl font-serif text-[#1a1a1a] mb-4">{booking.travel.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-[#1a1a1a]/80 mb-6 font-serif">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {booking.travel.destination}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(booking.travelDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                            <span className="flex items-center col-span-2">{booking.travelers} Expected {booking.travelers > 1 ? 'Guests' : 'Guest'}</span>
                        </div>
                    </div>
                    
                    {booking.bookingStatus === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="self-start text-xs uppercase tracking-widest font-semibold text-[#1a1a1a] hover:text-red-700 transition-colors border-b border-transparent hover:border-red-700 pb-1"
                      >
                        Retract Reservation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
