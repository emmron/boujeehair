import { Clock, DollarSign, Heart, Star } from 'lucide-react';

const TargetMarket = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 accent-pink" />,
      title: 'For Busy Mothers',
      description: 'Quick and easy styling solutions for women on the go'
    },
    {
      icon: <DollarSign className="h-8 w-8 accent-pink" />,
      title: 'Affordable Quality',
      description: 'Premium hair extensions at prices that won\'t break the bank'
    },
    {
      icon: <Heart className="h-8 w-8 accent-pink" />,
      title: 'Low Maintenance',
      description: 'Beautiful hair without the daily hassle and time commitment'
    },
    {
      icon: <Star className="h-8 w-8 accent-pink" />,
      title: 'Premium Quality',
      description: 'High-quality products that look and feel natural'
    }
  ];

  return (
    <section id="about" className="py-16 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Target Market
          </h2>
          <div className="w-24 h-1 bg-accent-pink mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Because Quality & INCHES MATTER! We&apos;re committed to making hair extensions affordable for everyone. 
            Premium ponytails and accessories designed for busy mamas who deserve to look fabulous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#121212] rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Why Choose Bad & Boujee Hair?
          </h3>
          <p className="text-lg text-gray-300 mb-6 max-w-4xl mx-auto">
            We understand that busy mamas need hair solutions that fit their lifestyle. 
            That&apos;s why we&apos;ve created a range of premium ponytails, clip-ins, and hair care products 
            that are both affordable and low maintenance - perfect for women who want 
            to look fabulous without spending hours on their hair. Because every mama deserves to feel confident!
          </p>
          <button className="bg-accent-pink hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default TargetMarket;