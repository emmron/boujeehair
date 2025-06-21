'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Star, Phone, Mail, Heart } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';

const BookingSection = () => {
  const [showBooking, setShowBooking] = useState(false);

  const services = [
    {
      name: 'Professional Application',
      price: '$80',
      duration: '60 mins',
      description: 'Expert application of extensions with styling',
      rating: 4.9,
      reviews: 127
    },
    {
      name: 'Color Matching Consultation',
      price: '$40',
      duration: '30 mins',
      description: 'Find the perfect color match',
      rating: 4.8,
      reviews: 89
    },
    {
      name: 'Extension Maintenance',
      price: '$60',
      duration: '45 mins',
      description: 'Professional cleaning and restyling',
      rating: 4.9,
      reviews: 156
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "The professional application was amazing! My extensions look so natural and the team was incredible.",
      rating: 5,
      service: "Professional Application"
    },
    {
      name: "Jessica L.",
      text: "Perfect color match! They took the time to get it exactly right. So happy with the results!",
      rating: 5,
      service: "Color Consultation"
    },
    {
      name: "Emma K.",
      text: "Best salon experience ever. The team really understands busy moms and makes it so easy!",
      rating: 5,
      service: "Extension Maintenance"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-10 animate-float" style={{ background: 'var(--gradient-pink)' }}></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-15 animate-float" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-5 animate-float" style={{ background: 'var(--gradient-pink)', animationDelay: '4s' }}></div>
      </div>
      
      {/* Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-32 left-20 text-pink-300 opacity-40 animate-bounce-gentle h-6 w-6" />
        <Star className="absolute bottom-32 right-24 text-purple-300 opacity-30 animate-float h-5 w-5" style={{ animationDelay: '1s' }} />
        <Heart className="absolute top-40 right-32 text-pink-400 opacity-35 animate-bounce-gentle h-7 w-7" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-gentle">💇‍♀️</div>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="text-gradient-pink animate-gradient">Professional</span> <span className="text-gradient-purple">Hair Services</span>
          </h2>
          <div className="w-32 h-2 mx-auto mb-8 rounded-full animate-gradient" style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%)', backgroundSize: '200% 100%' }}></div>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            Let our expert stylists transform your look with professional extension application, 
            color matching, and maintenance services. Book your appointment today!
          </p>
        </div>

        {!showBooking ? (
          <>
            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => (
                <Card
                  key={service.name}
                  variant="glass"
                  className="p-6 text-center group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary-pink mb-1">{service.price}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(service.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{service.rating} ({service.reviews} reviews)</span>
                  </div>
                  
                  <Button 
                    onClick={() => setShowBooking(true)}
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    Book Now
                  </Button>
                </Card>
              ))}
            </div>

            {/* Salon Info & CTA */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Salon Information */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Visit Our <span className="text-gradient-pink">Premium Salon</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary-pink mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Location</h4>
                      <p className="text-gray-600">123 Beauty Street, Sydney NSW 2000</p>
                      <p className="text-sm text-gray-500">Free parking available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary-pink mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Hours</h4>
                      <p className="text-gray-600">Mon-Sat: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary-pink mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Contact</h4>
                      <p className="text-gray-600">(02) 1234 5678</p>
                      <p className="text-gray-600">Same day bookings available</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setShowBooking(true)}
                    size="lg"
                    className="px-8"
                  >
                    <Calendar className="h-5 w-5 mr-2 inline" />
                    Book Appointment
                  </Button>
                  
                  <a 
                    href="tel:+61212345678"
                    className="inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-pink-600 border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-pink-500 px-8 py-4 text-lg"
                  >
                    <Phone className="h-5 w-5 mr-2 inline" />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Customer Testimonials */}
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  What Our <span className="text-gradient-pink">Clients Say</span>
                </h3>
                
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={testimonial.name}
                      className="bg-white rounded-xl p-5 shadow-soft hover:shadow-pink transition-all duration-300"
                      style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{testimonial.service}</span>
                      </div>
                      <p className="text-gray-700 mb-3 italic">&ldquo;{testimonial.text}&rdquo;</p>
                      <div className="font-semibold text-primary-pink">{testimonial.name}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-pink rounded-xl text-white text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm opacity-90">Happy Customers</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <BookingCalendar productName="Professional Hair Services" />
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => setShowBooking(false)}
                variant="ghost"
              >
                ← Back to Services
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;