import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobService } from '../../services/endpoints';
import { Search, MapPin, Filter, X, Briefcase, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { timeAgo, JOB_TYPES, JOB_CATEGORIES } from '../../utils/helpers';

const EXPERIENCE = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.category) params.category = filters.category;
      if (filters.experience) params.experience = filters.experience;

      const res = await jobService.getAllJobs(params);
      if (res.data.success) {
        setJobs(res.data.jobs || []);
        setTotalJobs(res.data.total || 0);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const applyFilters = () => {
    setFilters(tempFilters);
    setPage(1);
    const params = {};
    Object.entries(tempFilters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const empty = { search: '', location: '', jobType: '', category: '', experience: '' };
    setFilters(empty);
    setTempFilters(empty);
    setPage(1);
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Search Header */}
      <div className="bg-white border-b border-border-light sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={tempFilters.search}
                onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
              />
            </div>
            <div className="relative sm:w-44">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Location..."
                value={tempFilters.location}
                onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                activeFilterCount > 0
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={applyFilters}
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border-light animate-slide-down">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Job Type</label>
                  <select
                    value={tempFilters.jobType}
                    onChange={(e) => setTempFilters({ ...tempFilters, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="">All Types</option>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
                  <select
                    value={tempFilters.category}
                    onChange={(e) => setTempFilters({ ...tempFilters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="">All Categories</option>
                    {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Experience</label>
                  <select
                    value={tempFilters.experience}
                    onChange={(e) => setTempFilters({ ...tempFilters, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="">Any Experience</option>
                    {EXPERIENCE.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={applyFilters} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark cursor-pointer">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="px-5 py-2 border border-border text-text-secondary rounded-xl text-sm font-medium hover:border-primary hover:text-primary cursor-pointer flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {loading ? 'Searching...' : `${totalJobs.toLocaleString()} Jobs Found`}
            </h1>
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {filters.search && <Badge color="purple">{filters.search} <button onClick={() => { setFilters({ ...filters, search: '' }); setTempFilters({ ...tempFilters, search: '' }); }} className="ml-1 hover:opacity-70 cursor-pointer"><X className="w-3 h-3 inline" /></button></Badge>}
                {filters.location && <Badge color="blue">{filters.location} <button onClick={() => { setFilters({ ...filters, location: '' }); setTempFilters({ ...tempFilters, location: '' }); }} className="ml-1 hover:opacity-70 cursor-pointer"><X className="w-3 h-3 inline" /></button></Badge>}
                {filters.jobType && <Badge color="green">{filters.jobType}</Badge>}
                {filters.category && <Badge color="yellow">{filters.category}</Badge>}
              </div>
            )}
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="Try adjusting your search or filters to find more results."
            action={<button onClick={clearFilters} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold cursor-pointer">Clear Filters</button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="group bg-white rounded-2xl border border-border-light p-5 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary text-sm truncate">{job.title}</p>
                      <p className="text-text-secondary text-xs mt-0.5 truncate">{job.company?.name || job.companyName || 'Company'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted flex-shrink-0 ml-2">{timeAgo(job.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.jobType && <Badge color="purple">{job.jobType}</Badge>}
                  {job.location && (
                    <Badge color="gray">
                      <MapPin className="w-3 h-3 mr-1" />{job.location}
                    </Badge>
                  )}
                  {job.experience && <Badge color="green">{job.experience}</Badge>}
                </div>

                {job.description && (
                  <p className="text-xs text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border-light">
                  <span className="text-sm font-bold text-text-primary">
                    {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}/mo` : 'Not disclosed'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-text-secondary">Page {page}</span>
            <button
              disabled={jobs.length < 12}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
