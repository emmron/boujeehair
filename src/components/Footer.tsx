import { Facebook, Instagram, Mail, Phone, MapPin, Heart, Star, Sparkles } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Ponytails', href: '#ponytails', icon: '💁‍♀️' },
    { name: 'Accessories', href: '#accessories', icon: '👑' },
    { name: 'Hair Care', href: '#haircare', icon: '💆‍♀️' },
    { name: "Clip-In's", href: '#clipins', icon: '✨' },
  ];

  const customerService = [
    { name: 'Contact Us', href: '#contact', icon: '💬' },
    { name: 'Shipping Info', href: '#shipping', icon: '🚚' },
    { name: 'Returns', href: '#returns', icon: '🔄' },
    { name: 'Size Guide', href: '#sizing', icon: '📏' },
  ];

  const features = [
    { text: 'Free Shipping Over $100', icon: '🚚' },
    { text: 'Premium Quality Hair', icon: '⭐' },
    { text: '30-Day Returns', icon: '🔄' },
    { text: 'Australian Owned', icon: '🇦🇺' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-pink-500/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Banner */}
        <div className="mb-12 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-sm border border-pink-500/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={feature.text} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>{feature.icon}</div>
                <p className="text-sm text-gray-300 font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2 animate-fade-in">
            <div className="group">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 interactive-scale">
                <span className="text-white">Bad &</span>
                <span className="text-gradient-pink bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient"> Boujee</span>
                <span className="text-white"> Hair</span>
                <Sparkles className="inline-block ml-2 h-6 w-6 text-pink-400 animate-pulse-pink" />
              </h3>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-pink transition-all duration-500 mb-4"></div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Premium hair extensions and accessories for the modern woman. 
              Quality products with affordable pricing and low maintenance. ✨
            </p>
            <div className="flex space-x-4">
              <a href="https://m.facebook.com/100070077697400" target="_blank" rel="noopener noreferrer" 
                 className="group p-3 bg-white/10 hover:bg-pink-500/20 rounded-full transition-all duration-300 interactive-scale hover:shadow-pink">
                <Facebook className="h-6 w-6 text-gray-300 group-hover:text-pink-400 group-hover:animate-wobble transition-colors" />
              </a>
              <a href="https://www.instagram.com/bad.andboujeehair/" target="_blank" rel="noopener noreferrer" 
                 className="group p-3 bg-white/10 hover:bg-purple-500/20 rounded-full transition-all duration-300 interactive-scale hover:shadow-pink">
                <Instagram className="h-6 w-6 text-gray-300 group-hover:text-purple-400 group-hover:animate-wobble transition-colors" />
              </a>
              <div className="group p-3 bg-white/10 hover:bg-red-500/20 rounded-full transition-all duration-300 interactive-scale hover:shadow-pink">
                <Heart className="h-6 w-6 text-gray-300 group-hover:text-red-400 group-hover:animate-scale-bounce transition-colors" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-left">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 text-pink-400 mr-2 animate-pulse-pink" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-pink-400 transition-all duration-300 interactive-scale"
                  >
                    <span className="mr-2 group-hover:animate-bounce">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-slide-in-right">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 text-purple-400 mr-2 animate-scale-bounce" />
              Customer Service
            </h4>
            <ul className="space-y-3">
              {customerService.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-purple-400 transition-all duration-300 interactive-scale"
                  >
                    <span className="mr-2 group-hover:animate-bounce">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-pink-500/20">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-sm border border-pink-500/20">
            <h4 className="text-white font-semibold mb-4 text-center flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-pink-400 mr-2 animate-rotate-slow" />
              Get In Touch
              <Sparkles className="h-5 w-5 text-purple-400 ml-2 animate-rotate-slow" />
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center md:justify-start group">
                <div className="p-2 bg-pink-500/20 rounded-full mr-3 group-hover:animate-pulse-pink">
                  <Mail className="h-4 w-4 text-pink-400 group-hover:animate-wobble" />
                </div>
                <span className="text-gray-300 group-hover:text-pink-400 transition-colors">monique@badboujeehair.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start group">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3 group-hover:animate-pulse-pink">
                  <Phone className="h-4 w-4 text-purple-400 group-hover:animate-wobble" />
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">Contact via Instagram 📱</span>
              </div>
              <div className="flex items-center justify-center md:justify-start group">
                <div className="p-2 bg-green-500/20 rounded-full mr-3 group-hover:animate-pulse-pink">
                  <MapPin className="h-4 w-4 text-green-400 group-hover:animate-wobble" />
                </div>
                <span className="text-gray-300 group-hover:text-green-400 transition-colors">Australia 🇦🇺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-pink-500/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            © 2025 Bad & Boujee Hair. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Made with <Heart className="inline h-4 w-4 text-red-400 animate-scale-bounce" /> in Australia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;