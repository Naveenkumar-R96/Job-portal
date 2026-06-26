import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewService, savedService } from '../../services/endpoints';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Building2, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const DIFFICULTY_COLOR = { Easy: 'green', Medium: 'yellow', Hard: 'red' };

const QuestionCard = ({ q, isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Login to save questions'); return; }
    try {
      const res = await savedService.toggleSaveQuestion(q._id, 'company');
      setSaved(res.data.saved);
      toast.success(res.data.saved ? 'Question saved!' : 'Question unsaved');
    } catch {
      toast.error('Failed to save question');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden hover:shadow-md transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-5 text-left cursor-pointer"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {q.difficulty && <Badge color={DIFFICULTY_COLOR[q.difficulty] || 'gray'}>{q.difficulty}</Badge>}
            {q.type && <Badge color="blue">{q.type}</Badge>}
          </div>
          <p className="text-sm font-semibold text-text-primary leading-relaxed">{q.question}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleSave} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4 text-text-muted" />}
          </button>
          {open ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </button>
      {open && q.answer && (
        <div className="px-5 pb-5 pt-0 border-t border-border-light animate-slide-down">
          <p className="text-sm text-text-secondary leading-relaxed mt-4 whitespace-pre-line">{q.answer}</p>
        </div>
      )}
    </div>
  );
};

const CompanyPrep = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    interviewService.getQuestionsByCompany(id)
      .then((res) => {
        setCompany(res.data.company || null);
        setQuestions(res.data.questions || res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const types = ['All', ...new Set(questions.map(q => q.type).filter(Boolean))];
  const filtered = filter === 'All' ? questions : questions.filter(q => q.type === filter);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/interview" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Prep
        </Link>

        {/* Company Header */}
        <div className="bg-white rounded-2xl border border-border-light p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary">{company?.name || 'Company'}</h1>
              {company?.industry && <p className="text-text-secondary text-sm mt-0.5">{company.industry}</p>}
              <p className="text-primary font-semibold text-sm mt-1">{questions.length} Interview Questions</p>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        {types.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-5">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  filter === t
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState title="No questions yet" description="Questions for this company will appear here soon." />
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <QuestionCard key={q._id} q={q} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;
