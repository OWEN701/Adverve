import { Zap, Database, CheckCircle, ArrowRight, Menu, X, Settings, BarChart2, MapPin, Monitor, Layers, Send, Linkedin, Radar, Workflow, Mail, Compass, Rocket, Search, Wrench, TrendingUp, Plus } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { CookieConsent } from './components/CookieConsent';
import { DarkGradientBg } from './components/ui/elegant-dark-pattern';
import IntroOverlay from './components/ui/intro-overlay';
import { ShinyButton } from './components/ui/shiny-button';
import ShaderCard from './components/ui/shader-card';
import { FeatureGrid, type FeatureType } from './components/ui/grid-feature-cards';
import { Testimonials } from './components/ui/unique-testimonial';
import { LetsWorkTogether } from './components/ui/lets-work-section';
import { FAQS } from './content/faqs';

// The chatbot pulls in the Supabase client — load it after the page is idle so
// it never competes with first paint.
const Chatbot = lazy(() => import('./components/Chatbot').then((m) => ({ default: m.Chatbot })));

const BOOKING_URL = 'https://app.lemcal.com/@owenc/adverve';
const CONTACT_EMAIL = 'owen@adverve.io';

type Service = {
  icon: JSX.Element;
  gradient: string;
  shadow: string;
  title: string;
  description: string;
  bullets: string[];
  quotes?: { quote: string; name: string }[];
};

const SERVICES: Service[] = [
  {
    icon: <Zap className="h-8 w-8 text-white" />,
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/50',
    title: 'Outreach System Builds',
    description: 'Full campaign setup from list to booked call. We architect and deploy the complete outreach stack, live in about a week.',
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
    title: 'Websites & Outreach Landing Pages',
    description: 'The page your outreach sends people to. Clean, conversion-focused sites and landing pages, built and handed over ready to use.',
    bullets: ['Purpose-built for B2B credibility', 'Fast turnaround, clean handover', 'Optimised for outreach landing pages'],
    quotes: [
      {
        quote: 'Built me a high converting website for my appliance repair business, good communication and regular SEO and site updates made when necessary.',
        name: 'James Smith',
      },
      {
        quote: 'Took my bakery website from 0 to hero, helped me add a shop and booking reservation on top of redesigning the whole site, highly recommend.',
        name: 'Louise D',
      },
    ],
  },
];

const PACKAGES = [
  {
    name: 'Outbound Launch',
    price: '£2,500',
    cadence: 'one-off',
    description: 'The full outreach system, built in your accounts and live in about a week.',
    bullets: ['ICP definition & verified prospect list', 'Sending domains & inboxes set up and warmed', 'Sequences written and loaded', 'Replies routed into your CRM'],
    featured: false,
  },
  {
    name: 'Managed Outbound',
    price: '£1,500',
    cadence: 'per month',
    description: 'We run the system week to week. You take the calls.',
    bullets: ['Campaign management & A/B testing', 'Reply handling & lead handoff', 'Fresh list building each month', 'Weekly performance reporting'],
    featured: true,
  },
  {
    name: 'Data Sprint',
    price: '£750',
    cadence: 'one-off',
    description: 'A targeted, Clay-enriched list, ready to load into your own tools.',
    bullets: ['ICP-matched companies & contacts', 'Email & LinkedIn verification', 'Enrichment fields for personalisation', 'Delivered ready to import'],
    featured: false,
  },
];

const TOOL_FEATURES: FeatureType[] = [
  { title: 'Clay', icon: Layers, description: 'Waterfall data enrichment and list building.' },
  { title: 'Smartlead', icon: Send, description: 'Cold email sending, inbox rotation and warm-up.' },
  { title: 'HeyReach', icon: Linkedin, description: 'LinkedIn outreach automation at scale.' },
  { title: 'ZoomInfo', icon: Radar, description: 'B2B contact data and buying-intent signals.' },
  { title: 'GoHighLevel', icon: Workflow, description: 'CRM, pipelines and follow-up automation.' },
  { title: 'Lemlist', icon: Mail, description: 'Multichannel sequences and email personalisation.' },
  { title: 'Sales Navigator', icon: Compass, description: 'Advanced prospecting and lead filtering.' },
  { title: 'B2B Rocket', icon: Rocket, description: 'AI-driven lead generation and qualification.' },
];

