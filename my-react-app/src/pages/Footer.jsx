import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaHeart } from "react-icons/fa";

export default function Footer() {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Truth Life</h2>
          <p className="text-sm leading-6">
            A supportive community focused on mental health, personal growth,
            and research-driven development for the young generation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Community</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">

            {/* Help Center */}
            <li className="relative">
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => {
                  setShowHelpPopup(!showHelpPopup);
                  setShowPrivacyPopup(false);
                  setShowTermsPopup(false);
                }}
              >
                Help Center
              </span>

              {showHelpPopup && (
                <div className="absolute top-6 left-0 w-56 bg-white text-gray-900 rounded-lg shadow-lg p-4 z-20">
                  <h4 className="font-semibold mb-2">Contact Us</h4>
                  <p className="text-sm mb-1">📞 +91 9876543210</p>
                  <p className="text-sm">✉️ info@lovenzea.online</p>
                </div>
              )}
            </li>

            {/* Privacy Policy */}
            <li className="relative">
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => {
                  setShowPrivacyPopup(!showPrivacyPopup);
                  setShowHelpPopup(false);
                  setShowTermsPopup(false);
                }}
              >
                Privacy Policy
              </span>

              {showPrivacyPopup && (
                <div className="absolute top-6 left-0 w-64 bg-white text-gray-900 rounded-lg shadow-lg p-4 z-20">
                  <h4 className="font-semibold mb-2">Privacy Policy</h4>
                  <p className="text-sm">
                    1) We collect only basic details like name and email for login and support.
                    Your information is kept safe and never shared with third parties.
                      <br> 
                      </br>
                    2) Truth Life respects your privacy.
                    Your data is used only to improve your experience and stays fully secure with us.
                  </p>
                </div>
              )}
            </li>

            {/* Terms & Conditions */}
            <li className="relative">
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => {
                  setShowTermsPopup(!showTermsPopup);
                  setShowHelpPopup(false);
                  setShowPrivacyPopup(false);
                }}
              >
                Terms & Conditions
              </span>

              {showTermsPopup && (
                <div className="absolute top-6 left-0 w-64 bg-white text-gray-900 rounded-lg shadow-lg p-4 z-20">
                  <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                  <p className="text-sm">
                    By using this website, you agree to our terms. This is a
                    placeholder content which you can update later.
                  </p>
                </div>
              )}
            </li>

          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <span className="p-3 bg-gray-800 rounded-full hover:bg-indigo-600 cursor-pointer">
              <FaFacebookF />
            </span>
            <span className="p-3 bg-gray-800 rounded-full hover:bg-indigo-600 cursor-pointer">
              <FaInstagram />
            </span>
            <span className="p-3 bg-gray-800 rounded-full hover:bg-indigo-600 cursor-pointer">
              <FaTwitter />
            </span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        Made with <FaHeart className="inline text-red-500 mx-1" /> by Punarmilan Team © {new Date().getFullYear()}
      </div>
    </footer>
  );
}