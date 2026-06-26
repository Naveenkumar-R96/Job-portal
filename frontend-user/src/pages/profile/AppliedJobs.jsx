import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/endpoints';
import { Briefcase, MapPin, Clock, ChevronRight, FileText } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';

const STATUS_COLORS = {
  pending: 'yellow',
  reviewed: 'blue',
  shortlisted: 'purple',
  rejected: 'red',
  hired: 'green',
};

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getUserApplications()
      .then((res) => {
        if (res.data.success) setApplications(res.data.applications || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-text-primary">Applied Jobs</h1>
          <p className="text-text-secondary mt-1">Track all your job applications in one place</p>
        </div>

        {/* Stats */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {['pending', 'reviewed', 'shortlisted', 'hired'].map((s) => {
              const count = applications.filter(a => a.status === s).length;
              return (
                <div key={s} className="bg-white rounded-2xl border border-border-light p-4 text-center">
                  <div className="text-2xl font-black text-text-primary">{count}</div>
                  <div className="text-xs text-text-secondary capitalize mt-1">{s}</div>
                </div>
              );
            })}
          </div>
        )}

        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Start applying to jobs and your application history will appear here."
            action={<Link to="/jobs" className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold">Browse Jobs</Link>}
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-border-light p-5 hover:shadow-md transition-all duration-200 animate-fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{app.job?.title || 'Job Title'}</h3>
                      <p className="text-text-secondary text-sm mt-0.5">{app.job?.company?.name || app.job?.companyName || 'Company'}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {app.job?.location && (
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <MapPin className="w-3 h-3" /> {app.job.location}
                          </span>
                        )}
                        {app.job?.jobType && (
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <Clock className="w-3 h-3" /> {app.job.jobType}
                          </span>
                        )}
                        <span className="text-xs text-text-muted">Applied {formatDate(app.appliedAt || app.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge color={STATUS_COLORS[app.status] || 'gray'} className="capitalize">
                      {app.status}
                    </Badge>
                    <Link to={`/jobs/${app.job?._id}`} className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-dark">
                      View Job <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
