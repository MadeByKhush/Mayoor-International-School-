import React from "react";
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card-light pt-16 pb-8" id="contact">
      <div className="container mx-auto px-6">

        {/* Top Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Brand / Contact Section */}
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-[2rem] font-bold text-primary">
                Mayoor International School
              </span>
            </div>

            <p className="mt-4 text-sm text-text-light-secondary">
              Committed to excellence in education and character development.
            </p>


            <div className="mt-6 md:mt-16">
              <h3 className="font-bold text-text-light-primary mb-4">Contact Us</h3>
              <ul className="mt-5 space-y-4 text-sm text-text-light-secondary">
                <li className="flex items-start">
                  <MapPin size={20} className="mr-3 text-primary mt-0.5 shrink-0" />
                  <span>Sector 8 KBHB, Jodhpur (Raj.), 342005</span>
                </li>

                <li className="flex items-center">
                  <Phone size={20} className="mr-3 text-primary shrink-0" />
                  <span>+91 9166929992</span>
                </li>

                <li className="flex items-center">
                  <Mail size={20} className="mr-3 text-primary shrink-0" />
                  <span>mayoorinternationalschool@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MAP SECTION */}
          <div>
            <h3 className="font-bold text-text-light-primary mb-4">Our Location</h3>

            <div className="w-full h-64 md:h-72 rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <iframe
                title="School Location"
                src="https://maps.google.com/maps?q=Mayoor%20International%20School,%20Jodhpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-text-light-secondary">
          <p>© 2026 Mayoor International School. All Rights Reserved.</p>

          <div className="flex items-center space-x-5 mt-4 sm:mt-0">
            <a href="https://www.facebook.com/profile.php?id=100064094377046" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
              <Facebook size={24} />
            </a>
            <a href="https://www.youtube.com/@mayoorinternationalschoolj5474" aria-label="YouTube" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
              <Youtube size={24} />
            </a>
            <a href="https://www.instagram.com/mayoor_international_school/" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <Instagram size={24} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
