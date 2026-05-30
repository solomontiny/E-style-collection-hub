import { Link } from "react-router-dom";
import { MessageCircle, MapPin } from "lucide-react";

const CATEGORIES = [
  { label: "Dresses", cat: "dresses" },
  { label: "Outerwear", cat: "outerwear" },
  { label: "Bags", cat: "bags" },
  { label: "Shoes", cat: "shoes" },
  { label: "Tops", cat: "tops" },
  { label: "Bottoms", cat: "bottoms" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Customer Service" },
  { to: "/shop", label: "Collections" },
];

const WHATSAPP_NUMBER = "2348081759542";
const WHATSAPP_MESSAGE =
  "Hello E Style Collection! I would like to inquire about your products.";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* BRAND */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-xl font-display font-medium tracking-[0.2em] uppercase text-white"
            >
              E Style Collection
            </Link>

            <p className="mt-5 text-sm font-light leading-relaxed max-w-xs">
              Curating exceptional fashion for the discerning individual. Where
              artistry meets elegance.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                WHATSAPP_MESSAGE
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-[11px] tracking-[0.12em] uppercase font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((item) => (
                <li key={item.cat}>
                  <Link
                    to={`/shop?category=${item.cat}`}
                    className="text-sm font-light hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm font-light hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="text-sm font-light leading-relaxed">
                5 Path Akachukwu Drive, Majek, Lekki–Epe Expressway, Lagos
              </li>
              <li>
                <a
                  href="tel:+2348081759542"
                  className="text-sm font-light hover:text-white transition-colors duration-300"
                >
                  +234 808 175 9542
                </a>
              </li>
              <li>
                <a
                  href="mailto:Meggieakenn@gmail.com"
                  className="text-sm font-light hover:text-white transition-colors duration-300"
                >
                  Meggieakenn@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-12">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-stone-500" />
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-semibold">
            Find Us
          </h4>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800/50 aspect-[21/7] sm:aspect-[21/5]">
          <iframe
            title="E Style Collection Store Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.55!3d6.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjcnMDAuMCJOIDPCsDMzJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 180 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="text-[12px] text-stone-500 font-light mt-3">
          5 Path Akachukwu Drive, Majek, Lekki–Epe Expressway, Lagos
        </p>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-stone-800/60">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-light tracking-wider text-stone-500">
            &copy; {new Date().getFullYear()} E Style Collection. All rights
            reserved.
          </p>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map((item) => (
              <button
                key={item}
                className="text-[11px] font-light tracking-wider text-stone-500 hover:text-stone-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}