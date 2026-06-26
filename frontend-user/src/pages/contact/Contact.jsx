import { useState } from 'react';
import { inquiryService } from '../../services/endpoints';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.subject) errs.subject = 'Subject is required';
    if (!form.message || form.message.length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await inquiryService.submitInquiry(form);
      if (res.data.success) {
        setSent(true);
        toast.success('Message sent successfully!');
      } else {
        toast.error(res.data.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary text-sm font-semibold rounded-full mb-4">
            <MessageSquare className="w-4 h-4" /> Get In Touch
          </span>
          <h1 className="text-4xl font-black text-text-primary">Contact Us</h1>
          <p className="text-text-secondary mt-3 max-w-md mx-auto">
            Have a question or need help? Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: Mail, label: 'Email Us', value: 'support@jobportal.com', sub: 'We reply within 24 hours' },
              { icon: Phone, label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Fri, 9AM–6PM' },
              { icon: MapPin, label: 'Visit Us', value: 'Chennai, Tamil Nadu', sub: 'India 600001' },
              { icon: Clock, label: 'Business Hours', value: 'Mon – Fri', sub: '9:00 AM to 6:00 PM IST' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-border-light p-5 flex items-start gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-text-primary mt-0.5">{item.value}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-border-light p-7 animate-fade-in">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-6 text-primary font-semibold text-sm hover:text-primary-dark cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      error={errors.name}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      error={errors.email}
                    />
                  </div>
                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    error={errors.subject}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Describe your question or issue in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                    />
                    {errors.message && <p className="text-xs text-error">{errors.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" loading={loading} size="lg">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
