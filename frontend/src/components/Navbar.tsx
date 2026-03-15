import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = `fixed top-0 w-full z-50 transition-all duration-500 border-b ${
    isScrolled || !isHome || mobileMenuOpen
      ? 'bg-[#fcfbf9]/95 backdrop-blur-md border-[#e8dbcc] py-4'
      : 'bg-transparent border-transparent py-6'
  }`;

  const textColorClass = isScrolled || !isHome || mobileMenuOpen ? 'text-[#1a1a1a]' : 'text-white';
  const logoColorClass = isScrolled || !isHome || mobileMenuOpen ? 'text-[#a97c5a]' : 'text-white';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="flex items-center space-x-2 group z-50">
            <span className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${logoColorClass}`}>
              B H A R A T &nbsp; T O U R I S M
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/search" className={`text-sm tracking-widest uppercase transition-colors hover:text-[#c29d7e] ${textColorClass}`}>
              Destinations
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-8">
                <Link to="/profile" className={`flex items-center space-x-2 text-sm tracking-widest uppercase transition-colors hover:text-[#c29d7e] ${textColorClass}`}>
                  <span>Profile</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className={`text-sm tracking-widest uppercase transition-colors hover:text-[#c29d7e] ${textColorClass}`}>
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className={`text-sm tracking-widest uppercase transition-colors hover:text-red-800/80 ${textColorClass}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <Link to="/login" className={`text-sm tracking-widest uppercase transition-colors hover:text-[#c29d7e] ${textColorClass}`}>
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className={`px-6 py-2.5 text-sm tracking-widest uppercase transition-all duration-300 border ${
                    isScrolled || !isHome
                      ? 'border-[#a97c5a] text-[#a97c5a] hover:bg-[#a97c5a] hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-[#1a1a1a]'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden z-50 ${textColorClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#fcfbf9] border-b border-[#e8dbcc] shadow-xl py-6 px-6 flex flex-col space-y-6"
          >
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-[#1a1a1a] hover:text-[#a97c5a]">
              Destinations
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-[#1a1a1a] hover:text-[#a97c5a]">
                  Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-[#1a1a1a] hover:text-[#a97c5a]">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-xl text-left font-serif text-[#1a1a1a] hover:text-[#a97c5a]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-[#1a1a1a] hover:text-[#a97c5a]">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-[#1a1a1a] hover:text-[#a97c5a]">
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
