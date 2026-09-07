import { Testimonials } from "./unique-testimonial";

const demoTestimonials = [
  {
    id: 1,
    quote: "This changed everything for me.",
    name: "Sarah Chen",
    role: "Designer at Figma",
    initials: "SC",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    quote: "Simply brilliant. Nothing else compares.",
    name: "Marcus Johnson",
    role: "Engineer at Vercel",
    initials: "MJ",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    quote: "The attention to detail is unmatched.",
    name: "Elena Rodriguez",
    role: "Founder at Craft",
    initials: "ER",
    gradient: "from-teal-500 to-cyan-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-8">
      <Testimonials testimonials={demoTestimonials} />
    </main>
  );
}
