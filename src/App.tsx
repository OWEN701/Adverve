import { Zap, Database, CheckCircle, ArrowRight, Menu, X, MessageSquare, Settings, BarChart2, Globe, MapPin, Monitor } from 'lucide-react';
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
    initials: 'JS',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    quote: 'Took my bakery website from 0 to hero, helped me add a shop and booking reservation on top of redesigning the whole site, highly recommend.',
    name: 'Louise D',
    initials: 'LD',
    gradient: 'from-blue-600 to-blue-400',
  },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Adverve</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('services')} className="hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="hover:text-cyan-400 transition-colors">Process</button>
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
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Process</button>
              <button onClick={() => scrollToSection('results')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Results</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Contact</button>
              <button onClick={() => scrollToSection('contact')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg font-semibold mt-4">Book a Call</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">B2B Outreach Infrastructure</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
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
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300"
              >
                See What We Do
              </button>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
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
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span className="text-lg font-bold text-cyan-400">UK &amp; North America</span>
                </div>
                <div className="text-sm text-slate-400">Markets We Serve</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Most businesses have the offer. They don't have the system. We build the infrastructure and run it using the tools serious outreach teams use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 [&>*:last-child:nth-child(odd)]:md:col-span-2 [&>*:last-child:nth-child(odd)]:md:max-w-lg [&>*:last-child:nth-child(odd)]:md:mx-auto [&>*:last-child:nth-child(odd)]:md:w-full">
            {SERVICES.map((service) => (
              <div key={service.title} className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${service.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Stack Section */}
      <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Stack</h2>
          <p className="text-xl text-slate-400 mb-12">The tools serious outreach teams rely on.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool}
                className="bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:bg-slate-750 transition-all duration-200 rounded-xl px-6 py-3 text-slate-200 font-medium text-sm tracking-wide"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">From zero to booked meetings — a clear, proven process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-400 opacity-30" style={{ width: 'calc(100% - 12rem)', left: '6rem' }}></div>

            <div className="relative text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50 relative z-10">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Discovery Call</h3>
              <p className="text-slate-300 leading-relaxed">
                We learn your ICP, current setup, and goals. Then we tell you exactly what needs building and what needs fixing.
              </p>
            </div>

            <div className="relative text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50 relative z-10">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">System Build</h3>
              <p className="text-slate-300 leading-relaxed">
                We build the full outreach stack — lists, sequences, tooling, CRM — and get everything live and delivering.
              </p>
            </div>

            <div className="relative text-center">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50 relative z-10">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Managed &amp; Optimised</h3>
              <p className="text-slate-300 leading-relaxed">
                We own the backend. You focus on closing. Monthly reporting keeps you across results without the noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-200 mb-8 leading-relaxed text-lg italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div className="font-semibold text-white">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">If your outreach isn't performing or you need someone to own the backend, let's talk.</h2>
              <p className="text-xl text-slate-300 mt-4">Book a call and we'll tell you exactly what needs fixing.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tell us about your outreach</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="What are you currently running? What's not working?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Book a Call</span>
              </button>

              <p className="text-center text-sm text-slate-400 mt-4">
                No commitment required • 100% confidential • Response within 24 hours
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-cyan-400" />
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
