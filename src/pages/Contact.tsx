import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '2348081759542';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px]">
      <section className="relative h-[35vh] sm:h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920')` }}
        >
          <div className="absolute inset-0 bg-stone-950/60" />
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <p className="section-label text-stone-300 mb-3">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">Contact Us</h1>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="section-label mb-5">Reach Out</p>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-stone-900 tracking-tight leading-[1.15]">
                We would love
                <br />
                <span className="italic font-normal">to hear from you</span>
              </h2>
              <p className="mt-6 text-stone-500 font-light leading-[1.8] text-[15px] max-w-md">
                Whether you have a question about our collections, need styling advice, or simply want to share your
                experience, our team is here for you.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { icon: MapPin, label: 'Visit Us', value: '12 Rue du Faubourg, Paris 75008' },
                  { icon: Phone, label: 'Call Us', value: '+33 1 42 68 53 00' },
                  { icon: Mail, label: 'Email Us', value: 'concierge@eclection.com' },
                  { icon: Clock, label: 'Opening Hours', value: 'Mon — Sat: 10:00 — 19:00' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-stone-50 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} strokeWidth={1.5} className="text-stone-400" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1 font-semibold">{item.label}</p>
                      <p className="text-[14px] text-stone-600 font-light">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eclection! I would like to get in touch.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.12em] uppercase font-medium text-emerald-600 border border-emerald-200 px-5 py-3 hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>

            <div>
              {submitted ? (
                <div className="bg-stone-50 p-12 sm:p-16 text-center animate-scale-in">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="text-emerald-700 text-xl">&#10003;</span>
                  </div>
                  <p className="text-stone-900 font-medium text-lg">Thank you for reaching out.</p>
                  <p className="text-stone-500 font-light text-sm mt-2">We will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">First Name</label>
                      <input type="text" required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Last Name</label>
                      <input type="text" required className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Email</label>
                    <input type="email" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Subject</label>
                    <select className="input-field bg-white">
                      <option>General Inquiry</option>
                      <option>Styling Advice</option>
                      <option>Order Support</option>
                      <option>Returns & Exchanges</option>
                      <option>Press & Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Message</label>
                    <textarea rows={5} required className="input-field resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-2">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
