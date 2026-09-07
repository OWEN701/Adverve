import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { FeatureGrid } from './grid-feature-cards';

const features = [
  { title: 'Faaast', icon: Zap, description: 'It supports an entire helping developers and innovate.' },
  { title: 'Powerful', icon: Cpu, description: 'It supports an entire helping developers and businesses.' },
  { title: 'Security', icon: Fingerprint, description: 'It supports an helping developers businesses.' },
  { title: 'Customization', icon: Pencil, description: 'It supports helping developers and businesses innovate.' },
  { title: 'Control', icon: Settings2, description: 'It supports helping developers and businesses innovate.' },
  { title: 'Built for AI', icon: Sparkles, description: 'It supports helping developers and businesses innovate.' },
];

export default function DemoOne() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance text-white md:text-4xl lg:text-5xl">
            Power. Speed. Control.
          </h2>
          <p className="mt-4 text-sm tracking-wide text-balance text-slate-400 md:text-base">
            Everything you need to build fast, secure, scalable apps.
          </p>
        </div>
        <FeatureGrid features={features} />
      </div>
    </section>
  );
}
