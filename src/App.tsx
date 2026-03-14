/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  Mountain, 
  Flame, 
  BedDouble,
  Menu,
  X,
  Calendar,
  Utensils,
  Coffee,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WHATSAPP_LINK = "https://wa.me/26662369487?text=Hello%20The%20Violet%20House,%20I%20would%20like%20to%20inquire%20about%20a%20booking.";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Wellness', href: '#wellness' },
    { name: 'Suites', href: '#suites' },
    { name: 'Events', href: '#events' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#8A2BE2]/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8A2BE2] to-[#4B0082] rounded-full flex items-center justify-center font-serif text-2xl font-light border border-white/20 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif tracking-[0.3em] uppercase font-light leading-none">The Violet House</span>
              <span className="text-[8px] tracking-[0.5em] uppercase text-[#8A2BE2] mt-1 font-bold">Lesotho</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[10px] font-medium tracking-[0.3em] uppercase hover:text-[#8A2BE2] transition-all duration-500 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#8A2BE2] transition-all duration-500 group-hover:w-full"></span>
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden px-8 py-3 rounded-full border border-[#8A2BE2] text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#8A2BE2] hover:shadow-[0_0_30px_rgba(138,43,226,0.4)]"
            >
              <span className="relative z-10">Inquire Now</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-[#111] border-b border-white/5 p-6 flex flex-col gap-4 md:hidden"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-serif tracking-widest uppercase py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8A2BE2] w-full py-4 rounded-xl text-center font-bold tracking-widest uppercase mt-4 shadow-lg shadow-[#8A2BE2]/20"
              >
                Book Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/image_10.png" 
            alt="Luxury Lifestyle at The Violet House" 
            className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
          
          {/* Atmospheric Glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-[#8A2BE2]/10 to-transparent opacity-40"></div>
          <div className="absolute top-1/4 -left-20 w-[800px] h-[800px] bg-[#8A2BE2]/5 blur-[180px] rounded-full"></div>
          <div className="absolute bottom-1/4 -right-20 w-[800px] h-[800px] bg-[#4B0082]/5 blur-[180px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-6 mb-12">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/30"></div>
                <span className="text-[#8A2BE2] font-medium tracking-[0.8em] uppercase text-[9px]">The Pinnacle of Maseru</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/30"></div>
              </div>
              
              <h1 className="text-7xl md:text-[140px] font-serif leading-[0.85] mb-16 font-extralight tracking-tighter">
                Elegance <br />
                <span className="italic font-light text-white/60">Perfected.</span>
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mt-20">
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-20 py-7 rounded-full overflow-hidden transition-all duration-700"
                >
                  <div className="absolute inset-0 bg-[#8A2BE2] transition-transform duration-700 group-hover:scale-110"></div>
                  <span className="relative z-10 font-bold tracking-[0.4em] uppercase text-[9px]">Reserve Your Experience</span>
                </a>
                <a 
                  href="#wellness"
                  className="group flex items-center gap-6 text-[9px] font-bold tracking-[0.4em] uppercase hover:text-[#8A2BE2] transition-all duration-500"
                >
                  Discover The Sanctuary
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8A2BE2] transition-colors">
                    <ChevronRight className="transform group-hover:translate-x-1 transition-transform duration-500" size={14} />
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] tracking-[0.5em] uppercase text-white/20">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Wellness & Relax Section */}
      <section id="wellness" className="py-48 px-6 bg-[#050505]">
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
                  <img src="/images/image_11.png" alt="Pristine Pool Close-up" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="aspect-[3/5] rounded-full overflow-hidden border border-white/10"
                >
                  <img src="/images/image_12.png" alt="Model by the Pool" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </div>
              
              {/* Decorative Element */}
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
                <span className="text-[#8A2BE2] font-bold tracking-[0.4em] uppercase text-[10px]">The Art of Living</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif mb-12 font-extralight leading-tight">
                Pristine Waters & <br />
                <span className="italic text-white/40">Quiet Luxury.</span>
              </h2>
              
              <p className="text-white/50 leading-relaxed mb-16 text-lg font-light max-w-lg">
                Immerse yourself in a world where time slows down. Our heated pool and private wellness sanctuary are designed for those who appreciate the finer nuances of relaxation.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-[#8A2BE2] mb-6 border border-white/10 group-hover:bg-[#8A2BE2] group-hover:text-white transition-all duration-500">
                    <Waves size={24} strokeWidth={1} />
                  </div>
                  <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Heated Infinity Pool</h4>
                  <p className="text-[10px] tracking-widest text-white/30 uppercase">Temperature Controlled</p>
                </div>
                <div className="group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-[#8A2BE2] mb-6 border border-white/10 group-hover:bg-[#8A2BE2] group-hover:text-white transition-all duration-500">
                    <Flame size={24} strokeWidth={1} />
                  </div>
                  <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Private Sauna</h4>
                  <p className="text-[10px] tracking-widest text-white/30 uppercase">Detox & Restoration</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section id="suites" className="py-48 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
            <div className="max-w-2xl">
              <span className="text-[#8A2BE2] font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Refined Comfort</span>
              <h2 className="text-5xl md:text-8xl font-serif font-extralight leading-none">The Art of <br /><span className="italic text-white/40">Rest.</span></h2>
            </div>
            <div className="hidden md:block">
              <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-light writing-vertical-rl rotate-180">Suites & Lounges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="aspect-[16/11] overflow-hidden rounded-[3rem] mb-12 border border-white/5 relative">
                <img src="/images/image_2.png" alt="Luxury Suite" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold">
                  Royal Suite
                </div>
              </div>
              <div className="px-4">
                <h3 className="text-3xl font-serif font-light mb-6">Signature Elegance</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed mb-10 max-w-md">
                  Our signature white checkered headboards and bespoke furnishings create an atmosphere of unparalleled sophistication.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["King Bed", "Smart Home", "Mini Bar"].map(tag => (
                    <span key={tag} className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/30 border border-white/10 px-6 py-2 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group md:mt-32"
            >
              <div className="aspect-[16/11] overflow-hidden rounded-[3rem] mb-12 border border-white/5 relative">
                <img src="/images/image_1.png" alt="Entertainment Lounge" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase font-bold">
                  Lounge
                </div>
              </div>
              <div className="px-4">
                <h3 className="text-3xl font-serif font-light mb-6">The Living Space</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed mb-10 max-w-md">
                  Plush grey textures and iconic designer seating provide the perfect backdrop for your most intimate conversations.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Designer Decor", "Climate Control", "Concierge"].map(tag => (
                    <span key={tag} className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/30 border border-white/10 px-6 py-2 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events & Dining Section */}
      <section id="events" className="py-48 px-6 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-32">
            <span className="text-[#8A2BE2] font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block">Bespoke Experiences</span>
            <h2 className="text-5xl md:text-8xl font-serif font-extralight leading-none mb-12">Curated <br /><span className="italic text-white/30">Occasions.</span></h2>
            <div className="w-24 h-px bg-[#8A2BE2]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
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
          </div>

          <div className="relative group cursor-pointer overflow-hidden rounded-[4rem] border border-white/5 bg-[#0a0a0a]">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-12 md:p-24">
                <h3 className="text-4xl md:text-6xl font-serif font-extralight mb-10 leading-tight">Host Your <br /><span className="text-[#8A2BE2] italic">Legacy Event.</span></h3>
                <p className="text-white/40 text-lg font-light mb-12 leading-relaxed">
                  From intimate soirées to high-profile corporate retreats, we provide the canvas for your most memorable stories.
                </p>
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-6 text-[10px] font-bold tracking-[0.4em] uppercase group-hover:text-[#8A2BE2] transition-colors"
                >
                  Inquire for Events <ChevronRight size={16} />
                </a>
              </div>
              <div className="h-[600px] overflow-hidden">
                <img src="/images/image_9.png" alt="Event Style" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere / Details Section */}
      <section className="py-48 px-6 bg-[#0a0a0a]">
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
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#8A2BE2] mb-2 block">Culinary Space</span>
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

      {/* Amenities Grid */}
      <section className="py-48 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <span className="text-[#8A2BE2] font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Experience</span>
            <h2 className="text-5xl font-serif font-extralight">World-Class Amenities</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden">
            {[
              { icon: <Wifi strokeWidth={1} />, label: "Fiber Wi-Fi", desc: "Ultra-fast connectivity" },
              { icon: <Wind strokeWidth={1} />, label: "Climate Control", desc: "Personalized comfort" },
              { icon: <ShieldCheck strokeWidth={1} />, label: "24/7 Security", desc: "Peace of mind" },
              { icon: <Car strokeWidth={1} />, label: "Private Parking", desc: "Secure & accessible" },
              { icon: <Utensils strokeWidth={1} />, label: "Gourmet Dining", desc: "Bespoke culinary" },
              { icon: <Coffee strokeWidth={1} />, label: "Premium Coffee", desc: "Artisanal blends" },
              { icon: <Flame strokeWidth={1} />, label: "Private Sauna", desc: "Deep restoration" },
              { icon: <Waves strokeWidth={1} />, label: "Heated Pool", desc: "Year-round leisure" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] p-12 flex flex-col items-center text-center group hover:bg-[#8A2BE2]/5 transition-colors duration-700">
                <div className="text-[#8A2BE2] mb-8 transform group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{item.label}</h4>
                <p className="text-[9px] tracking-widest text-white/20 uppercase font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-48 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <MapPin className="text-[#8A2BE2]" size={24} strokeWidth={1} />
                <span className="text-[#8A2BE2] font-bold tracking-[0.4em] uppercase text-[10px]">Prime Location</span>
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
                    <span className="text-xs font-light tracking-widest group-hover:text-[#8A2BE2] transition-colors">{loc.label}</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-16 left-16">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8A2BE2] mb-4 block">The Estate</span>
                <h4 className="text-4xl font-serif font-light">Architectural <br />Excellence.</h4>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sign-off Image */}
      <section className="h-[60vh] relative overflow-hidden">
        <img src="/images/image_4.png" alt="The Violet House Signage" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#050505]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-[#8A2BE2] font-bold tracking-[1em] uppercase text-[10px] mb-6 block">The Violet House</span>
            <h2 className="text-4xl md:text-6xl font-serif font-extralight italic">Awaits Your Arrival.</h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-48 pb-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-48">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8A2BE2] to-[#4B0082] rounded-full flex items-center justify-center font-serif text-3xl font-light border border-white/20">
                  V
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif tracking-[0.3em] uppercase font-light leading-none">The Violet House</span>
                  <span className="text-[10px] tracking-[0.5em] uppercase text-[#8A2BE2] mt-2 font-bold">Lesotho</span>
                </div>
              </div>
              <p className="text-white/30 italic leading-relaxed text-xl font-light max-w-sm">
                "A sanctuary where every detail is a testament to the art of refined living."
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8A2BE2] mb-10">Navigation</h4>
                <ul className="space-y-6">
                  {navLinks.map(link => (
                    <li key={link.name}>
                      <a href={link.href} className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8A2BE2] mb-10">Contact</h4>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
                    <Phone size={14} strokeWidth={1} /> +266 6236 9487
                  </li>
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
                    <MapPin size={14} strokeWidth={1} /> Thetsane, Maseru
                  </li>
                  <li className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/40 lowercase">
                    <span className="normal-case">theviolethouseles@gmail.com</span>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8A2BE2] mb-10">Follow Us</h4>
                <div className="flex gap-6">
                  <a href="https://www.instagram.com/theviolethouse.ls" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#8A2BE2] hover:border-[#8A2BE2] transition-all duration-500">
                    <Instagram size={20} strokeWidth={1} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#8A2BE2] hover:border-[#8A2BE2] transition-all duration-500">
                    <Facebook size={20} strokeWidth={1} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/20">&copy; 2026 The Violet House Lesotho. All Rights Reserved.</p>
            <div className="flex gap-12">
              <a href="#" className="text-[9px] tracking-[0.4em] uppercase text-white/20 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-[9px] tracking-[0.4em] uppercase text-white/20 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite alternate ease-in-out;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}