const PROCESS_STEPS: FeatureType[] = [
  {
    title: '01 — Discovery Call',
    icon: Search,
    description: 'We learn your ICP, current setup and goals, then tell you exactly what needs building and what needs fixing.',
  },
  {
    title: '02 — System Build',
    icon: Wrench,
    description: 'We build the full outreach stack — lists, sequences, tooling, CRM — in your accounts, and get it live in about a week.',
  },
  {
    title: '03 — Managed & Optimised',
    icon: TrendingUp,
    description: 'We run and optimise it. You focus on closing. Weekly reports keep you across results — and everything we build stays yours.',
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
];

const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
  { id: 'results', label: 'Results' },
  { id: 'faq', label: 'FAQ' },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const load = () => setShowChatbot(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 2500);
    return () => clearTimeout(t);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <DarkGradientBg />
      <IntroOverlay />

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to content
      </a>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2" aria-label="Adverve home">
              <img src="/logo.webp" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Adverve</span>
            </a>

            <div className="hidden md:flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-cyan-400 transition-colors">
                  {item.label}
                </button>
              ))}
            </div>

            <ShinyButton
              size="sm"
              onClick={() => scrollToSection('contact')}
              className="hidden md:block"
            >
              Book a Call
            </ShinyButton>

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
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">
                  {item.label}
                </button>
              ))}
              <ShinyButton size="sm" onClick={() => scrollToSection('contact')} className="w-full mt-4">Book a Call</ShinyButton>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" aria-labelledby="hero-heading" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
                <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-sm text-cyan-400 font-medium">Outreach infrastructure for B2B founders</span>
              </div>

              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Cold Outreach That Books Meetings.
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Built and Run For You.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                For B2B founders with a good offer and no system behind it. We set up the domains, lists, sequences and CRM, then run the campaigns week to week. <span className="font-semibold text-white">Live in about a week, and you own everything we build.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ShinyButton onClick={() => scrollToSection('contact')}>
                  Book a Discovery Call
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </ShinyButton>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300"
                >
                  See Packages
                </button>
              </div>
              <p className="mt-5 text-sm text-slate-400">30-min call · No commitment · Reply within 24 hours</p>

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
              {SERVICES.map((service, i) => (
                <ShaderCard key={service.title} index={i} className="h-full">
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
                  {service.quotes && (
                    <div className="mt-6 space-y-4 border-t border-slate-700 pt-6">
                      {service.quotes.map((q) => (
                        <blockquote key={q.name} className="text-sm text-slate-400 leading-relaxed">
                          “{q.quote}”
                          <footer className="mt-1 text-slate-500">— {q.name}</footer>
                        </blockquote>
                      ))}
                    </div>
                  )}
                </ShaderCard>
              ))}
            </div>
          </div>
        </section>

        {/* Our Stack Section */}
        <section id="stack" aria-labelledby="stack-heading" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="stack-heading" className="text-4xl md:text-5xl font-bold mb-4">Our Stack</h2>
              <p className="text-xl text-slate-400">The tools serious outreach teams rely on.</p>
            </div>
            <FeatureGrid features={TOOL_FEATURES} />
          </div>
        </section>

        {/* Process Section */}
        <section id="process" aria-labelledby="process-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="process-heading" className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">From zero to booked meetings in three steps.</p>
            </div>
            <FeatureGrid features={PROCESS_STEPS} />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" aria-labelledby="pricing-heading" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold mb-4">Packages</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Start with a build, a list, or the whole thing run for you. Exact scope and price confirmed on the call.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col rounded-2xl border p-8 ${
                    pkg.featured
                      ? 'border-cyan-500 bg-slate-900 shadow-2xl shadow-cyan-500/20'
                      : 'border-slate-700 bg-slate-900/60'
                  }`}
                >
                  {pkg.featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-slate-950">
                      Build + run
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <p className="mt-2 text-slate-400">{pkg.description}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-sm text-slate-400">from</span>
                    <span className="text-4xl font-bold text-white">{pkg.price}</span>
                    <span className="text-sm text-slate-400">{pkg.cadence}</span>
                  </div>
                  <ul className="mt-6 space-y-3 flex-1">
                    {pkg.bullets.map((b) => (
                      <li key={b} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-slate-300">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className={`mt-8 w-full rounded-xl px-6 py-3 font-semibold transition-colors ${
                      pkg.featured
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                        : 'border border-slate-600 hover:border-cyan-500 hover:bg-slate-800'
                    }`}
                  >
                    Book a call
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-400">
              Every domain, inbox, list and workflow is set up in your accounts. If we stop working together, you keep all of it.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" aria-labelledby="about-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                <img
                  src="/owen-cawston.webp"
                  alt="Owen Cawston, founder of Adverve"
                  width={480}
                  height={600}
                  loading="lazy"
                  className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl object-cover border border-slate-600 shadow-xl flex-shrink-0"
                />
                <div>
                  <h2 id="about-heading" className="text-3xl md:text-4xl font-bold">About the Founder</h2>
                  <p className="mt-2 text-cyan-400">Owen Cawston · Founder, Adverve</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  Adverve started with one result: the outreach system behind my aunt's coaching business, which grew to $1M in revenue in 18 months. It showed me that most service businesses don't have an offer problem &mdash; they have a system problem. No clean list, no deliverability setup, no follow-up, and nothing connecting replies to a CRM.
                </p>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Since then I've built and run backend outreach systems for clients across the UK and North America &mdash; Clay enrichment, cold email and LinkedIn sequences, deliverability, and CRM automation, with AI built into the workflows wherever it saves time.
                </p>
                <p className="text-slate-300 leading-relaxed text-lg">
                  You work with me directly, not an account manager. And everything we build &mdash; domains, inboxes, data and playbooks &mdash; lives in your accounts and stays yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="results" aria-labelledby="results-heading" className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 id="results-heading" className="text-4xl md:text-5xl font-bold">What Outreach Clients Say</h2>
            </div>

            <Testimonials testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" aria-labelledby="faq-heading" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">Questions Founders Ask</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-700 bg-slate-900/60 p-6 open:border-cyan-500/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <Plus className="h-5 w-5 flex-shrink-0 text-cyan-400 transition-transform group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 text-slate-300 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section — was a Supabase-backed form (kept in components/ContactForm.tsx) */}
        <div id="contact">
          <LetsWorkTogether bookingUrl={BOOKING_URL} email={CONTACT_EMAIL} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <a href="/" className="flex items-center space-x-2" aria-label="Adverve home">
              <img src="/logo.webp" alt="" width={24} height={24} className="h-6 w-6" />
              <span className="text-xl font-bold">Adverve</span>
            </a>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Adverve. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/privacy/" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="/terms/" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
      {showChatbot && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
}

export default App;
