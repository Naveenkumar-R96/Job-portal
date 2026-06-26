import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { interviewService } from '../../services/endpoints';
import { Building2, ChevronRight, Users, Search, BookOpen } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'companies';
  
  const [tab, setTab] = useState(initialTab);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const currentTab = new URLSearchParams(location.search).get('tab') || 'companies';
    setTab(currentTab);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tab === 'companies') {
          const res = await interviewService.getCompanies();
          setCompanies(res.data.companies || res.data.data || []);
        } else {
          const res = await interviewService.getRoles();
          setRoles(res.data.roles || res.data.data || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const filteredCompanies = companies.filter(c =>
    c.name?.toLowerCase().includes(searchQ.toLowerCase())
  );
  const filteredRoles = roles.filter(r =>
    r.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.title?.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary text-sm font-semibold rounded-full mb-4">
            <BookOpen className="w-4 h-4" /> Interview Preparation
          </span>
          <h1 className="text-4xl font-black text-text-primary">
            Ace Your Next Interview
          </h1>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Browse company-specific and role-specific interview questions curated by our community.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border-light mb-6 w-fit mx-auto">
          {['companies', 'roles'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearchQ(''); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all capitalize cursor-pointer ${
                tab === t ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'companies' ? (
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> By Company</span>
              ) : (
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> By Role</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${tab}...`}
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
          />
        </div>

        {loading ? (
          <Spinner />
        ) : tab === 'companies' ? (
          filteredCompanies.length === 0 ? (
            <EmptyState icon={Building2} title="No companies found" description="Check back later for interview preparation content." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCompanies.map((company) => (
                <button
                  key={company._id}
                  onClick={() => navigate(`/interview/company/${company._id}`)}
                  className="bg-white rounded-2xl border border-border-light p-5 text-left hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-primary group-hover:text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{company.name}</h3>
                      {company.industry && <p className="text-xs text-text-secondary mt-0.5">{company.industry}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{company.questionsCount || 0} questions</span>
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          filteredRoles.length === 0 ? (
            <EmptyState icon={Users} title="No roles found" description="Check back later for role-specific interview content." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRoles.map((role) => (
                <button
                  key={role._id}
                  onClick={() => navigate(`/interview/role/${role._id}`)}
                  className="bg-white rounded-2xl border border-border-light p-5 text-left hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all">
                      <Users className="w-6 h-6 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{role.name || role.title}</h3>
                      {role.category && <p className="text-xs text-text-secondary mt-0.5">{role.category}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{role.questionsCount || 0} questions</span>
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Interview;
