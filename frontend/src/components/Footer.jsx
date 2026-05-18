import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold text-primary">Other Countries</p>
          <div className="flex space-x-3 mt-1 text-xs">
            <span>Indonesia</span>
            <span>-</span>
            <span>Pakistan</span>
            <span>-</span>
            <span>South Africa</span>
          </div>
        </div>
        <div>
          <p>Free Classifieds in India. © 2006-2026 OLX</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
