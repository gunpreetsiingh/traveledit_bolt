import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, Users, Star, ArrowRight, Globe, Calendar, Heart } from 'lucide-react';

interface PersonalizedSignupProps {
  onSubmit: (userType: string) => void;
}

export default function PersonalizedSignup({ onSubmit }: PersonalizedSignupProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    experience: '',
    specialization: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onSubmit(selectedType);
    }
  };

  const userTypes = [
    {
      id: 'traveler',
      title: 'Traveler',
      description: 'Discover personalized travel experiences',
      icon: MapPin,
      features: ['Curated recommendations', 'Personal travel advisor', 'Exclusive experiences'],
      color: 'bg-primary'
    },
    {
      id: 'advisor',
      title: 'Travel Advisor',
      description: 'Connect with clients and create amazing journeys',
      icon: Users,
      features: ['Client management', 'Trip planning tools', 'Commission tracking'],
      color: 'bg-accent'
    },
    {
      id: 'supplier',
      title: 'Supplier',
      description: 'Showcase your services to travel professionals',
      icon: Star,
      features: ['Service listings', 'Booking management', 'Partner network'],
      color: 'bg-secondary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full bg-secondary"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-primary"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-full p-3 mr-4">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground">
              Integrate Travel
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where extraordinary journeys begin. Connect with expert advisors, discover unique experiences, 
            and create memories that last a lifetime.
          </p>
        </div>

        {!selectedType ? (
          /* User Type Selection */
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {userTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={type.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-floating hover:-translate-y-2 border-2 hover:border-primary/30 group"
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`${type.color} rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-heading">{type.title}</CardTitle>
                    <CardDescription className="text-base">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 btn-pill group-hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Registration Form */
          <Card className="max-w-2xl mx-auto shadow-floating">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading">
                Join as {userTypes.find(t => t.id === selectedType)?.title}
              </CardTitle>
              <CardDescription>
                Create your account to start your journey with Integrate Travel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {selectedType === 'advisor' && (
                  <Tabs defaultValue="experience" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="specialization">Specialization</TabsTrigger>
                    </TabsList>
                    <TabsContent value="experience" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Agency</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Your travel agency or company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="e.g., 5 years"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="specialization" className="space-y-4">
                      <div className="space-y-3">
                        <Label>Travel Specializations</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Luxury Travel', 'Adventure', 'Family Trips', 'Business Travel', 'Honeymoons', 'Group Tours'].map((spec) => (
                            <Badge 
                              key={spec}
                              variant="secondary" 
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {selectedType === 'traveler' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Travel Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Cultural Experiences', 'Adventure Sports', 'Relaxation', 'Food & Wine', 'Photography', 'Wildlife'].map((interest) => (
                          <Badge 
                            key={interest}
                            variant="secondary" 
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedType('')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 btn-pill">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Already have an account? 
            <Button variant="link" className="text-primary hover:text-accent p-0 ml-1">
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}