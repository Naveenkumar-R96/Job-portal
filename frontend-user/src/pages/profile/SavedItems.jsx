import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedService } from '../../services/endpoints';
import { Briefcase, MapPin, Bookmark, Trash2, BookOpen } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const SavedItems = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('jobs');

  useEffect(() => {
    savedService.getSavedItems()
      .then((res) => {
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await savedService.toggleSaveJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to remove job');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-text-primary">Saved Items</h1>
          <p className="text-text-secondary mt-1">Jobs and questions you've bookmarked</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border-light mb-6 w-fit">
          {['jobs', 'questions'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize cursor-pointer ${
                tab === t ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'jobs' ? `Jobs (${savedJobs.length})` : 'Questions'}
            </button>
          ))}
        </div>

        {tab === 'jobs' && (
          savedJobs.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved jobs"
              description="Browse jobs and click the bookmark icon to save them here."
              action={<Link to="/jobs" className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold">Browse Jobs</Link>}
            />
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl border border-border-light p-5 hover:shadow-md transition-all duration-200 animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <Link to={`/jobs/${job._id}`} className="flex items-start gap-4 flex-1 group">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-text-secondary text-sm mt-0.5">{job.company?.name || job.companyName || 'Company'}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {job.location && (
                            <span className="flex items-center gap-1 text-xs text-text-muted">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          )}
                          {job.jobType && <Badge color="purple">{job.jobType}</Badge>}
                          {job.salary && (
                            <span className="text-xs font-semibold text-text-primary">
                              ₹{Number(job.salary).toLocaleString('en-IN')}/mo
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleUnsaveJob(job._id)}
                      className="p-2 rounded-xl text-error hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'questions' && (
          <EmptyState
            icon={BookOpen}
            title="No saved questions"
            description="Browse interview questions and save ones you want to revisit."
            action={<Link to="/interview" className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold">Browse Questions</Link>}
          />
        )}
      </div>
    </div>
  );
};

export default SavedItems;
