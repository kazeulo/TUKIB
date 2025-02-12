import React, { useState } from 'react';
import Header from './partials/Header';
import Footer from './partials/Footer';

const ServicePage = ({ 
  title,
  subtitle,
  description,
  additionalInfo,
  prices,
  steps 
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <span className="inline-flex mb-6 px-4 py-1 rounded-full text-sm font-semibold bg-white/20 text-white hover:bg-white/30 w-fit">
            RRC Services
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'how-to-avail', label: 'How to Avail' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-4 font-medium transition-colors border-b-2 ${
                  activeSection === section.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {activeSection === 'overview' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  {description.map((para, idx) => (
                    <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                      {para}
                    </p>
                  ))}
                  {additionalInfo && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-blue-700">{additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'pricing' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <div className="grid gap-4">
                    {prices.map((price, idx) => (
                      <div
                        key={idx}
                        className="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {price.service}
                            </h3>
                            <p className="text-2xl font-bold text-indigo-600">
                              {price.range}
                            </p>
                            {price.notes && (
                              <p className="text-sm text-gray-500">{price.notes}</p>
                            )}
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'how-to-avail' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <div className="space-y-8">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center font-semibold transition-colors">
                          {idx + 1}
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-600 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600">rrc.upvisayas@up.edu.ph</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600">Mon-Fri: 8:00 AM - 5:00 PM</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Request Service
                </button>
              </div>
            </div>

            {/* Important Notice Card */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Important Notice</h3>
                <div className="space-y-3">
                  {[
                    'Advance booking required',
                    'Payment must be made at UPV Cash Office',
                    'Please bring valid ID'
                  ].map((notice, idx) => (
                    <div key={idx} className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{notice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicePage;