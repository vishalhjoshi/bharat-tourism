import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTravel, setNewTravel] = useState({ title: '', destination: '', description: '', price: '', image: '', dates: '' });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, bRes, tRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/bookings'),
        axios.get('/api/travel/search')
      ]);
      setUsers(uRes.data);
      setBookings(bRes.data);
      setTravels(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTravel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedPrice = parseFloat(newTravel.price);
      const safeDates = newTravel.dates ? newTravel.dates.split(',')
        .map(d => d.trim())
        .filter(d => d && !isNaN(new Date(d).getTime()))
        .map(d => new Date(d).toISOString()) : [];

      await axios.post('/api/travel', {
        title: newTravel.title,
        destination: newTravel.destination,
        description: newTravel.description,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        images: newTravel.image ? [newTravel.image] : [],
        availableDates: safeDates
      });
      setNewTravel({ title: '', destination: '', description: '', price: '', image: '', dates: '' });
      fetchData();
      alert('Portfolio updated successfully.');
    } catch (err: any) {
      console.error("Creation error:", err);
      alert('Failed to curate new portfolio entry: ' + (err.response?.data?.message || err.message || 'Unknown error.'));
    }
  };

  const handleDeleteTravel = async (id: number) => {
    if(window.confirm('Eradicate this portfolio entry entirely?')) {
        try {
            await axios.delete(`/api/admin/travel/${id}`);
            fetchData();
        } catch(err) {
            alert('Cannot eradicate, guest itineraries remain attached.');
        }
    }
  }

  const handleUpdateBookingStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(`/api/admin/bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: newStatus } : b));
    } catch (err: any) {
      alert('Failed to update booking status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#fcfbf9]"><div className="w-10 h-10 border-2 border-[#a97c5a] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-[#1a1a1a] mb-12">Registry & Curations</h1>

        <div className="flex space-x-12 mb-16 border-b border-[#e8dbcc]">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 uppercase tracking-widest text-xs font-semibold transition-colors ${activeTab === 'bookings' ? 'text-[#a97c5a] border-b-2 border-[#a97c5a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'}`}
          >
            Itineraries ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('travels')}
            className={`pb-4 uppercase tracking-widest text-xs font-semibold transition-colors ${activeTab === 'travels' ? 'text-[#a97c5a] border-b-2 border-[#a97c5a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'}`}
          >
            Portfolio ({travels.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 uppercase tracking-widest text-xs font-semibold transition-colors ${activeTab === 'users' ? 'text-[#a97c5a] border-b-2 border-[#a97c5a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'}`}
          >
            Guests ({users.length})
          </button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {activeTab === 'bookings' && (
            <div className="border border-[#e8dbcc] bg-white overflow-hidden">
                <table className="min-w-full divide-y divide-[#e8dbcc]">
                    <thead className="bg-[#fcfbf9]">
                    <tr>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Id</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Guest</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Destination</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Value</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">State</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8dbcc] font-serif">
                    {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-[#fcfbf9]/50 transition-colors">
                        <td className="px-8 py-6 text-[#1a1a1a]">#{b.id}</td>
                        <td className="px-8 py-6 text-[#1a1a1a]">{b.user.name} <br/><span className="text-sm text-[#1a1a1a]/50 font-sans">{b.user.email}</span></td>
                        <td className="px-8 py-6 text-[#1a1a1a]">{b.travel.title}</td>
                        <td className="px-8 py-6 text-[#1a1a1a]">${b.totalPrice}</td>
                        <td className="px-8 py-6">
                            <select 
                                value={b.bookingStatus}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                className={`text-xs uppercase tracking-widest font-semibold bg-transparent cursor-pointer focus:outline-none ${b.bookingStatus === 'PENDING' ? 'text-yellow-700' : b.bookingStatus === 'CANCELLED' ? 'text-red-700' : 'text-[#a97c5a]'}`}
                            >
                                <option value="PENDING" className="text-yellow-700">PENDING</option>
                                <option value="CONFIRMED" className="text-[#a97c5a]">CONFIRMED</option>
                                <option value="CANCELLED" className="text-red-700">CANCELLED</option>
                            </select>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}

            {activeTab === 'users' && (
            <div className="border border-[#e8dbcc] bg-white overflow-hidden">
                <table className="min-w-full divide-y divide-[#e8dbcc]">
                    <thead className="bg-[#fcfbf9]">
                    <tr>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Identity</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Email</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Clearance</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-[#1a1a1a]/50 uppercase tracking-widest">Entry Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8dbcc] font-serif">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-[#fcfbf9]/50 transition-colors">
                        <td className="px-8 py-6 text-[#1a1a1a]">{u.name}</td>
                        <td className="px-8 py-6 text-[#1a1a1a]">{u.email}</td>
                        <td className="px-8 py-6">
                            <span className={`text-xs uppercase tracking-widest font-semibold ${u.role === 'ADMIN' ? 'text-[#a97c5a]' : 'text-[#1a1a1a]'}`}>{u.role}</span>
                        </td>
                        <td className="px-8 py-6 text-[#1a1a1a]">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}

            {activeTab === 'travels' && (
            <div className="space-y-16">
                <div className="bg-white p-10 md:p-16 border border-[#e8dbcc]">
                <h2 className="text-2xl font-serif text-[#1a1a1a] mb-10">Curate New Portfolio Addition</h2>
                <form onSubmit={handleCreateTravel} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Title</label>
                        <input required type="text" className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.title} onChange={e => setNewTravel({...newTravel, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Destination</label>
                        <input required type="text" className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.destination} onChange={e => setNewTravel({...newTravel, destination: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Description</label>
                        <textarea required rows={3} className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.description} onChange={e => setNewTravel({...newTravel, description: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Price Estimate ($)</label>
                        <input required type="number" step="0.01" className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.price} onChange={e => setNewTravel({...newTravel, price: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Photography Asset (URL)</label>
                        <input type="url" className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.image} onChange={e => setNewTravel({...newTravel, image: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2">Availabilities (Comma Separated)</label>
                        <input type="text" className="w-full bg-transparent border-b border-[#e8dbcc] focus:border-[#1a1a1a] transition-colors py-2 outline-none font-serif text-[#1a1a1a]" value={newTravel.dates} onChange={e => setNewTravel({...newTravel, dates: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 pt-6">
                        <button type="submit" className="bg-[#1a1a1a] text-[#fcfbf9] hover:bg-[#a97c5a] transition-colors uppercase tracking-widest text-xs font-bold py-4 px-10">Add to Portfolio</button>
                    </div>
                </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {travels.map(t => (
                        <div key={t.id} className="group border border-[#e8dbcc] bg-white flex flex-col h-full">
                            <div className="h-64 relative overflow-hidden">
                                <img src={t.images[0] || `https://source.unsplash.com/600x400/?${t.destination},travel`} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80')}/>
                            </div>
                            <div className="p-8 flex-1 flex flex-col items-center text-center">
                                <span className="uppercase tracking-widest text-xs font-semibold text-[#a97c5a] mb-2">{t.destination}</span>
                                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-6">{t.title}</h3>
                                <button onClick={() => handleDeleteTravel(t.id)} className="mt-auto uppercase tracking-widest text-xs font-semibold text-[#1a1a1a]/60 hover:text-red-700 transition-colors">Eradicate Entry</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};
