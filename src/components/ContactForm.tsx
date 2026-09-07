import { useState } from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';

/**
 * The classic Supabase-backed contact form.
 *
 * Kept for easy restore — the site now uses <LetsWorkTogether /> in the
 * contact section instead. To bring this back, render <ContactForm /> in
 * App.tsx's #contact section in place of <LetsWorkTogether />.
 */
export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            company: formData.company,
            message: formData.message,
          }),
        }
      );
      if (!res.ok) throw new Error('Submission failed');
      setFormStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', company: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <CheckCircle className="h-16 w-16 text-cyan-400 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
        <p className="text-slate-300">Thanks for reaching out. We'll be in touch within 24 hours.</p>
        <button
          onClick={() => setFormStatus('idle')}
          className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-label="Contact form">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
          <input
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
          placeholder="john@company.com"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
        <input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">Tell us about your outreach</label>
        <textarea
          id="message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          placeholder="What are you currently running? What's not working?"
        />
      </div>

      {formStatus === 'error' && (
        <p className="text-red-400 text-sm text-center" role="alert">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={formStatus === 'submitting'}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2"
      >
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
        <span>{formStatus === 'submitting' ? 'Sending...' : 'Book a Call'}</span>
      </button>

      <p className="text-center text-sm text-slate-400 mt-4">
        No commitment required • 100% confidential • Response within 24 hours
      </p>
    </form>
  );
}
