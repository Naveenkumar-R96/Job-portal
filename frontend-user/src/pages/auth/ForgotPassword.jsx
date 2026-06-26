import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/endpoints';
import { Mail, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email });
      if (res.data.success) {
        setSent(true);
        toast.success('Reset OTP sent to your email');
      } else {
        toast.error(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-alt">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Forgot Password</h1>
          <p className="text-text-secondary mt-2">Enter your email and we'll send you a reset OTP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">OTP Sent!</h3>
              <p className="text-sm text-text-secondary">
                We've sent a password reset OTP to <strong>{email}</strong>. Check your inbox.
              </p>
              <Link to="/reset-password" state={{ email }}>
                <Button className="w-full mt-2">
                  Enter OTP & Reset Password <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" loading={loading}>
                Send Reset OTP <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
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

export default ForgotPassword;
