import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService, interviewService } from '../services/endpoints';
import {
  Search, MapPin, ArrowRight, Briefcase, Users, TrendingUp,
  Bookmark, Mail, ArrowUpRight, GraduationCap, Globe, 
  UserCheck, Wrench, Palette, BarChart2, ChevronRight, PhoneCall, Code,
  DollarSign, Building2
} from 'lucide-react';
import Button from '../components/common/Button';

// Static Featured Jobs (Mocked from Screenshot 4)
const FEATURED_JOBS = [
  { title: 'Senior UX Designer', company: 'TechVision Inc', salary: 'Rs120K' },
  { title: 'Frontend Developer', company: 'WebFlow', salary: 'Rs95K' },
  { title: 'Data Scientist', company: 'Stripe', salary: 'Rs140K' }
];

// Candidates categories data (Mocked from Screenshot 5)
const CANDIDATES = [
  {
    title: 'RECENT GRADUATES',
    desc: 'Fresh talent ready to innovate with modern skills and energy.',
    badge: '90% tech-proficient',
    progress: 90,
    icon: GraduationCap,
    gradient: 'from-blue-400 via-blue-500 to-blue-600'
  },
  {
    title: 'SKILLED NEWCOMERS',
    desc: 'Global experience meets local opportunity.',
    badge: '3+ years experience',
    progress: 75,
    icon: Globe,
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600'
  },
  {
    title: 'CO-OP STUDENTS',
    desc: 'Eager learners bridging theory with practice.',
    badge: '4.0+ avg GPA',
    progress: 80,
    icon: Briefcase,
    gradient: 'from-violet-400 via-violet-500 to-violet-600'
  },
  {
    title: 'EXPERIENCED PROFESSIONALS',
    desc: 'Seasoned experts driving innovation forward.',
    badge: '10+ years experience',
    progress: 95,
    icon: Users,
    gradient: 'from-amber-400 via-amber-500 to-amber-600'
  }
];

// Mock Companies data matching Screenshot 2
const STATIC_COMPANIES = [
  { name: 'Youtube', interviews: '10 Interviews', color: 'bg-red-50 text-red-600', logoType: 'youtube' },
  { name: 'Capgemini', interviews: '10 Interviews', color: 'bg-blue-50 text-blue-600', logoType: 'capgemini' },
  { name: 'Cognizant', interviews: '10 Interviews', color: 'bg-[#E0F2FE] text-[#0369A1]', logoType: 'cognizant' },
  { name: 'Meta', interviews: '10 Interviews', color: 'bg-indigo-50 text-indigo-600', logoType: 'meta' },
  { name: 'Amazon', interviews: '10 Interviews', color: 'bg-amber-50 text-amber-700', logoType: 'amazon' },
  { name: 'Microsoft', interviews: '10 Interviews', color: 'bg-gray-50 text-gray-700', logoType: 'microsoft' },
  { name: 'Google', interviews: '10 Interviews', color: 'bg-red-50 text-blue-600', logoType: 'google' },
  { name: 'Accenture', interviews: '10 Interviews', color: 'bg-purple-50 text-purple-600', logoType: 'accenture' }
];

