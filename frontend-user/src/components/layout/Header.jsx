import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Menu, X, User, LogOut, Bookmark, FileText, Briefcase,
  Home, Search, Building2, UserCheck, PhoneCall, ChevronDown 
} from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'Jobs', icon: Search },
    { to: '/interview?tab=companies', label: 'Companies', icon: Building2 },
    { to: '/interview?tab=roles', label: 'Roles', icon: UserCheck },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const isLinkActive = (linkTo) => {
    const path = linkTo.split('?')[0];
    if (path === '/') {
      return location.pathname === '/';
    }
    const isActiveTab = location.pathname.startsWith(path);
    if (isActiveTab && linkTo.includes('tab=')) {
      const currentTab = new URLSearchParams(location.search).get('tab');
      const targetTab = new URLSearchParams(linkTo.split('?')[1]).get('tab');
      return currentTab === targetTab;
    }
    return isActiveTab;
  };

  const displayName = user?.name || 'Naveenkumar M';
  const displayInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'NM';

  return (
    <header className="sticky top-0 z-40 glass border-b border-border-light shadow-sm shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md shadow-primary/10">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-primary leading-none tracking-tight">
                JobPortal
              </span>
              <span className="text-[10px] text-text-secondary font-medium tracking-wide mt-0.5">
                Find your dream job
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    active
                      ? 'text-primary bg-primary-50'
                      : 'text-text-secondary hover:text-primary hover:bg-primary-50/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth/User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-primary-50/40 transition-all duration-300 cursor-pointer"
              >
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-primary/10 shrink-0">
                  {displayInitials}
                </div>
                <span className="text-[11px] font-extrabold text-text-primary uppercase tracking-wider">
                  {displayName}
                </span>
                <ChevronDown className="w-4.5 h-4.5 text-text-secondary" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border-light py-2 animate-slide-down z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-border-light">
                        <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-secondary">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/applied-jobs" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors">
                        <FileText className="w-4 h-4" /> Applied Jobs
                      </Link>
                      <Link to="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors">
                        <Bookmark className="w-4 h-4" /> Saved Items
                      </Link>
                      <div className="border-t border-border-light mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-red-50 w-full cursor-pointer transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary transition-colors">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary transition-colors">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-light bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    active ? 'text-primary bg-primary-50' : 'text-text-secondary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border-light pt-3 mt-3 space-y-2">
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50"><User className="w-4 h-4" /> Profile</Link>
              <Link to="/applied-jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50"><FileText className="w-4 h-4" /> Applied Jobs</Link>
              <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50"><Bookmark className="w-4 h-4" /> Saved Items</Link>
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50 cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="secondary" className="w-full">Sign In</Button></Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}><Button className="w-full">Get Started</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
