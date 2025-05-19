import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import Container from "@/components/ui/Container";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">About DASH</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              DASH is a luxury fashion destination offering the finest curated selection of men's and women's clothing, accessories, and jewelry from world-renowned designers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors" aria-label="Follow us on Linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="text-sm space-y-3">
              <li><Link href="/info/contact" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
              <li><Link href="/info/faqs" className="text-gray-300 hover:text-[#D4AF37] transition-colors">FAQs</Link></li>
              <li><Link href="/info/shipping-returns" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/info/order-tracking" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Order Tracking</Link></li>
              <li><Link href="/info/payment-methods" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Payment Methods</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Information</h3>
            <ul className="text-sm space-y-3">
              <li><Link href="/info/about" className="text-gray-300 hover:text-[#D4AF37] transition-colors">About Us</Link></li>
              <li><Link href="/info/careers" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Careers</Link></li>
              <li><Link href="/info/privacy-policy" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/info/terms" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/info/sustainability" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Sustainability</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-gray-300">1 Brooks Stone Close, GRA, Port Harcourt, Rivers, Nigeria</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-gray-300">+234 123 456 7890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-gray-300">hello@dashng.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-gray-300">Mon-Fri: 9am - 6pm<br />Sat: 10am - 4pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} DASH NG. All rights reserved.</p>
              <p className="mt-1">Built by Pearl-IT Technologies</p>
            </div>
            <div className="flex space-x-4">
              <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/visa.svg" alt="Visa" className="h-6" />
              <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/mastercard.svg" alt="Mastercard" className="h-6" />
              <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/paypal.svg" alt="PayPal" className="h-6" />
              <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/american-express.svg" alt="American Express" className="h-6" />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
