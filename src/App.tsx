import { Zap, Database, CheckCircle, ArrowRight, Menu, X, MessageSquare, Settings, BarChart2, MapPin, Monitor, User } from 'lucide-react';
import { useState } from 'react';
import { Chatbot } from './components/Chatbot';

const TOOLS = ['Clay', 'Smartlead', 'HeyReach', 'ZoomInfo', 'GHL', 'Lemlist', 'LinkedIn Sales Navigator', 'B2B Rocket'];

const SERVICES = [
  {
    icon: <Zap className="h-8 w-8 text-white" />,
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/50',
    title: 'Outreach System Builds',
    description: 'Full campaign setup from list to booked call. We architect and deploy the complete outreach stack so you start booking meetings fast.',
    bullets: ['ICP definition & list building', 'Sequence & campaign architecture', 'Inbox warm-up & deliverability setup'],
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-white" />,
    gradient: 'from-blue-500 to-cyan-600',
    shadow: 'shadow-blue-500/50',
    title: 'Ongoing Campaign Management',
    description: 'We run it, optimise it, report on it. Hands-off campaign management so your pipeline keeps moving without you touching it.',
    bullets: ['Continuous A/B testing & optimisation', 'Weekly performance reporting', 'Reply handling & lead handoff'],
  },
  {
    icon: <Database className="h-8 w-8 text-white" />,
    gradient: 'from-teal-500 to-cyan-600',
    shadow: 'shadow-teal-500/50',
    title: 'List Building & Data Enrichment',
    description: 'Targeted, verified, Clay-enriched prospect lists. The right contacts with the right data — built for outreach that actually lands.',
    bullets: ['Clay-powered enrichment workflows', 'Email & LinkedIn verification', 'ZoomInfo & intent data integration'],
  },
  {
    icon: <Settings className="h-8 w-8 text-white" />,
    gradient: 'from-blue-600 to-blue-400',
    shadow: 'shadow-blue-600/50',
    title: 'CRM & Workflow Integration',
    description: 'GHL and other CRM setup and automation. We connect your outreach to your CRM so no lead falls through the cracks.',
    bullets: ['GoHighLevel (GHL) setup & automation', 'Lead routing & pipeline management', 'Cross-platform workflow automation'],
  },
  {
    icon: <Monitor className="h-8 w-8 text-white" />,
    gradient: 'from-slate-600 to-slate-500',
    shadow: 'shadow-slate-600/50',
    title: 'Website Design',
    description: 'Clean, conversion-focused websites built and handed over ready to use.',
    bullets: ['Purpose-built for B2B credibility', 'Fast turnaround, clean handover', 'Optimised for outreach landing pages'],
  },
];