// Mock Roles data matching Screenshot 2
const STATIC_ROLES = [
  { name: 'Software Engineer', questions: '10 Questions', icon: Code, color: 'bg-blue-50 text-blue-600' },
  { name: 'Consultant', questions: '10 Questions', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Quality Engineer', questions: '10 Questions', icon: Wrench, color: 'bg-purple-50 text-purple-600' },
  { name: 'Sales & Marketing', questions: '10 Questions', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
  { name: 'Product Manager', questions: '10 Questions', icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Financial Analyst', questions: '10 Questions', icon: DollarSign, color: 'bg-teal-50 text-teal-600' },
  { name: 'UX Designer', questions: '10 Questions', icon: Palette, color: 'bg-pink-50 text-pink-600' },
  { name: 'Business Analyst', questions: '10 Questions', icon: BarChart2, color: 'bg-violet-50 text-violet-600' }
];

// Helper to render inline SVG custom company logos (matching Screenshot 2 logo badges)
const renderCompanyLogo = (type) => {
  switch (type) {
    case 'youtube':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
        </svg>
      );
    case 'capgemini':
      return (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#0070AD" stroke="#0070AD" />
        </svg>
      );
    case 'cognizant':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="#0033A0"/>
        </svg>
      );
    case 'meta':
      return (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 6c-1.8 0-3.4 1-4.5 2.5C10.9 7 9.3 6 7.5 6 4.5 6 2 8.5 2 11.5S4.5 17 7.5 17c1.8 0 3.4-1 4.5-2.5 1.1 1.5 2.7 2.5 4.5 2.5 3 0 5.5-2.5 5.5-5.5S19.5 6 16.5 6zm-9 9c-1.9 0-3.5-1.6-3.5-3.5S5.6 8 7.5 8c1.6 0 3 1.1 3.4 2.7-.8.5-1.5 1.1-2.1 1.9-.3-.3-.7-.6-1.3-.6zm9 0c-.6 0-1-.3-1.3-.6-.6.8-1.3 1.4-2.1 1.9.4-1.6 1.8-2.7 3.4-2.7 1.9 0 3.5 1.6 3.5 3.5S18.4 15 16.5 15z" fill="#0064E0"/>
        </svg>
      );
    case 'amazon':
      return (
        <div className="flex flex-col items-center justify-center font-black text-black select-none text-base leading-none">
          <span>a</span>
          <svg className="w-4 h-1 text-[#FF9900]" viewBox="0 0 10 3" fill="currentColor">
            <path d="M0 1c3 2 7 2 10 0L8 3H2L0 1z"/>
          </svg>
        </div>
      );
    case 'microsoft':
      return (
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5 shrink-0">
          <div className="bg-[#F25022] w-2 h-2" />
          <div className="bg-[#7FBA00] w-2 h-2" />
          <div className="bg-[#00A4EF] w-2 h-2" />
          <div className="bg-[#FFB900] w-2 h-2" />
        </div>
      );
    case 'google':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      );
    case 'accenture':
      return (
        <span className="font-extrabold text-[#A100FF] text-xl tracking-tighter">&gt;</span>
      );
    default:
      return <Building2 className="w-5 h-5" />;
  }
};

