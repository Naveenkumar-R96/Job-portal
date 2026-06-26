import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService, applicationService, savedService } from '../../services/endpoints';
import { useAuth } from '../../hooks/useAuth';
import {
  Briefcase, MapPin, Clock, DollarSign, Users, Calendar,
  Bookmark, BookmarkCheck, ArrowLeft, CheckCircle, Share2, Building2
} from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDate, timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        if (res.data.success) {
          setJob(res.data.job);
          setApplied(res.data.applied || false);
          setSaved(res.data.saved || false);
        }
      } catch {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setApplying(true);
    try {
      const res = await applicationService.applyJob(id);
      if (res.data.success) {
        setApplied(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(res.data.message || 'Failed to apply');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSavingToggle(true);
    try {
      const res = await savedService.toggleSaveJob(id);
      if (res.data.success) {
        setSaved(res.data.saved);
        toast.success(res.data.saved ? 'Job saved!' : 'Job removed from saved');
      }
    } catch {
      toast.error('Failed to save job');
    } finally {
      setSavingToggle(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <Spinner />;
  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary mb-2">Job not found</h2>
        <Link to="/jobs"><Button>Back to Jobs</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-text-primary">{job.title}</h1>
                  <p className="text-text-secondary font-medium mt-1">{job.company?.name || job.companyName || 'Company'}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.location && (
                      <span className="flex items-center gap-1 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 text-primary" /> {job.location}
                      </span>
                    )}
                    {job.jobType && <Badge color="purple">{job.jobType}</Badge>}
                    {job.experience && <Badge color="green">{job.experience}</Badge>}
                    {job.category && <Badge color="blue">{job.category}</Badge>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border-light">
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-text-muted">Salary</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}/mo` : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <Briefcase className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-text-muted">Job Type</p>
                  <p className="text-sm font-semibold text-text-primary">{job.jobType || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-text-muted">Experience</p>
                  <p className="text-sm font-semibold text-text-primary">{job.experience || 'Any'}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-text-muted">Posted</p>
                  <p className="text-sm font-semibold text-text-primary">{timeAgo(job.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-text-primary mb-4">Job Description</h2>
              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {job.description || 'No description provided.'}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-text-primary mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {(Array.isArray(job.requirements) ? job.requirements : job.requirements.split('\n').filter(Boolean)).map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-text-primary mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(job.skills) ? job.skills : job.skills.split(',').map(s => s.trim())).map((skill, i) => (
                    <Badge key={i} color="purple">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply card */}
            <div className="bg-white rounded-2xl border border-border-light p-5 sticky top-24 animate-fade-in">
              <h3 className="text-base font-bold text-text-primary mb-4">Apply Now</h3>

              {applied ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-semibold text-text-primary">Application Submitted</p>
                  <p className="text-sm text-text-secondary mt-1">Good luck!</p>
                </div>
              ) : (
                <Button className="w-full" loading={applying} onClick={handleApply}>
                  Apply for this Job
                </Button>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSave}
                  disabled={savingToggle}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    saved
                      ? 'border-primary bg-primary-50 text-primary'
                      : 'border-border text-text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {!isAuthenticated && (
                <p className="text-xs text-text-muted text-center mt-3">
                  <Link to="/login" className="text-primary font-semibold">Login</Link> to apply or save this job
                </p>
              )}
            </div>

            {/* Deadline */}
            {job.applicationDeadline && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Application Deadline</p>
                <p className="font-bold text-amber-800">{formatDate(job.applicationDeadline)}</p>
              </div>
            )}

            {/* Total applicants */}
            {job.applicationsCount !== undefined && (
              <div className="bg-white rounded-2xl border border-border-light p-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">{job.applicationsCount} applicants</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
