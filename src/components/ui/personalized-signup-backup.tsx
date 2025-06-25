import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Heart,
  Compass,
  Shield,
  Star,
  Globe,
  Camera,
  Coffee,
  Mountain,
  Waves,
  Plane,
  ChevronRight,
  Check,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Sample data for dynamic content
const destinations = [
  { name: 'Santorini', image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Romantic', 'Sunset'] },
  { name: 'Tokyo', image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Culture', 'Food'] },
  { name: 'Patagonia', image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Adventure', 'Nature'] },
  { name: 'Maldives', image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Luxury', 'Beach'] },
  { name: 'Morocco', image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Culture', 'Desert'] },
  { name: 'Iceland', image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Northern Lights', 'Adventure'] }
];

const travelStyles = [
  { icon: Heart, label: 'Romantic Getaways', description: 'Intimate experiences for couples' },
  { icon: Mountain, label: 'Adventure Travel', description: 'Thrilling outdoor experiences' },
  { icon: Waves, label: 'Beach & Relaxation', description: 'Coastal retreats and spa experiences' },
  { icon: Camera, label: 'Cultural Immersion', description: 'Local traditions and heritage' },
  { icon: Coffee, label: 'Food & Wine', description: 'Culinary journeys and tastings' },
  { icon: Star, label: 'Luxury Travel', description: 'Premium accommodations and services' }
];

const advisorBenefits = [
  'Access to exclusive supplier rates',
  'Advanced trip planning tools',
  'Client management dashboard',
  'Commission tracking system',
  'Marketing support materials',
  'Professional certification programs'
];

const adminFeatures = [
  'Full system administration',
  'User management and permissions',
  'Analytics and reporting tools',
  'Content management system',
  'API access and integrations',
  'Advanced security controls'
];

export default function PersonalizedSignupBackup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<'traveler' | 'advisor' | 'admin' | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: ''
  });

  // Auto-rotate destinations
  const [currentDestination, setCurrentDestination] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { userType, selectedInterests, formData });
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container-spacing py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-2xl font-heading font-semibold">Integrate Travel</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Badge variant="secondary" className="hidden md:flex">
                <Sparkles className="mr-1 h-3 w-3" />
                Beta Access
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container-spacing">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome & User Type Selection */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
              >
                {/* Hero Section */}
                <div className="text-center mb-16 pt-12">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                  >
                    <motion.h1 
                      variants={fadeInUp}
                      className="text-5xl md:text-7xl font-heading font-semibold text-balance leading-tight"
                    >
                      Your Journey
                      <span className="block text-primary">Starts Here</span>
                    </motion.h1>
                    
                    <motion.p 
                      variants={fadeInUp}
                      className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance"
                    >
                      Discover personalized travel experiences crafted by expert advisors, 
                      powered by AI insights, and tailored to your unique preferences.
                    </motion.p>
                  </motion.div>
                </div>

                {/* Dynamic Destination Showcase */}
                <motion.div 
                  variants={fadeInUp}
                  className="mb-16"
                >
                  <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDestination}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={destinations[currentDestination].image}
                          alt={destinations[currentDestination].name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-2">
                            {destinations[currentDestination].name}
                          </h3>
                          <div className="flex gap-2">
                            {destinations[currentDestination].tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* User Type Selection */}
                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid md:grid-cols-3 gap-8 mb-12"
                >
                  {/* Traveler Card */}
                  <motion.div variants={scaleIn}>
                    <Card 
                      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating hover:-translate-y-2 group"
                      onClick={() => {
                        setUserType('traveler');
                        nextStep();
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="relative z-10 text-center pb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                          <Compass className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-heading">I'm a Traveler</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 text-center">
                        <p className="text-muted-foreground mb-6">
                          Discover and book personalized travel experiences with expert guidance
                        </p>
                        <div className="space-y-2 text-sm text-left">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Personalized trip recommendations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Expert advisor matching</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>AI-powered insights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Seamless booking experience</span>
                          </div>
                        </div>
                        <Button className="w-full mt-6 group-hover:bg-primary/90 transition-colors duration-300">
                          Start Exploring
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Advisor Card */}
                  <motion.div variants={scaleIn}>
                    <Card 
                      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating hover:-translate-y-2 group"
                      onClick={() => {
                        setUserType('advisor');
                        nextStep();
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="relative z-10 text-center pb-4">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                          <Users className="h-8 w-8 text-accent" />
                        </div>
                        <CardTitle className="text-2xl font-heading">I'm an Advisor</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 text-center">
                        <p className="text-muted-foreground mb-6">
                          Join our network of travel professionals and grow your business
                        </p>
                        <div className="space-y-2 text-sm text-left">
                          {advisorBenefits.slice(0, 4).map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-accent" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-6 bg-accent hover:bg-accent/90 transition-colors duration-300">
                          Join as Advisor
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Admin Card */}
                  <motion.div variants={scaleIn}>
                    <Card 
                      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating hover:-translate-y-2 group"
                      onClick={() => {
                        setUserType('admin');
                        nextStep();
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="relative z-10 text-center pb-4">
                        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors duration-300">
                          <Shield className="h-8 w-8 text-secondary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-heading">Admin Access</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 text-center">
                        <p className="text-muted-foreground mb-6">
                          Manage the platform with comprehensive administrative tools
                        </p>
                        <div className="space-y-2 text-sm text-left">
                          {adminFeatures.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-secondary-foreground" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-6 border-secondary-foreground text-secondary-foreground hover:bg-secondary/20 transition-colors duration-300"
                        >
                          Admin Access
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  variants={fadeInUp}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-4">Trusted by travelers worldwide</p>
                  <div className="flex items-center justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="text-sm font-medium">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">50K+ Travelers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">150+ Destinations</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Interest Selection (for travelers) */}
            {currentStep === 1 && userType === 'traveler' && (
              <motion.div
                key="step-1-traveler"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto pt-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-semibold mb-4">
                    What inspires your wanderlust?
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Select your travel interests to get personalized recommendations
                  </p>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                  {travelStyles.map((style, index) => {
                    const IconComponent = style.icon;
                    const isSelected = selectedInterests.includes(style.label);
                    
                    return (
                      <motion.div
                        key={style.label}
                        variants={scaleIn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'ring-2 ring-primary bg-primary/5 shadow-soft-lg' 
                              : 'hover:shadow-soft hover:-translate-y-1'
                          }`}
                          onClick={() => handleInterestToggle(style.label)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <IconComponent className="h-8 w-8" />
                            </div>
                            <h3 className="font-heading font-semibold mb-2">{style.label}</h3>
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-3"
                              >
                                <Badge className="bg-primary text-primary-foreground">
                                  <Check className="mr-1 h-3 w-3" />
                                  Selected
                                </Badge>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={selectedInterests.length === 0}
                    className="min-w-32"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Professional Info (for advisors) */}
            {currentStep === 1 && userType === 'advisor' && (
              <motion.div
                key="step-1-advisor"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto pt-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-semibold mb-4">
                    Tell us about your expertise
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Help us understand your background and specializations
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="advisor-name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="advisor-name"
                              placeholder="Your full name"
                              className="pl-10"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="advisor-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="advisor-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="advisor-phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="advisor-phone"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="advisor-company">Company/Agency</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="advisor-company"
                              placeholder="Your company name"
                              className="pl-10"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="advisor-experience">Years of Experience</Label>
                        <Input
                          id="advisor-experience"
                          placeholder="e.g., 5 years"
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email}
                    className="min-w-32"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Admin Verification (for admins) */}
            {currentStep === 1 && userType === 'admin' && (
              <motion.div
                key="step-1-admin"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto pt-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-semibold mb-4">
                    Admin Access Request
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Please provide your credentials for verification
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="admin-name"
                            placeholder="Your full name"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@company.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <h4 className="font-medium mb-1">Admin Access Notice</h4>
                            <p className="text-sm text-muted-foreground">
                              Admin access requires approval from our team. You'll receive an email 
                              with further instructions within 24 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email}
                    className="min-w-32"
                  >
                    Request Access
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Final Details & Confirmation */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto pt-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-semibold mb-4">
                    {userType === 'traveler' && 'Complete Your Profile'}
                    {userType === 'advisor' && 'Review Your Information'}
                    {userType === 'admin' && 'Confirm Admin Request'}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {userType === 'traveler' && 'Just a few more details to personalize your experience'}
                    {userType === 'advisor' && 'Verify your details before joining our network'}
                    {userType === 'admin' && 'Review your admin access request details'}
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    {userType === 'traveler' && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="traveler-name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="traveler-name"
                                placeholder="Your full name"
                                className="pl-10"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="traveler-email">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="traveler-email"
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Your Selected Interests</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedInterests.map((interest) => (
                              <Badge key={interest} className="bg-primary/10 text-primary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {(userType === 'advisor' || userType === 'admin') && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium">Name:</span>
                            <span>{formData.name}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{formData.email}</span>
                          </div>
                          {userType === 'advisor' && (
                            <>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="font-medium">Phone:</span>
                                <span>{formData.phone}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="font-medium">Company:</span>
                                <span>{formData.company}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between">
                                <span className="font-medium">Experience:</span>
                                <span>{formData.experience}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="min-w-32 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {userType === 'traveler' && 'Start My Journey'}
                    {userType === 'advisor' && 'Join Network'}
                    {userType === 'admin' && 'Submit Request'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="container-spacing py-8 mt-16">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Integrate Travel. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}