const TESTIMONIALS = [
  {
    quote: 'Had our systems running within a week, supporting outreach across 9 clients simultaneously.',
    name: 'Jody Parkinson',
    initials: 'JP',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    quote: 'Helped us close local millionaires in Quebec for our wealth management business.',
    name: 'Thomas Barry',
    initials: 'TB',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    quote: 'Built me a high converting website for my appliance repair business, good communication and regular SEO and site updates made when necessary.',
    name: 'James Smith',
    role: 'Website Design client',
    initials: 'JS',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    quote: 'Took my bakery website from 0 to hero, helped me add a shop and booking reservation on top of redesigning the whole site, highly recommend.',
    name: 'Louise D',
    role: 'Website Design client',
    initials: 'LD',
    gradient: 'from-blue-600 to-blue-400',
  },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to content
      </a>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/adverve-og-image_1.png" alt="Adverve" className="h-8 w-auto rounded" aria-hidden="true" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Adverve</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('services')} className="hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="hover:text-cyan-400 transition-colors">Process</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('results')} className="hover:text-cyan-400 transition-colors">Results</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors">Contact</button>
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
              Book a Call
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Process</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('results')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Results</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Contact</button>
              <button onClick={() => scrollToSection('contact')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg font-semibold mt-4">Book a Call</button>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
                <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-sm text-cyan-400 font-medium">B2B Outreach Infrastructure</span>
              </div>

              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                We Build Outreach Infrastructure
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                  That Books Meetings.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Not another marketing agency. We design, build and manage the backend systems behind <span className="font-semibold text-white">high-performance B2B outreach campaigns.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-500/30 flex items-center space-x-2"
                >
                  <span>Book a Discovery Call</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300"
                >
                  See What We Do
                </button>
              </div>

              {/* Stats Bar */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto" aria-label="Company statistics">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">22</div>
                  <div className="text-sm text-slate-400">Clients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">48</div>
                  <div className="text-sm text-slate-400">Campaigns Launched</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <MapPin className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                    <span className="text-lg font-bold text-cyan-400">UK &amp; North America</span>
                  </div>
                  <div className="text-sm text-slate-400">Markets We Serve</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" aria-labelledby="services-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold mb-4">What We Do</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Most businesses have the offer. They don't have the system. We build the infrastructure and run it using the tools serious outreach teams use.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 [&>*:last-child:nth-child(odd)]:md:col-span-2 [&>*:last-child:nth-child(odd)]:md:max-w-lg [&>*:last-child:nth-child(odd)]:md:mx-auto [&>*:last-child:nth-child(odd)]:md:w-full">
              {SERVICES.map((service) => (
                <article key={service.title} className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${service.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-slate-300">{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Our Stack Section */}
        <section id="stack" aria-labelledby="stack-heading" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h2 id="stack-heading" className="text-4xl md:text-5xl font-bold mb-4">Our Stack</h2>
            <p className="text-xl text-slate-400 mb-12">The tools serious outreach teams rely on.</p>
            <ul className="flex flex-wrap justify-center gap-4" aria-label="Tools we use">
              {TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:bg-slate-750 transition-all duration-200 rounded-xl px-6 py-3 text-slate-200 font-medium text-sm tracking-wide"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" aria-labelledby="process-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="process-heading" className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">From zero to booked meetings — a clear, proven process</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-400 opacity-30" style={{ width: 'calc(100% - 12rem)', left: '6rem' }}></div>

              <article className="relative text-center">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50 relative z-10">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Discovery Call</h3>
                <p className="text-slate-300 leading-relaxed">
                  We learn your ICP, current setup, and goals. Then we tell you exactly what needs building and what needs fixing.
                </p>
              </article>

              <article className="relative text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50 relative z-10">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">System Build</h3>
                <p className="text-slate-300 leading-relaxed">
                  We build the full outreach stack — lists, sequences, tooling, CRM — and get everything live and delivering.
                </p>
              </article>

              <article className="relative text-center">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50 relative z-10">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Managed &amp; Optimised</h3>
                <p className="text-slate-300 leading-relaxed">
                  We own the backend. You focus on closing. Monthly reporting keeps you across results without the noise.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" aria-labelledby="about-heading" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <h2 id="about-heading" className="text-3xl md:text-4xl font-bold">About the Founder</h2>
              </div>

              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  I started Adverve after spending years chasing the idea of becoming an entrepreneur without quite finding the right vehicle for it. The turning point was helping my aunt grow her coaching business to $1M in revenue in just 18 months &mdash; that's what showed me outreach infrastructure, done properly, is a genuine unlock for service businesses that have a good offer but no system behind it.
                </p>
                <p className="text-slate-300 leading-relaxed text-lg">
                  From there I went deep on AI &mdash; spending a few months in Thailand going all-in on learning how to apply it to outreach, list building, and campaign automation. Since then I've built and run backend outreach systems for clients across the UK and North America, and expanded into website design for businesses that need both the traffic engine and the storefront to convert it.
                </p>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Adverve exists because most businesses don't need another marketing agency &mdash; they need someone who'll actually build and own the infrastructure.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="font-semibold text-white text-lg">Owen Cawston</div>
                <div className="text-sm text-cyan-400 mt-1">Founder, Adverve</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="results" aria-labelledby="results-heading" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="results-heading" className="text-4xl md:text-5xl font-bold mb-4">What Clients Say</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t) => (
                <article key={t.name} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-1 mb-6" aria-label="Rated 5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <blockquote className="text-slate-200 mb-8 leading-relaxed text-lg italic">
                    "{t.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold flex-shrink-0`} aria-hidden="true">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      {t.role && <div className="text-xs text-slate-400 mt-0.5">{t.role}</div>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" aria-labelledby="contact-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
              <div className="text-center mb-10">
                <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-4">If your outreach isn't performing or you need someone to own the backend, let's talk.</h2>
                <p className="text-xl text-slate-300 mt-4">Book a call and we'll tell you exactly what needs fixing.</p>
              </div>

              {formStatus === 'success' ? (
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
              ) : (
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
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img src="/adverve-og-image_1.png" alt="Adverve" className="h-6 w-auto rounded" aria-hidden="true" />
              <span className="text-xl font-bold">Adverve</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 Adverve. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;
