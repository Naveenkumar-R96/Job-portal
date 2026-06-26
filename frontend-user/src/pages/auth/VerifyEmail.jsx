import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/endpoints';
import { Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || '';

  const [form, setForm] = useState({ email: defaultEmail, otp: '' });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.otp) errs.otp = 'OTP is required';
    else if (form.otp.length !== 6) errs.otp = 'OTP must be 6 digits';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await authService.verifyEmail({ email: form.email, otp: form.otp });
      if (res.data.success) {
        toast.success('Email verified successfully!');
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) { toast.error('Enter your email first'); return; }
    setResending(true);
    try {
      await authService.forgotPassword({ email: form.email });
      toast.success('OTP resent to your email');
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-alt">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Verify Email</h1>
          <p className="text-text-secondary mt-2">Enter the 6-digit OTP sent to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="••••••"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 text-center text-xl font-bold tracking-[0.5rem] bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.otp && <p className="text-xs text-error">{errors.otp}</p>}
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Verify Email <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-primary font-medium hover:text-primary-dark cursor-pointer disabled:opacity-50"
              >
                {resending ? 'Resending...' : "Didn't receive OTP? Resend"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-text-secondary">
          <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
