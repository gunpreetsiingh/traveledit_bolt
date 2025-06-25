import React, { useState } from 'react';
import { Chrome } from 'lucide-react';

interface PersonalizedSignupProps {
  onSubmit?: (userType: string) => void;
}

const PersonalizedSignup: React.FC<PersonalizedSignupProps> = ({ onSubmit }) => {
  const [selectedUserType, setSelectedUserType] = useState<string>('');

  const handleUserTypeSelect = (type: string) => {
    setSelectedUserType(type);
  };

  const handleGoogleSignIn = () => {
    if (onSubmit) {
      onSubmit(selectedUserType);
    }
    console.log('Google sign-in with user type:', selectedUserType);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://unsplash.com/photos/low-angle-photography-of-two-men-playing-beside-two-women-UmV2wr-Vbq8"
          alt="Two couples playing outdoors"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Need Help Link */}
      <div className="absolute top-6 right-6 z-10">
        <a href="#" className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors">
          <span className="text-orange-400">●</span>
          Need help?
        </a>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-end pr-8 lg:pr-16">
        <div className="w-full max-w-md">
          {/* Signup Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {/* User Type Selection */}
            <div className="mb-8">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => handleUserTypeSelect('traveler')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedUserType === 'traveler'
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I'm a Traveler
                </button>
                <button
                  onClick={() => handleUserTypeSelect('advisor')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedUserType === 'advisor'
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I'm an Advisor
                </button>
              </div>

              <div className="text-xs text-gray-500 mb-6">
                Your hub for automated client profiling
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Get a Personalized link to share with your clients.
              </h1>

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Create your LegendsDNA profile and account to streamline your client 
                  interactions, effortlessly qualifying their preferences and uncovering new 
                  revenue opportunities. This tool not only captures and organizes client data 
                  and bookings but also enhances your ability to tailor travel experiences 
                  precisely to their tastes.
                </p>
                
                <p>
                  Sign-in with Google to automate the process to experience the magic of your 
                  past hotel and flight bookings being imported automatically.
                </p>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors mb-6"
            >
              <Chrome size={20} className="text-white" />
              Sign in with Google
            </button>

            {/* Footer Text */}
            <div className="text-center text-sm text-gray-500">
              Already have an Account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                Login Here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSignup;