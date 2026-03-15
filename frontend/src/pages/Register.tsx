import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbf9]">
      <div className="hidden lg:block w-1/2 relative bg-[#1a1a1a]">
        <img 
          src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070" 
          alt="Luxury Resort" 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-4xl font-serif text-white mb-4 leading-tight">"A beautiful holiday awaits."</h2>
          <p className="uppercase tracking-widest text-[#a97c5a] text-xs font-semibold">— Bharat Tourism</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <span className="uppercase tracking-widest text-[#a97c5a] text-xs font-semibold mb-3 block">Sign Up</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Create an account.</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 border-l-2 border-red-500 mb-8 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2" htmlFor="name">Full Name</label>
              <div className="relative border-b border-[#e8dbcc] focus-within:border-[#1a1a1a] transition-colors pb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mb-2">
                  <User className="h-4 w-4 text-[#1a1a1a]/40" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full pl-8 py-1 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] font-serif text-lg"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2" htmlFor="email">Email Address</label>
              <div className="relative border-b border-[#e8dbcc] focus-within:border-[#1a1a1a] transition-colors pb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mb-2">
                  <Mail className="h-4 w-4 text-[#1a1a1a]/40" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-8 py-1 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] font-serif text-lg"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2" htmlFor="phone">Phone <span className="lowercase italic normal-case text-[#1a1a1a]/40">(optional)</span></label>
              <div className="relative border-b border-[#e8dbcc] focus-within:border-[#1a1a1a] transition-colors pb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mb-2">
                  <Phone className="h-4 w-4 text-[#1a1a1a]/40" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className="w-full pl-8 py-1 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] font-serif text-lg"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold mb-2" htmlFor="password">Password</label>
              <div className="relative border-b border-[#e8dbcc] focus-within:border-[#1a1a1a] transition-colors pb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mb-2">
                  <Lock className="h-4 w-4 text-[#1a1a1a]/40" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-8 py-1 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] font-serif text-lg"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-5 mt-8 text-[#fcfbf9] bg-[#1a1a1a] hover:bg-[#a97c5a] uppercase tracking-widest text-xs font-bold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse tracking-widest">Processing...</span>
              ) : (
                <>
                  Register <ArrowRight className="w-4 h-4 ml-3" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#e8dbcc]">
            <span className="text-[#1a1a1a]/60 text-sm">Already a member? </span>
            <Link to="/login" className="font-serif italic text-[#a97c5a] hover:text-[#1a1a1a] transition-colors">
              Access your account.
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
