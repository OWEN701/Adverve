import { Bot, TrendingUp, Zap, Users, Mail, Globe, CheckCircle, ArrowRight, Menu, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Chatbot } from './components/Chatbot';

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

            {/* Desktop Navigation */}
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
              Get Started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Process</button>
              <button onClick={() => scrollToSection('results')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Results</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-cyan-400 transition-colors">Contact</button>
              <button onClick={() => scrollToSection('contact')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg font-semibold mt-4">Get Started</button>
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
              <span className="text-sm text-cyan-400 font-medium">AI-Powered Growth Solutions</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Unlock Unmatched Growth with
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Expert Paid Traffic Solutions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
              More than a marketing agency — we're built to <span className="font-semibold text-white">EMPOWER</span> your business with cutting-edge AI automation and proven marketing strategies
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection('contact')}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-500/30 flex items-center space-x-2"
              >
                <span>Start Free Strategy Call</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('process')}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">500+</div>
                <div className="text-sm text-slate-400">Campaigns Launched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">3.5x</div>
                <div className="text-sm text-slate-400">Avg ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">98%</div>
                <div className="text-sm text-slate-400">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">24/7</div>
                <div className="text-sm text-slate-400">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">Comprehensive solutions designed to scale your business and maximize ROI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Website Creation & Smart Bots</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                High-converting, lightning-fast websites paired with AI-powered chatbots that capture leads and provide 24/7 customer support automatically.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Conversion-optimized design</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">AI chatbot integration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Mobile-first responsive</span>
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Lead Generation</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Personalized, automated outreach campaigns across email and LinkedIn that nurture leads while you focus on closing deals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Smart targeting algorithms</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Automated follow-up sequences</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Real-time lead scoring</span>
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Social Media Growth</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Strategic content creation and audience expansion techniques that build your brand authority and drive engaged followers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Data-driven content strategy</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Engagement optimization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Performance analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">A proven 3-step process to transform your marketing and accelerate growth</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Lines */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30" style={{ width: 'calc(100% - 12rem)', left: '6rem' }}></div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50 relative z-10">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Strategy Call</h3>
              <p className="text-slate-300 leading-relaxed">
                We dive deep into your business goals, target audience, and current challenges to create a custom growth roadmap.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50 relative z-10">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Onboarding</h3>
              <p className="text-slate-300 leading-relaxed">
                Our team sets up your campaigns, integrates AI tools, and configures everything for maximum performance and ROI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50 relative z-10">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Campaign Launch</h3>
              <p className="text-slate-300 leading-relaxed">
                Watch your campaigns go live with continuous optimization, detailed reporting, and dedicated support every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results/Testimonials Section */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Real Results, Real Growth</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">See how we've helped businesses like yours achieve remarkable success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed italic">
                "Adverve transformed our lead generation completely. We went from 20 leads per month to over 200 qualified leads with their AI automation. Game changer!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold">
                  JM
                </div>
                <div>
                  <div className="font-semibold">Jennifer Mitchell</div>
                  <div className="text-sm text-slate-400">Online Course Creator</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed italic">
                "The ROI has been incredible. Within 3 months, we 5x'd our ad spend profitably. Their team knows exactly what they're doing."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl font-bold">
                  DR
                </div>
                <div>
                  <div className="font-semibold">David Rodriguez</div>
                  <div className="text-sm text-slate-400">SaaS Founder</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed italic">
                "Professional, responsive, and results-driven. They don't just run campaigns — they become a true growth partner for your business."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl font-bold">
                  SP
                </div>
                <div>
                  <div className="font-semibold">Sarah Peterson</div>
                  <div className="text-sm text-slate-400">E-commerce Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Scale Your Business?</h2>
              <p className="text-xl text-slate-300">Book your free 30-minute strategy call and discover how we can help you achieve unmatched growth</p>
              <div className="mt-6 inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-6 py-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <span className="text-cyan-400 font-medium">Ideal for businesses making $50,000+ monthly</span>
              </div>
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
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Revenue</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors">
                  <option>$50,000 - $100,000</option>
                  <option>$100,000 - $250,000</option>
                  <option>$250,000 - $500,000</option>
                  <option>$500,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tell us about your business</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="What are your main goals and challenges?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Schedule Free Strategy Call</span>
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
              © 2024 Adverve Agency. All rights reserved.
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