const Landing = () => {
  const navigate = useNavigate();
  
  // DB loaded items for routing mapping
  const [dbCompanies, setDbCompanies] = useState([]);
  const [dbRoles, setDbRoles] = useState([]);

  useEffect(() => {
    // Pre-fetch interview preps from DB to allow clicking cards on the home page to route to actual detail pages
    interviewService.getCompanies()
      .then(res => setDbCompanies(res.data.companies || res.data.data || []))
      .catch(() => {});
    
    interviewService.getRoles()
      .then(res => setDbRoles(res.data.roles || res.data.data || []))
      .catch(() => {});
  }, []);

  const handleCompanyClick = (companyName) => {
    const matched = dbCompanies.find(c => c.name?.toLowerCase() === companyName.toLowerCase());
    if (matched) {
      navigate(`/interview/company/${matched._id}`);
    } else {
      navigate(`/interview?tab=companies`);
    }
  };

  const handleRoleClick = (roleName) => {
    const matched = dbRoles.find(r => (r.name || r.title)?.toLowerCase() === roleName.toLowerCase());
    if (matched) {
      navigate(`/interview/role/${matched._id}`);
    } else {
      navigate(`/interview?tab=roles`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section (Screenshot 4) */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-white">
        {/* Soft background blue node grid glow */}
        <div className="absolute inset-0 bg-[#F4F8FA]/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-50/45 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-blue-50/70 border border-blue-100 text-primary text-xs font-semibold rounded-full shadow-sm shadow-blue-500/5">
                <span className="text-sm">🔑</span> 10,000+ Jobs Available Now
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black text-[#1E293B] leading-[1.05] tracking-tight">
                Find Your<br />
                <span className="text-primary">Dream Job</span>
              </h1>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
                Join <strong className="font-bold text-text-primary">50,000+</strong> professionals who found their perfect career match through our advanced AI-powered job portal.
              </p>
            </div>

            {/* Right Featured Jobs Card Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[420px] bg-white rounded-[32px] border border-gray-200/90 shadow-xl shadow-blue-500/5 p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Featured Jobs</h3>
                    <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider">Updated daily</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {FEATURED_JOBS.map((job, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate('/jobs')}
                      className="group bg-white hover:bg-blue-50/30 rounded-2xl border border-gray-150/80 p-4.5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">{job.title}</h4>
                        <p className="text-text-secondary text-xs font-semibold">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-text-primary">{job.salary}</span>
                        <p className="text-text-muted text-[10px] font-semibold">per year</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Our Candidates Section (Screenshot 5) */}
      <section className="py-20 bg-white border-t border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 relative w-fit mx-auto select-none">
            {/* Glowing background blur accent behind text */}
            <div className="absolute inset-0 w-44 h-10 bg-blue-300/35 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <h2 className="text-[38px] font-black text-text-primary tracking-tight relative z-10 leading-none">
              Our <span className="text-primary">Candidates</span>
            </h2>
            <p className="text-text-secondary text-sm font-medium mt-4 relative z-10 max-w-md mx-auto">
              Discover exceptional talent across four dynamic categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CANDIDATES.map((cand, idx) => {
              const Icon = cand.icon;
              return (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-b ${cand.gradient} rounded-[32px] p-7 text-white shadow-lg flex flex-col justify-between h-[360px] hover:-translate-y-1 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer`}
                  onClick={() => navigate('/jobs')}
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 bg-white/15 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">{cand.title}</h3>
                    <p className="text-white/80 text-xs leading-relaxed font-semibold">{cand.desc}</p>
                  </div>

                  {/* Horizontal Progress bar pill overlay */}
                  <div className="bg-white/15 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px]">⭐</span> {cand.badge}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500" 
                        style={{ width: `${cand.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Featured Companies Section (Screenshot 3) */}
      <section className="py-20 bg-[#F4F8FA]/40 border-t border-b border-gray-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Recruitment pill bubble button */}
          <div className="text-center mb-8">
            <Link to="/contact">
              <button className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
                <span className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center"><Mail className="w-3 h-3 text-white" /></span>
                <span>Contact Recruitment Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-[34px] font-black text-text-primary tracking-tight">
              Join Our <span className="text-primary">Featured</span> Companies
            </h2>
            <p className="text-text-secondary text-sm font-semibold mt-3 max-w-2xl mx-auto">
              Discover exciting career opportunities with industry leaders who are actively hiring. Your next role awaits!
            </p>
          </div>

          {/* Styled logos strip row */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 opacity-65 grayscale hover:opacity-85 transition-opacity duration-300 py-4 max-w-5xl mx-auto">
            {['Microsoft', 'Google', 'Cognizant', 'Samsung'].map((name, i) => (
              <span key={i} className="text-2xl font-black text-text-muted tracking-tight flex items-center gap-2 select-none hover:text-text-primary transition-colors cursor-default">
                {name === 'Microsoft' && (
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-gray-400 w-1.5 h-1.5" />
                    <div className="bg-gray-400 w-1.5 h-1.5" />
                    <div className="bg-gray-400 w-1.5 h-1.5" />
                    <div className="bg-gray-400 w-1.5 h-1.5" />
                  </div>
                )}
                {name}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Interview Prep Section (Screenshot 2) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column: Interview questions by Company */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  Interview questions by Company
                </h3>
                <Link to="/interview?tab=companies" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                  View all companies <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STATIC_COMPANIES.map((company, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleCompanyClick(company.name)}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 ${company.color} rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200`}>
                        {renderCompanyLogo(company.logoType)}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm leading-snug">{company.name}</h4>
                        <p className="text-text-muted text-[10px] font-semibold mt-0.5">{company.interviews}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interview questions by Role */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  Interview questions by Role
                </h3>
                <Link to="/interview?tab=roles" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                  View all roles <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STATIC_ROLES.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleRoleClick(role.name)}
                      className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 ${role.color} rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary text-sm leading-snug">{role.name}</h4>
                          <p className="text-text-muted text-[10px] font-semibold mt-0.5">{role.questions}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default Landing;
