import { useState, useEffect, useRef } from 'react';
import { userService } from '../../services/endpoints';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Phone, MapPin, Upload, Save, FileText, ExternalLink } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef(null);
  const resumeRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: '',
    linkedIn: '',
    github: '',
    portfolio: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [existingResume, setExistingResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.data.success) {
          const u = res.data.user;
          setForm({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            address: u.address || '',
            bio: u.bio || '',
            skills: Array.isArray(u.skills) ? u.skills.join(', ') : (u.skills || ''),
            linkedIn: u.linkedIn || '',
            github: u.github || '',
            portfolio: u.portfolio || '',
          });
          if (u.profilePhoto) setPhotoPreview(u.profilePhoto);
          if (u.resume) setExistingResume(u.resume);
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResume(file);
    setResumeName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (photo) formData.append('profilePhoto', photo);
      if (resume) formData.append('resume', resume);

      const res = await userService.updateProfile(formData);
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        await refreshProfile();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-text-primary">My Profile</h1>
          <p className="text-text-secondary mt-1">Keep your profile up to date to attract recruiters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo & Basic Info */}
          <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
            <h2 className="text-base font-bold text-text-primary mb-5">Basic Information</h2>
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-2xl bg-primary-50 border-2 border-dashed border-primary/30 overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-primary/40" />
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" icon={User} placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Phone" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Location" icon={MapPin} placeholder="Chennai, India" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Bio</label>
              <textarea
                rows={3}
                placeholder="Tell recruiters about yourself..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
            <h2 className="text-base font-bold text-text-primary mb-5">Skills</h2>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Skills (comma separated)</label>
              <input
                type="text"
                placeholder="React, Node.js, Python, SQL..."
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {form.skills && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-50 text-primary text-xs font-medium rounded-lg">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
            <h2 className="text-base font-bold text-text-primary mb-5">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="LinkedIn" placeholder="linkedin.com/in/yourname" value={form.linkedIn} onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} />
              <Input label="GitHub" placeholder="github.com/yourname" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              <Input label="Portfolio" placeholder="yourportfolio.com" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-border-light p-6 animate-fade-in">
            <h2 className="text-base font-bold text-text-primary mb-5">Resume</h2>
            <div className="flex items-center gap-4 flex-wrap">
              {existingResume && (
                <a
                  href={existingResume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  <FileText className="w-4 h-4" /> View Current Resume <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
              <button
                type="button"
                onClick={() => resumeRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-primary/30 text-primary rounded-xl text-sm font-medium hover:border-primary hover:bg-primary-50 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" /> {resumeName || 'Upload New Resume'}
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={loading} size="lg">
              <Save className="w-4 h-4" /> Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
