'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Star, Phone, Mail } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

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
    <section className="py-20 bg-gradient-light relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-6xl mb-4">💇‍♀️</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-gradient-pink">Professional</span> Hair Services
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'var(--gradient-pink)' }}></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Let our expert stylists transform your look with professional extension application, 
            color matching, and maintenance services. Book your appointment today!
          </p>
        </div>

        {!showBooking ? (
          <>
            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => (
                <div 
                  key={service.name}
                  className="card-pink p-6 text-center group hover-lift"
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
                  
                  <button 
                    onClick={() => setShowBooking(true)}
                    className="btn-primary w-full group-hover:scale-105 transition-transform"
                  >
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    Book Now
                  </button>
                </div>
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

                <div className="pt-6">
                  <button 
                    onClick={() => setShowBooking(true)}
                    className="btn-primary text-lg px-8 py-4 mr-4"
                  >
                    <Calendar className="h-5 w-5 mr-2 inline" />
                    Book Appointment
                  </button>
                  
                  <a 
                    href="tel:+61212345678"
                    className="btn-secondary text-lg px-8 py-4"
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
                      <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>
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
              <button 
                onClick={() => setShowBooking(false)}
                className="btn-ghost"
              >
                ← Back to Services
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;