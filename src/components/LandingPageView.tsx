import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Wind, 
  Car, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  ChevronRight, 
  Waves, 
  Bath, 
  Menu,
  X,
  Calendar,
  Utensils,
  Coffee,
  ShieldCheck,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteContent } from '../lib/contentStore';

interface LandingPageViewProps {
  content: SiteContent;
  onSecretTap?: () => void;
  isPreview?: boolean;
  forcedDevice?: 'mobile' | 'tablet' | 'desktop';
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  content,
  onSecretTap,
  isPreview = false,
  forcedDevice,
}) => {
  const isMobileMode = forcedDevice === 'mobile';
  const isTabletMode = forcedDevice === 'tablet';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Interactive Section States
  const [activeCourse, setActiveCourse] = useState('Starters');
  const [activeEventFilter, setActiveEventFilter] = useState('all');
  const [activeSlide, setActiveSlide] = useState(0);

  // Slideshow auto-advance effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev === 5 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 1,
      image: '/images/WhatsApp Image 2026-05-17 at 17.36.52 (1).jpeg',
      title: 'Our Culinary Standards',
      desc: 'Our private chefs run and present the kitchen as a dedicated laboratory of flavor under absolute professional standards.',
      badge: 'Chef Presentation'
    },
    {
      id: 2,
      image: '/images/WhatsApp Image 2026-05-17 at 17.37.23.jpeg',
      title: 'Deep Artistic Focus',
      desc: 'Care and detail dictate our actions. Every garnish, sprout, and micro-green is placed with complete precision.',
      badge: 'Artistic Plating'
    },
    {
      id: 3,
      image: '/images/WhatsApp Image 2026-05-17 at 17.37.01.jpeg',
      title: 'Precision Execution',
      desc: 'Expert hands glaze each dish meticulously, making sure every plate arriving at the guest table is a masterpiece.',
      badge: 'Meticulous Glazing'
    },
    {
      id: 4,
      image: '/images/WhatsApp Image 2026-05-17 at 17.37.21 (1).jpeg',
      title: 'Absolute Food Safety & Hygiene',
      desc: 'Using fresh organic ingredients handled with elite protective safety and strict clinical hygiene protocols.',
      badge: 'Clinical Hygiene'
    },
    {
      id: 5,
      image: '/images/WhatsApp Image 2026-05-17 at 17.37.13.jpeg',
      title: 'Seamless Table Service',
      desc: 'Our hosting team serves courses elegantly, delivering seamless service to fulfill any request instantly.',
      badge: 'Seamless Hosting'
    },
    {
      id: 6,
      image: '/images/WhatsApp Image 2026-05-17 at 17.37.00.jpeg',
      title: 'Warm Welcoming Hospitality',
      desc: 'Experience hosting in true Lesotho fashion, greeting guests with warm, authentic smiles and pure care.',
      badge: 'Warm Hospitality'
    }
  ];

  // Interactive Booking Form State
  const [bookingForm, setBookingForm] = useState({
    suite: 'Royal Suite',
    checkIn: '',
    checkOut: '',
    guests: '2',
    addOns: {
      jacuzzi: false,
      pool: false,
      catering: false,
      eventSpace: false
    }
  });

  // Lock body scroll only when NOT in preview mode
  useEffect(() => {
    if (isPreview) return;
    if (isMenuOpen || isBookingOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isBookingOpen, isPreview]);

  const baseWhatsappLink = `https://wa.me/${(content.contact?.whatsapp || '26662369487').replace(/[^0-9]/g, '')}`;

  // WhatsApp Message Generator and Redirect
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addOnsList = [];
    if (bookingForm.addOns.jacuzzi) addOnsList.push("Private Jacuzzi tub");
    if (bookingForm.addOns.pool) addOnsList.push("Pool access");
    if (bookingForm.addOns.catering) addOnsList.push("Gourmet Catering");
    if (bookingForm.addOns.eventSpace) addOnsList.push("Sanctuary Event Space");

    const messageText = `Hello The Violet House Lesotho! 💜

I would like to inquire about a luxury booking:
• Selected Option: ${bookingForm.suite}
• Check-in Date: ${bookingForm.checkIn || 'To be decided'}
• Check-out Date: ${bookingForm.checkOut || 'To be decided'}
• Guest Count: ${bookingForm.guests}

${addOnsList.length > 0 ? `Selected Sanctuary Add-ons:\n${addOnsList.map(a => `- ${a}`).join('\n')}` : 'No additional add-ons selected.'}

Please let me know availability and details. Thank you!`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`${baseWhatsappLink}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    setIsBookingOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: isPreview ? '#hero-section' : '#' },
    { name: 'Wellness', href: '#wellness' },
    { name: 'Suites', href: '#suites' },
    { name: 'Dining', href: '#dining' },
    { name: 'Events', href: '#events' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white selection:bg-violet-royal/30 font-sans relative overflow-x-hidden">
      {/* Dynamic Font & Color Tokens */}
      <style>{`
        :root {
          --font-display: '${content.typography?.displayFont || 'Playfair Display'}', serif;
          --font-body: '${content.typography?.bodyFont || 'Plus Jakarta Sans'}', sans-serif;
          --color-primary: ${content.general?.primaryColor || '#8A2BE2'};
        }
        .font-serif {
          font-family: var(--font-display) !important;
        }
        .font-sans {
          font-family: var(--font-body) !important;
        }
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite alternate ease-in-out;
        }
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`${isPreview ? 'sticky' : 'fixed'} top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <div 
            onClick={onSecretTap}
            className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0 cursor-pointer select-none"
            title="The Violet House"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/50 via-violet-royal to-amber-200/50 shadow-[0_0_20px_rgba(138,43,226,0.4)] border border-amber-300/40 flex-shrink-0 overflow-hidden">
              <img 
                src={content.general?.logoUrl || "/images/logo.png"} 
                alt="The Violet House Bed & Breakfast Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-base md:text-lg font-serif tracking-[0.18em] sm:tracking-[0.25em] uppercase font-light leading-none">
                {content.general?.siteName || "The Violet House"}
              </span>
              <span className="text-[7px] sm:text-[8px] tracking-[0.3em] sm:tracking-[0.45em] uppercase text-violet-royal mt-1 font-bold">
                {content.general?.siteTagline || "Bed & Breakfast • Lesotho"}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className={`${isMobileMode ? 'hidden' : 'hidden md:flex'} items-center gap-8 lg:gap-12`}>
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[10px] font-medium tracking-[0.3em] uppercase hover:text-violet-royal transition-all duration-500 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-royal transition-all duration-500 group-hover:w-full"></span>
              </a>
            ))}
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="cursor-pointer relative overflow-hidden px-7 py-3 rounded-full border border-violet-royal text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-violet-royal hover:shadow-[0_0_30px_rgba(138,43,226,0.4)] text-white"
            >
              <span className="relative z-10">Inquire Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`${isMobileMode ? 'block' : 'md:hidden'} p-2 text-white flex-shrink-0 cursor-pointer`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-20 sm:top-24 left-0 w-full bg-charcoal-light border-b border-white/5 p-6 flex flex-col gap-4 ${isMobileMode ? 'flex' : 'md:hidden'} shadow-2xl z-50`}
            >
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/50 via-violet-royal to-amber-200/50 border border-amber-300/40 overflow-hidden flex-shrink-0 shadow-lg">
                  <img 
                    src={content.general?.logoUrl || "/images/logo.png"} 
                    alt="The Violet House Logo" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base tracking-widest uppercase">{content.general?.siteName}</h4>
                  <p className="text-[8px] text-amber-300/90 tracking-widest uppercase font-semibold">{content.general?.siteTagline}</p>
                </div>
              </div>

              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-serif tracking-widest uppercase py-2 border-b border-white/5 hover:text-violet-royal transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="cursor-pointer bg-violet-royal w-full py-4 rounded-xl text-center font-bold tracking-widest uppercase mt-4 shadow-lg shadow-violet-royal/20 text-white"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-[100svh] min-h-screen flex flex-col items-center justify-between pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={content.hero?.bgImageUrl || "/images/new.jpeg"} 
            alt="Luxury Lifestyle at The Violet House" 
            className="w-full h-full object-cover opacity-45 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-charcoal"></div>
          
          {/* Atmospheric Glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-violet-royal/15 to-transparent opacity-60 pointer-events-none"></div>
          <div className="absolute top-1/4 -left-20 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-violet-royal/10 blur-[120px] sm:blur-[180px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#4B0082]/10 blur-[120px] sm:blur-[180px] rounded-full pointer-events-none"></div>
        </div>

        {/* Top spacer for vertical balance */}
        <div className="hidden sm:block h-2"></div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            {/* Official Logo Brand Crest */}
            <div className="relative group mb-4 sm:mb-6">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/40 via-violet-royal/60 to-amber-200/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400/80 via-violet-royal to-amber-200 shadow-[0_0_40px_rgba(138,43,226,0.6)] border-2 border-amber-300/70 overflow-hidden bg-black/50 backdrop-blur-md">
                <img 
                  src={content.general?.logoUrl || "/images/logo.png"} 
                  alt="The Violet House Bed & Breakfast Crest" 
                  className="w-full h-full object-cover rounded-full transform transition duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Subtitle / Kicker */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3 sm:mb-5 max-w-full">
              <div className="w-6 sm:w-16 h-px bg-gradient-to-r from-transparent to-white/40"></div>
              <span className="text-violet-royal font-bold tracking-[0.3em] sm:tracking-[0.6em] uppercase text-[9px] sm:text-[11px] whitespace-nowrap">
                {content.hero?.kicker || "The Pinnacle of Maseru"}
              </span>
              <div className="w-6 sm:w-16 h-px bg-gradient-to-l from-transparent to-white/40"></div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-serif leading-[0.88] mb-10 sm:mb-14 font-extralight tracking-tighter text-balance">
              {content.hero?.headlineMain || "Elegance"} <br />
              <span className="italic font-light text-white/60">{content.hero?.headlineItalic || "Perfected."}</span>
            </h1>

            {/* Restored Original Buttons with Responsive Scaling */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mt-4 sm:mt-8">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="cursor-pointer group relative px-10 sm:px-16 md:px-20 py-4 sm:py-6 md:py-7 rounded-full overflow-hidden transition-all duration-700 text-white shadow-[0_0_30px_rgba(138,43,226,0.3)] hover:shadow-[0_0_40px_rgba(138,43,226,0.5)] active:scale-95"
              >
                <div className="absolute inset-0 bg-violet-royal transition-transform duration-700 group-hover:scale-110"></div>
                <span className="relative z-10 font-bold tracking-[0.4em] uppercase text-[9px]">
                  {content.hero?.primaryButtonText || "Reserve Your Experience"}
                </span>
              </button>
              <a 
                href={content.hero?.secondaryButtonLink || "#wellness"}
                className="group flex items-center gap-4 sm:gap-6 text-[9px] font-bold tracking-[0.4em] uppercase hover:text-violet-royal transition-all duration-500 py-3 text-white"
              >
                {content.hero?.secondaryButtonText || "Discover The Sanctuary"}
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-violet-royal transition-colors flex-shrink-0">
                  <ChevronRight className="transform group-hover:translate-x-1 transition-transform duration-500" size={14} />
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="relative mt-4 sm:mt-6 hidden lg:flex flex-col items-center gap-2 pointer-events-none z-10"
        >
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/40">Scroll to explore</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Wellness & Relax Section */}
      <section id="wellness" className="py-48 px-6 bg-charcoal-light scroll-mt-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative z-10 grid grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="aspect-[3/5] rounded-full overflow-hidden mt-20 border border-white/10"
                >
                  <img 
                    src={content.wellness?.poolImage || "/images/image_11.png"} 
                    alt="Pristine Pool Close-up" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="aspect-[3/5] rounded-full overflow-hidden border border-white/10 relative"
                >
                  <video 
                    src="/images/WhatsApp Video 2026-05-17 at 17.38.03.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] tracking-widest uppercase font-bold text-white flex items-center gap-1.5 whitespace-nowrap z-20">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Live Jacuzzi
                  </div>
                </motion.div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-0 pointer-events-none"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="text-violet-royal font-bold tracking-[0.4em] uppercase text-[10px]">
                  {content.wellness?.kicker || "The Art of Living"}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif mb-12 font-extralight leading-tight">
                {content.wellness?.headlineMain || "Pristine Waters &"} <br />
                <span className="italic text-white/40">{content.wellness?.headlineItalic || "Quiet Luxury."}</span>
              </h2>
              
              <p className="text-white/50 leading-relaxed mb-16 text-lg font-light max-w-lg">
                {content.wellness?.description || "Immerse yourself in a world where time slows down. Our pristine pool and private wellness sanctuary are designed for those who appreciate the finer nuances of relaxation."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-violet-royal mb-6 border border-white/10 group-hover:bg-violet-royal group-hover:text-white transition-all duration-500">
                    <Waves size={24} strokeWidth={1} />
                  </div>
                  <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Pool Deck</h4>
                  <p className="text-[10px] tracking-widest text-white/30 uppercase">Tranquil &amp; Serene</p>
                </div>
                <div className="group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-violet-royal mb-6 border border-white/10 group-hover:bg-violet-royal group-hover:text-white transition-all duration-500">
                    <Bath size={24} strokeWidth={1} />
                  </div>
                  <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Private Jacuzzi Tubs</h4>
                  <p className="text-[10px] tracking-widest text-white/30 uppercase">Detox &amp; Restoration</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section id="suites" className="py-48 bg-charcoal scroll-mt-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
            <div className="max-w-2xl">
              <span className="text-violet-royal font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">
                {content.suites?.kicker || "Refined Comfort"}
              </span>
              <h2 className="text-5xl md:text-8xl font-serif font-extralight leading-none">
                {content.suites?.headlineMain || "The Art of"} <br />
                <span className="italic text-white/40">{content.suites?.headlineItalic || "Rest."}</span>
              </h2>
            </div>
            <div className="hidden md:block">
              <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-light writing-vertical-rl rotate-180">Suites &amp; Lounges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {content.suites?.items?.map((suite, index) => (
              <motion.div 
                key={suite.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-[3rem] mb-12 border border-white/5 relative shadow-lg transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(138,43,226,0.15)]">
                  <img src={suite.image} alt={suite.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold">
                    {suite.category}
                  </div>
                </div>
                <div className="px-4">
                  <h3 className="text-3xl font-serif font-light mb-6">{suite.title}</h3>
                  <p className="text-white/40 text-sm font-light leading-relaxed mb-10 max-w-md">
                    {suite.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {suite.specs?.map((tag: string) => (
                      <span key={tag} className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/30 border border-white/10 px-6 py-2 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Dining Section */}
      <section id="events" className="py-48 px-6 bg-charcoal-light overflow-hidden scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-violet-royal font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block">Bespoke Experiences</span>
            <h2 className="text-5xl md:text-8xl font-serif font-extralight leading-none mb-12">Curated <br /><span className="italic text-white/30">Occasions.</span></h2>
            <div className="w-24 h-px bg-violet-royal"></div>
          </div>

          {/* Elegant Horizontal Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-24">
            {[
              { id: 'all', label: 'All Occasions' },
              { id: 'brunch', label: 'Daytime Socials' },
              { id: 'birthday', label: 'Poolside Celebrations' },
              { id: 'dining', label: 'Private Dining' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveEventFilter(tab.id)}
                className={`px-8 py-3 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase border transition-all duration-300 cursor-pointer ${
                  activeEventFilter === tab.id 
                    ? 'bg-violet-royal border-violet-royal text-white shadow-lg shadow-violet-royal/20' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeEventFilter === 'all' ? (
              <motion.div 
                key="all-events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="md:col-span-7 rounded-[3rem] overflow-hidden h-[600px] relative group border border-white/5"
                >
                  <img src="/images/image_6.png" alt="Gourmet Food Platter" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
                    <h4 className="text-2xl font-serif mb-2">Gourmet Catering</h4>
                    <p className="text-[10px] tracking-widest uppercase text-white/60">Exquisite Flavors</p>
                  </div>
                </motion.div>
                
                <div className="md:col-span-5 flex flex-col gap-8">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="rounded-[3rem] overflow-hidden h-[284px] relative group border border-white/5"
                  >
                    <img src="/images/image_7.png" alt="Events at Violet House" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="rounded-[3rem] overflow-hidden h-[284px] relative group border border-white/5"
                  >
                    <img src="/images/image_8.png" alt="Dessert & Wine Table" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeEventFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32"
              >
                {activeEventFilter === 'brunch' && (
                  <div className="md:col-span-2 group">
                    <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[3rem] mb-8 border border-white/5 relative group">
                      <img src="/images/WhatsApp Image 2026-05-17 at 17.36.51.jpeg" alt="Daytime Social Table" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold text-white">
                        Daytime Socials
                      </div>
                    </div>
                    <div className="px-4 text-center max-w-2xl mx-auto">
                      <h3 className="text-3xl font-serif font-light mb-4">Intimate Brunches &amp; Daytime Socials</h3>
                      <p className="text-white/40 text-sm font-light leading-relaxed">
                        Gather under the warm Lesotho sun with styled table layouts, premium finger foods, and elegant daytime hosting.
                      </p>
                    </div>
                  </div>
                )}
                {activeEventFilter === 'birthday' && (
                  <div className="md:col-span-2 group">
                    <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[3rem] mb-8 border border-white/5 relative group">
                      <img src="/images/WhatsApp Image 2026-05-17 at 17.36.52.jpeg" alt="Ladies Toasting by Pool" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold text-white">
                        Bespoke Celebrations
                      </div>
                    </div>
                    <div className="px-4 text-center max-w-2xl mx-auto">
                      <h3 className="text-3xl font-serif font-light mb-4">Bespoke Birthday Celebrations</h3>
                      <p className="text-white/40 text-sm font-light leading-relaxed">
                        Toast to life alongside our pristine pool, blending tranquil water reflections with first-class social vibes.
                      </p>
                    </div>
                  </div>
                )}
                {activeEventFilter === 'dining' && (
                  <>
                    <div className="group">
                      <div className="aspect-square overflow-hidden rounded-[3rem] mb-8 border border-white/5 relative group shadow-lg transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(138,43,226,0.15)]">
                        <img src="/images/WhatsApp Image 2026-05-17 at 17.36.58.jpeg" alt="Private Group Dining" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold text-white">
                          Private Group Dining
                        </div>
                      </div>
                      <div className="px-4">
                        <h3 className="text-2xl font-serif font-light mb-4">In-House Dining</h3>
                        <p className="text-white/40 text-xs font-light leading-relaxed">
                          Celebrate your most intimate group dynamic inside our exquisitely styled private room configurations.
                        </p>
                      </div>
                    </div>
                    <div className="group md:mt-12">
                      <div className="aspect-square overflow-hidden rounded-[3rem] mb-8 border border-white/5 relative group shadow-lg transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(138,43,226,0.15)]">
                        <img src="/images/WhatsApp Image 2026-05-17 at 17.36.59.jpeg" alt="Table Conversations" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold text-white">
                          Bespoke Hospitality
                        </div>
                      </div>
                      <div className="px-4">
                        <h3 className="text-2xl font-serif font-light mb-4">Sophisticated Conversations</h3>
                        <p className="text-white/40 text-xs font-light leading-relaxed">
                          We provide the flawless ambient background for shared culinary stories, laughter, and high-end hosting.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group cursor-pointer overflow-hidden rounded-[4rem] border border-white/5 bg-charcoal">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-12 md:p-24">
                <h3 className="text-4xl md:text-6xl font-serif font-extralight mb-10 leading-tight">
                  {content.events?.headlineMain || "Host Your"} <br />
                  <span className="text-violet-royal italic">{content.events?.headlineItalic || "Legacy Event."}</span>
                </h3>
                <p className="text-white/40 text-lg font-light mb-12 leading-relaxed">
                  {content.events?.description || "From intimate soirées to high-profile corporate retreats, we provide the canvas for your most memorable stories."}
                </p>
                <button 
                  onClick={() => {
                    setBookingForm(prev => ({ ...prev, suite: 'Entire Estate', addOns: { ...prev.addOns, eventSpace: true } }));
                    setIsBookingOpen(true);
                  }}
                  className="cursor-pointer inline-flex items-center gap-6 text-[10px] font-bold tracking-[0.4em] uppercase group-hover:text-violet-royal transition-colors bg-transparent border-none text-white outline-none"
                >
                  Inquire for Events <ChevronRight size={16} />
                </button>
              </div>
              <div className="h-[600px] overflow-hidden">
                <img src={content.events?.image || "/images/image_9.png"} alt="Event Style" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere / Details Section */}
      <section className="py-48 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[4rem] overflow-hidden border border-white/5"
            >
              <img src="/images/image_3.png" alt="Dining Room" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-12 left-12">
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-violet-royal mb-2 block">Culinary Space</span>
                <h4 className="text-3xl font-serif font-light">Intimate Dining</h4>
              </div>
            </motion.div>
            
            <div className="space-y-20">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-md"
              >
                <h3 className="text-4xl font-serif font-light mb-8 leading-tight">The Beauty is in <br /><span className="italic text-white/40">The Details.</span></h3>
                <p className="text-white/40 font-light leading-relaxed">
                  Every corner of The Violet House is a curated experience. From the minimalist shelving to the carefully selected art pieces, we believe luxury is felt in the small things.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5"
              >
                <img src="/images/image_5.png" alt="Interior Details" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gourmet Dining Experience Section */}
      <section id="dining" className="py-48 px-6 bg-[#0B0B0B] scroll-mt-28 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <span className="text-violet-royal font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">
              {content.dining?.kicker || "Gastronomical Sanctuary"}
            </span>
            <h2 className="text-5xl md:text-7xl font-serif font-extralight leading-tight mb-8">
              {content.dining?.headlineMain || "The Gourmet"} <br />
              <span className="italic text-white/40">{content.dining?.headlineItalic || "Dining Experience."}</span>
            </h2>
            <p className="text-white/40 font-light max-w-xl text-sm leading-relaxed mb-12">
              {content.dining?.description || "A course-by-course deep dive into our elite private chef services, presenting culinary craft as a fine art form."}
            </p>
            
            {/* Glassmorphic Course Selector Tab Bar */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              {content.dining?.courses?.map((course) => (
                <button
                  key={course.id || course.name}
                  onClick={() => setActiveCourse(course.name)}
                  className={`relative px-8 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
                    activeCourse === course.name 
                      ? 'bg-violet-royal text-white shadow-lg shadow-violet-royal/20' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>

          {/* Course Details Panel */}
          {(() => {
            const currentSelectedCourse = content.dining?.courses?.find(c => c.name === activeCourse) || content.dining?.courses?.[0];
            if (!currentSelectedCourse) return null;
            return (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCourse}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
                >
                  <div className="lg:col-span-5 space-y-8">
                    <span className="text-violet-royal text-[10px] tracking-[0.3em] uppercase font-bold">{currentSelectedCourse.subtitle}</span>
                    <h3 className="text-4xl font-serif font-light leading-tight">{currentSelectedCourse.title}</h3>
                    <p className="text-white/40 font-light leading-relaxed">
                      {currentSelectedCourse.desc}
                    </p>
                    {currentSelectedCourse.highlights && (
                      <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-white">Highlighted Creations:</h4>
                        <ul className="text-xs text-white/60 space-y-2 font-light">
                          {currentSelectedCourse.highlights.map((h, i) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                      <img 
                        src={currentSelectedCourse.image} 
                        alt={currentSelectedCourse.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div>
                          <span className="text-violet-royal text-[9px] font-bold tracking-[0.3em] uppercase">Private Chef Service</span>
                          <h4 className="text-xl font-serif font-light">{currentSelectedCourse.title}</h4>
                        </div>
                        <span className="text-xs text-white/50 border border-white/20 px-4 py-2 rounded-full uppercase tracking-wider text-[8px] backdrop-blur-sm">Tasting Menu</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })()}

          {/* Interactive Chef Standards Slideshow Showcase */}
          <div className="mt-36 pt-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-violet-royal font-bold tracking-[0.3em] uppercase text-[10px] mb-3 block">Backstage Craftsmanship</span>
                <h3 className="text-3xl md:text-5xl font-serif font-light">Chef Presentation &amp; Preparation</h3>
              </div>
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${activeSlide === idx ? 'w-8 bg-violet-royal' : 'w-2 bg-white/20'}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 bg-black/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img 
                    src={slides[activeSlide].image} 
                    alt={slides[activeSlide].title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-12 left-8 md:left-16 max-w-xl">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-royal mb-2 block">{slides[activeSlide].badge}</span>
                    <h4 className="text-2xl md:text-4xl font-serif font-light mb-4">{slides[activeSlide].title}</h4>
                    <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">{slides[activeSlide].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-48 px-6 bg-charcoal scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <MapPin className="text-violet-royal" size={24} strokeWidth={1} />
                <span className="text-violet-royal font-bold tracking-[0.4em] uppercase text-[10px]">Prime Location</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif font-extralight mb-12 leading-tight">
                The Heart of <br />
                <span className="italic text-white/40">Thetsane.</span>
              </h2>
              
              <p className="text-white/40 text-lg font-light mb-16 leading-relaxed max-w-lg">
                Nestled in Maseru's most prestigious neighborhood, The Violet House provides a serene sanctuary with effortless access to the city's vibrant pulse.
              </p>
              
              <div className="space-y-8">
                {[
                  { label: "Moshoeshoe I Int. Airport", time: "25 Minutes Drive" },
                  { label: "Maseru City Center", time: "10 Minutes Drive" },
                  { label: "Pioneer Mall", time: "8 Minutes Drive" }
                ].map((loc, i) => (
                  <div key={i} className="flex items-center justify-between py-6 border-b border-white/5 group">
                    <span className="text-xs font-light tracking-widest group-hover:text-violet-royal transition-colors">{loc.label}</span>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">{loc.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[4rem] overflow-hidden aspect-square border border-white/10 group"
            >
              <img src="/images/image_0.png" alt="The Violet House Exterior" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
              <div className="absolute bottom-16 left-16">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-royal mb-4 block">The Estate</span>
                <h4 className="text-4xl font-serif font-light">Architectural <br />Excellence.</h4>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sign-off Image */}
      <section className="h-[60vh] relative overflow-hidden">
        <img src="/images/image_4.png" alt="The Violet House Signage" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal-light"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center flex flex-col items-center px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/60 via-violet-royal to-amber-200/60 border border-amber-300/40 shadow-[0_0_30px_rgba(138,43,226,0.5)] overflow-hidden mb-6">
              <img 
                src={content.general?.logoUrl || "/images/logo.png"} 
                alt="The Violet House Crest" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-violet-royal font-bold tracking-[0.8em] sm:tracking-[1em] uppercase text-[10px] mb-4 block">
              {content.general?.siteName || "The Violet House Bed & Breakfast"}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-extralight italic">Awaits Your Arrival.</h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-light pt-48 pb-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-48">
            <div className="lg:col-span-5">
              <div 
                onClick={onSecretTap}
                className="flex items-center gap-6 mb-12 cursor-pointer select-none group"
                title="The Violet House"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-amber-400/40 via-violet-royal to-amber-200/40 border border-amber-300/30 shadow-[0_0_30px_rgba(138,43,226,0.3)] overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                  <img 
                    src={content.general?.logoUrl || "/images/logo.png"} 
                    alt="The Violet House Bed & Breakfast Logo" 
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif tracking-[0.25em] uppercase font-light leading-none">
                    {content.general?.siteName || "The Violet House"}
                  </span>
                  <span className="text-[9px] tracking-[0.4em] uppercase text-amber-300/80 mt-2 font-medium">
                    {content.general?.siteTagline || "Bed & Breakfast • Lesotho"}
                  </span>
                </div>
              </div>
              <p className="text-white/30 italic leading-relaxed text-xl font-light max-w-sm">
                "{content.contact?.quote || "A sanctuary where every detail is a testament to the art of refined living."}"
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-royal mb-10">Navigation</h4>
                <ul className="space-y-6">
                  {navLinks.map(link => (
                    <li key={link.name}>
                      <a href={link.href} className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-royal mb-10">Contact</h4>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
                    <Phone size={14} strokeWidth={1} /> {content.contact?.phone || "+266 6236 9487"}
                  </li>
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
                    <MapPin size={14} strokeWidth={1} /> {content.contact?.address || "Thetsane, Maseru"}
                  </li>
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40 lowercase">
                    <span className="normal-case">{content.contact?.email || "theviolethouseles@gmail.com"}</span>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-royal mb-10">Follow Us</h4>
                <div className="flex gap-6">
                  <a href={content.contact?.instagram || "https://www.instagram.com/theviolethouse.ls"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-violet-royal hover:border-violet-royal transition-all duration-500">
                    <Instagram size={20} strokeWidth={1} />
                  </a>
                  <a href={content.contact?.facebook || "#"} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-violet-royal hover:border-violet-royal transition-all duration-500">
                    <Facebook size={20} strokeWidth={1} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p 
              onClick={onSecretTap}
              className="text-[9px] tracking-[0.4em] uppercase text-white/20 cursor-pointer select-none"
              title="© The Violet House"
            >
              &copy; 2026 {content.general?.siteName || "The Violet House"} Lesotho. All Rights Reserved.
            </p>
            <div className="flex gap-12">
              <a href="#" className="text-[9px] tracking-[0.4em] uppercase text-white/20 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-[9px] tracking-[0.4em] uppercase text-white/20 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* BESPOKE BOOKING INQUIRY MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Glow */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-charcoal-light border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <span className="text-violet-royal text-[9px] font-bold tracking-[0.3em] uppercase block mb-2">Bespoke Hospitality</span>
                <h3 className="text-3xl font-serif font-light text-white">Reserve Your Stay</h3>
                <p className="text-white/40 text-xs mt-2 font-light">Direct connection with our Maseru concierge via WhatsApp.</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Suite Selection */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">Select Accommodation</label>
                  <select 
                    value={bookingForm.suite}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, suite: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase tracking-wider text-white font-medium focus:outline-none focus:border-violet-royal transition-colors cursor-pointer"
                  >
                    <option value="Royal Suite" className="bg-charcoal text-white">Royal Bedroom Suite</option>
                    <option value="Lounge" className="bg-charcoal text-white">Contemporary Lounge Suite</option>
                    <option value="Entire Estate" className="bg-charcoal text-white">Entire Estate (Private Sanctuary)</option>
                  </select>
                </div>

                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">Check-in</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={bookingForm.checkIn}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] uppercase tracking-wider text-white font-medium focus:outline-none focus:border-violet-royal transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">Check-out</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={bookingForm.checkOut}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, checkOut: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] uppercase tracking-wider text-white font-medium focus:outline-none focus:border-violet-royal transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests Selection */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">Guests</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['1', '2', '3', '4', '5+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBookingForm(prev => ({ ...prev, guests: num }))}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all duration-300 cursor-pointer ${
                          bookingForm.guests === num 
                            ? 'bg-violet-royal border-violet-royal text-white shadow-lg' 
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sanctuary Add-ons */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3 block">Wellness Add-ons</label>
                  <div className="space-y-3">
                    {[
                      { key: 'jacuzzi', label: 'Private Jacuzzi tub access' },
                      { key: 'pool', label: 'Pool access' },
                      { key: 'catering', label: 'In-suite Gourmet Catering' },
                      { key: 'eventSpace', label: 'Sanctuary Event Space' }
                    ].map((addon) => (
                      <label 
                        key={addon.key} 
                        className="flex items-center gap-4 bg-white/5 border border-white/5 hover:border-violet-royal/30 p-3 rounded-xl cursor-pointer transition-colors duration-300"
                      >
                        <input 
                          type="checkbox"
                          checked={bookingForm.addOns[addon.key as keyof typeof bookingForm.addOns]}
                          onChange={(e) => setBookingForm(prev => ({
                            ...prev,
                            addOns: {
                              ...prev.addOns,
                              [addon.key]: e.target.checked
                            }
                          }))}
                          className="w-4 h-4 rounded accent-violet-royal cursor-pointer"
                        />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">{addon.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="cursor-pointer w-full mt-4 bg-gradient-to-r from-violet-royal to-[#4B0082] text-white py-4 rounded-xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(138,43,226,0.3)]"
                >
                  Send Inquiry via WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
