import { Link } from 'react-router-dom';
import { Briefcase, Mail, MapPin, Phone, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F4F8FA] text-[#1E293B] border-t border-gray-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-primary leading-none tracking-tight">JobPortal</span>
                <span className="text-[10px] text-text-secondary font-medium tracking-wide mt-0.5">Find Your Dream Job</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Connecting talented professionals with top companies worldwide. Your career journey starts here.
            </p>
            {/* Social Icons (using inline SVGs for compatibility) */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  ), 
                  href: 'https://linkedin.com' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  ), 
                  href: 'https://twitter.com' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  ), 
                  href: 'https://facebook.com' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ), 
                  href: 'https://instagram.com' 
                }
              ].map((social, idx) => {
                return (
                  <a 
                    key={idx} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors duration-200"
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wide text-text-primary border-b-2 border-primary w-fit pb-1 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/jobs" className="text-text-secondary text-sm hover:text-primary transition-colors">Find Jobs</Link></li>
              <li><Link to="/interview?tab=companies" className="text-text-secondary text-sm hover:text-primary transition-colors">Companies</Link></li>
              <li><Link to="/interview?tab=roles" className="text-text-secondary text-sm hover:text-primary transition-colors">Roles</Link></li>
              <li><Link to="/saved" className="text-text-secondary text-sm hover:text-primary transition-colors">Saved</Link></li>
              <li><Link to="/contact" className="text-text-secondary text-sm hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold text-sm tracking-wide text-text-primary border-b-2 border-primary w-fit pb-1 mb-5">For Employers</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Recruitment Solutions</a></li>
              <li><a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Employer Dashboard</a></li>
              <li><a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Employer Branding</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-sm tracking-wide text-text-primary border-b-2 border-primary w-fit pb-1 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@jobportal.com</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-[#555] text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">123 Career Street, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Scroll to Top */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1" />
          
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <div className="w-4 h-4 bg-primary rotate-45 flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span>Designed by <strong className="text-text-primary font-bold">Hexagon Digital Services</strong></span>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-md shadow-primary/20 cursor-pointer hover:-translate-y-0.5 duration-200"
              title="Scroll to Top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
