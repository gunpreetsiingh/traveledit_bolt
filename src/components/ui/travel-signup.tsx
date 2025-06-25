'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome, Twitter, Plane } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
}

interface BeachBackgroundProps {
    imageUrl: string;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface SocialButtonProps {
    icon: React.ReactNode;
    name: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-12 pr-4 py-4 bg-white/90 border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-lg backdrop-blur-sm text-lg"
            />
        </div>
    );
};

// SocialButton Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
    return (
        <button className="flex items-center justify-center p-4 bg-white/90 border border-white/30 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm">
            {icon}
        </button>
    );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-12 h-6 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`absolute inset-0 rounded-full transition-colors duration-300 ease-in-out ${checked ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-slate-300'}`}>
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md ${checked ? 'transform translate-x-6' : ''}`} />
            </div>
        </div>
    );
};

// BeachBackground Component
const BeachBackground: React.FC<BeachBackgroundProps> = ({ imageUrl }) => {
    return (
        <div className="fixed inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-cyan-300/20 to-blue-600/40 z-10" />
            <img
                src={imageUrl}
                alt="Beautiful beach background"
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    );
};

// Main SignUpForm Component
const SignUpForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit(email, password, remember);
        setIsSubmitting(false);
        setIsSuccess(false);
    };

    return (
        <div className="p-10 rounded-3xl backdrop-blur-lg bg-white/85 border border-white/40 shadow-2xl shadow-blue-500/20 max-w-md w-full">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-3 relative group">
                    <span className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-teal-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></span>
                    <span className="relative inline-block text-4xl font-bold text-slate-800">
                        TravelEdit
                    </span>
                </h2>
                <p className="text-slate-600 flex flex-col items-center space-y-2">
                    <span className="relative group cursor-default">
                        <span className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative inline-block text-lg">Your next adventure begins here</span>
                    </span>
                    <span className="text-sm text-slate-500">
                        Join thousands of travelers worldwide
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                    icon={<Mail size={20} />}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <FormInput
                        icon={<Lock size={20} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div onClick={() => setRemember(!remember)} className="cursor-pointer">
                            <ToggleSwitch
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                id="remember-me"
                            />
                        </div>
                        <label
                            htmlFor="remember-me"
                            className="text-sm text-slate-600 cursor-pointer hover:text-slate-800 transition-colors"
                            onClick={() => setRemember(!remember)}
                        >
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl ${isSuccess
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                        } text-white font-medium text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50`}
                >
                    {isSubmitting ? 'Creating Account...' : 'Start Your Journey'}
                </button>
            </form>

            <div className="mt-8">
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-300 absolute w-full"></div>
                    <div className="bg-white/90 px-4 relative text-slate-500 text-sm">
                        or continue with
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <SocialButton icon={<Chrome size={20} />} name="Google" />
                    <SocialButton icon={<Twitter size={20} />} name="Twitter" />
                    <SocialButton icon={<Plane size={20} />} name="Booking" />
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Sign In
                </a>
            </p>
        </div>
    );
};

// Main TravelSignUpPage Component
export const TravelSignUpPage: React.FC = () => {
    const handleSignUp = (email: string, password: string, remember: boolean) => {
        console.log('Sign up attempt:', { email, password, remember });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <BeachBackground imageUrl="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            
            {/* Centered signup form */}
            <div className="relative z-20 flex items-center justify-center w-full h-full p-6">
                <SignUpForm onSubmit={handleSignUp} />
            </div>

            <footer className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm z-20 drop-shadow-lg">
                © 2025 TravelEdit. Explore the world with us.
            </footer>
        </div>
    );
};

export default TravelSignUpPage;