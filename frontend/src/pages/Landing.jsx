import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-[#60A5FA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    title: "Lightning Fast",
    desc: "Generate short URLs instantly with minimal latency."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#60A5FA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
    title: "QR Code Generation",
    desc: "Every short URL comes with a scannable QR code for easy sharing."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#60A5FA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4" /></svg>
    ),
    title: "Privacy First",
    desc: "Your data is secure and never shared. Privacy is our top priority."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#60A5FA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
    title: "Unlimited URLs",
    desc: "Sign up to shorten and manage unlimited links."
  }
];

const testimonials = [
  {
    name: "Jane Doe",
    text: "This tool has made sharing links so much easier. The QR codes are a game-changer!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "John Smith",
    text: "Fast, reliable, and the dashboard is super intuitive. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];

const Landing = () => {
  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen relative overflow-hidden">
      {/* Rectangular spotlights */}
      <div className="spotlight-bg w-full h-0">
        <div className="spotlight-rect left" />
        <div className="spotlight-rect left short" />
        <div className="spotlight-rect right" />
        <div className="spotlight-rect right short" />
      </div>
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-4 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">Shortly</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/home" className="hover:text-[#60A5FA] font-semibold">Home</Link>
          <Link to="/dashboard" className="hover:text-[#60A5FA] font-semibold">Dashboard</Link>
          <Link to="/signin" className="btn-primary px-5 py-2 scale-hover">Sign In</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-24 gap-12 relative z-10">
        <div className="flex-1 flex flex-col gap-6 items-start">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Simplify Your Links</h1>
          <p className="text-xl text-gray-200 mb-4 max-w-xl">Create short, shareable URLs with QR codes in seconds. Secure, fast, and built for ease of use.</p>
          <div className="flex gap-4 mt-2">
            <Link to="/home" className="btn-primary px-8 py-3 text-lg scale-hover">Get Started</Link>
            <Link to="/signin" className="btn-secondary px-8 py-3 text-lg scale-hover">Sign In</Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {/* Modern SVG illustration */}
          <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="280" height="140" rx="32" fill="#18181B" />
            <rect x="60" y="80" width="200" height="20" rx="8" fill="#23272e" />
            <rect x="60" y="110" width="120" height="20" rx="8" fill="#23272e" />
            <rect x="60" y="140" width="80" height="20" rx="8" fill="#23272e" />
            <circle cx="260" cy="150" r="24" fill="#60A5FA" />
            <rect x="240" y="130" width="40" height="40" rx="12" fill="#23272e" />
          </svg>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-[#18181B]">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={f.title} className="card flex flex-col items-center text-center gap-4 p-8 fade-in hover:scale-[1.03] transition-transform duration-300">
              {f.icon}
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* How it works */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 flex flex-col items-center text-center fade-in">
            <span className="text-3xl font-bold mb-2">1</span>
            <p className="text-lg">Paste your long URL into the form.</p>
          </div>
          <div className="card p-8 flex flex-col items-center text-center fade-in">
            <span className="text-3xl font-bold mb-2">2</span>
            <p className="text-lg">Click "Shorten URL" to generate your link and QR code.</p>
          </div>
          <div className="card p-8 flex flex-col items-center text-center fade-in">
            <span className="text-3xl font-bold mb-2">3</span>
            <p className="text-lg">Copy or share your new short link anywhere!</p>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#18181B]">
        <h2 className="text-4xl font-bold text-center mb-10">What Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto items-center justify-center">
          {testimonials.map((t) => (
            <div key={t.name} className="card flex flex-col items-center text-center gap-4 p-8 fade-in hover:scale-[1.03] transition-transform duration-300">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-2 border-[#60A5FA]" />
              <p className="text-gray-300 italic">"{t.text}"</p>
              <span className="font-semibold mt-2">{t.name}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0F0F0F] border-t border-[#23272e] mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">Shortly</h3>
            <p className="text-gray-400">Simplify your links, amplify your reach.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
          </div>
          <div className="text-gray-400">Made with <span className="text-[#60A5FA]">❤️</span> for the web</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
