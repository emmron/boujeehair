import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Ponytails', href: '#ponytails' },
    { name: 'Accessories', href: '#accessories' },
    { name: 'Hair Care', href: '#haircare' },
    { name: "Clip-In's", href: '#clipins' },
  ];

  const customerService = [
    { name: 'Contact Us', href: '#contact' },
    { name: 'Shipping Info', href: '#shipping' },
    { name: 'Returns', href: '#returns' },
    { name: 'Size Guide', href: '#sizing' },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">Bad &</span>
              <span className="accent-pink"> Boujee</span>
              <span className="text-white"> Hair</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Premium hair extensions and accessories for the modern woman. 
              Quality products with affordable pricing and low maintenance.
            </p>
            <div className="flex space-x-4">
              <a href="https://m.facebook.com/100070077697400" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/bad.andboujeehair/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:accent-pink transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:accent-pink transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 accent-pink" />
              <span>monique@badboujeehair.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 accent-pink" />
              <span>Contact via Instagram</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 accent-pink" />
              <span>Australia</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Bad & Boujee Hair. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;