'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingCalendarProps {
  productName: string;
}

const BookingCalendar = ({ productName }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-AU', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          available: Math.random() > 0.3 // 70% availability simulation
        });
      }
    }
    
    return dates;
  };

  const availableDates = generateDates();

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const services = [
    {
      id: 'application',
      name: 'Professional Application',
      duration: '60 mins',
      price: '$80',
      description: 'Expert application of your extensions with styling'
    },
    {
      id: 'consultation',
      name: 'Color Matching Consultation',
      duration: '30 mins',
      price: '$40',
      description: 'Find the perfect color match for your hair'
    },
    {
      id: 'maintenance',
      name: 'Extension Maintenance',
      duration: '45 mins',
      price: '$60',
      description: 'Professional cleaning and restyling'
    },
    {
      id: 'removal',
      name: 'Safe Removal Service',
      duration: '30 mins',
      price: '$50',
      description: 'Gentle removal without damage to natural hair'
    }
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate booking API call
    toast.success('Booking confirmed! We\'ll send you a confirmation email shortly. 📅', {
      style: {
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600'
      },
      duration: 4000,
    });

    // Reset form
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    setCustomerInfo({ name: '', email: '', phone: '', notes: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="bg-gradient-pink text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Book Professional Service</h2>
        <p className="opacity-90">for {productName}</p>
      </div>

      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                step <= bookingStep 
                  ? 'bg-primary-pink text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {step < bookingStep ? <Check className="h-5 w-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < bookingStep ? 'bg-primary-pink' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {bookingStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Service</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    selectedService === service.id
                      ? 'border-primary-pink bg-light-pink'
                      : 'border-gray-200 hover:border-primary-pink'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                    <span className="text-primary-pink font-bold">{service.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => selectedService && setBookingStep(2)}
                disabled={!selectedService}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Date
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {bookingStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Date</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {availableDates.slice(0, 18).map((dateOption) => (
                <button
                  key={dateOption.date}
                  onClick={() => dateOption.available && setSelectedDate(dateOption.date)}
                  disabled={!dateOption.available}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedDate === dateOption.date
                      ? 'bg-primary-pink text-white'
                      : dateOption.available
                        ? 'bg-gray-50 hover:bg-light-pink text-gray-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {dateOption.display}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setBookingStep(1)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                onClick={() => selectedDate && setBookingStep(3)}
                disabled={!selectedDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Time
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {bookingStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Time</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((time) => {
                const available = Math.random() > 0.4; // 60% availability simulation
                return (
                  <button
                    key={time}
                    onClick={() => available && setSelectedTime(time)}
                    disabled={!available}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTime === time
                        ? 'bg-primary-pink text-white'
                        : available
                          ? 'bg-gray-50 hover:bg-light-pink text-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setBookingStep(2)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                onClick={() => selectedTime && setBookingStep(4)}
                disabled={!selectedTime}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Your Details
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Customer Information */}
        {bookingStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h3>
            
            {/* Booking Summary */}
            <div className="bg-gradient-light rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-primary-pink">{services.find(s => s.id === selectedService)?.price}</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white border-2 border-primary-pink rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-pink mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Salon Location</h4>
                  <p className="text-gray-600 text-sm">123 Beauty Street, Sydney NSW 2000</p>
                  <p className="text-gray-600 text-sm">Free parking available</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setBookingStep(3)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                className="btn-primary"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;