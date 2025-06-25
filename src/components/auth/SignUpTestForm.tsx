import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserPlus, 
  LogIn,
  Mail, 
  Lock, 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Key
} from 'lucide-react';

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['traveler', 'advisor', 'admin', 'supplier', 'influencer', 'agency'], {
    required_error: 'Please select a role'
  })
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

interface AuthResult {
  success: boolean;
  authUser?: any;
  dbUser?: any;
  error?: string;
  step?: 'auth' | 'database';
  mode?: 'signup' | 'signin';
}

interface SavedCredential {
  email: string;
  password: string;
  lastUsed: string;
}

export default function SignUpTestForm() {
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [savedCredentials, setSavedCredentials] = useState<SavedCredential[]>([]);
  const [showSavedCredentials, setShowSavedCredentials] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<SignUpFormData>({
    resolver: zodResolver(isSignUpMode ? signUpSchema : signInSchema)
  });

  const selectedRole = watch('role');
  const currentEmail = watch('email');
  const currentPassword = watch('password');

  // Load saved credentials from localStorage
  const loadSavedCredentials = () => {
    try {
      const saved = localStorage.getItem('savedCredentials');
      if (saved) {
        const credentials = JSON.parse(saved) as SavedCredential[];
        setSavedCredentials(credentials);
        return credentials;
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
    return [];
  };

  // Save credentials to localStorage
  const saveCredentials = (email: string, password: string) => {
    try {
      const existing = loadSavedCredentials();
      const existingIndex = existing.findIndex(cred => cred.email === email);
      
      const newCredential: SavedCredential = {
        email,
        password,
        lastUsed: new Date().toISOString()
      };

      let updatedCredentials;
      if (existingIndex >= 0) {
        // Update existing credential
        updatedCredentials = [...existing];
        updatedCredentials[existingIndex] = newCredential;
      } else {
        // Add new credential
        updatedCredentials = [newCredential, ...existing];
      }

      // Keep only the 5 most recent credentials
      updatedCredentials = updatedCredentials.slice(0, 5);
      
      localStorage.setItem('savedCredentials', JSON.stringify(updatedCredentials));
      setSavedCredentials(updatedCredentials);
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  // Remove specific credential
  const removeCredential = (email: string) => {
    try {
      const existing = loadSavedCredentials();
      const filtered = existing.filter(cred => cred.email !== email);
      localStorage.setItem('savedCredentials', JSON.stringify(filtered));
      setSavedCredentials(filtered);
      
      toast({
        title: "Credential Removed",
        description: `Saved credentials for ${email} have been removed.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error removing credential:', error);
    }
  };

  // Clear all saved credentials
  const clearAllCredentials = () => {
    try {
      localStorage.removeItem('savedCredentials');
      setSavedCredentials([]);
      
      toast({
        title: "All Credentials Cleared",
        description: "All saved credentials have been removed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  };

  // Auto-fill password when email changes
  useEffect(() => {
    if (!isSignUpMode && currentEmail) {
      const credentials = loadSavedCredentials();
      const matchingCredential = credentials.find(cred => cred.email === currentEmail);
      
      if (matchingCredential) {
        setValue('password', matchingCredential.password);
        setRememberMe(true);
        setShowSavedCredentials(false);
      }
    }
  }, [currentEmail, isSignUpMode, setValue]);

  // Load saved credentials on component mount
  useEffect(() => {
    const credentials = loadSavedCredentials();
    if (credentials.length > 0 && !isSignUpMode) {
      // Auto-fill with the most recently used credential
      const mostRecent = credentials[0];
      setValue('email', mostRecent.email);
      setValue('password', mostRecent.password);
      setRememberMe(true);
    }
  }, [isSignUpMode, setValue]);

  // Function to redirect user based on their role
  const redirectUserByRole = (role: string) => {
    console.log('Redirecting user with role:', role);
    
    switch (role) {
      case 'traveler':
        navigate('/explore');
        break;
      case 'advisor':
        navigate('/advisor/dashboard');
        break;
      case 'admin':
        navigate('/advisor/admin/settings');
        break;
      case 'supplier':
      case 'influencer':
      case 'agency':
        navigate('/explore');
        break;
      default:
        console.warn('Unknown role, redirecting to home:', role);
        navigate('/');
        break;
    }
  };

  // Switch between sign-up and sign-in modes
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setAuthResult(null);
    clearErrors();
    reset();
    setRememberMe(false);
    setShowSavedCredentials(false);
    
    // Load saved credentials when switching to sign-in mode
    if (isSignUpMode) {
      const credentials = loadSavedCredentials();
      if (credentials.length > 0) {
        const mostRecent = credentials[0];
        setValue('email', mostRecent.email);
        setValue('password', mostRecent.password);
        setRememberMe(true);
      }
    }
  };

  const onSubmit = async (data: SignUpFormData | SignInFormData) => {
    setIsLoading(true);
    setAuthResult(null);

    try {
      if (isSignUpMode) {
        // Sign-up flow
        const signUpData = data as SignUpFormData;
        console.log('Starting sign-up process with data:', { 
          email: signUpData.email, 
          name: signUpData.name, 
          role: signUpData.role 
        });

        // Step 1: Create auth user with Supabase Auth
        console.log('Step 1: Creating auth user...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: signUpData.email,
          password: signUpData.password,
          options: {
            data: {
              name: signUpData.name,
              role: signUpData.role
            }
          }
        });

        if (authError) {
          console.error('Auth error:', authError);
          setAuthResult({
            success: false,
            error: `Authentication failed: ${authError.message}`,
            step: 'auth',
            mode: 'signup'
          });
          toast({
            title: "Authentication Error",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        if (!authData.user) {
          console.error('No user returned from auth');
          setAuthResult({
            success: false,
            error: 'No user data returned from authentication',
            step: 'auth',
            mode: 'signup'
          });
          toast({
            title: "Authentication Error",
            description: "No user data returned from authentication",
            variant: "destructive"
          });
          return;
        }

        console.log('Auth user created successfully:', authData.user.id);

        // Step 2: Insert user data into our users table
        console.log('Step 2: Inserting user into database...');
        const { data: dbData, error: dbError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: signUpData.email,
            name: signUpData.name,
            role: signUpData.role,
            auth_provider: 'email',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          setAuthResult({
            success: false,
            authUser: authData.user,
            error: `Database insertion failed: ${dbError.message}`,
            step: 'database',
            mode: 'signup'
          });
          toast({
            title: "Database Error",
            description: `User authenticated but database insertion failed: ${dbError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('User inserted into database successfully:', dbData);

        // Success!
        setAuthResult({
          success: true,
          authUser: authData.user,
          dbUser: dbData,
          mode: 'signup'
        });

        toast({
          title: "Sign-up Successful!",
          description: `User ${signUpData.name} created successfully with role: ${signUpData.role}`,
          variant: "default"
        });

        // Redirect user based on their role
        setTimeout(() => {
          redirectUserByRole(signUpData.role);
        }, 2000);

      } else {
        // Sign-in flow
        const signInData = data as SignInFormData;
        console.log('Starting sign-in process with email:', signInData.email);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: signInData.email,
          password: signInData.password
        });

        if (authError) {
          console.error('Sign-in error:', authError);
          
          if (authError.message.toLowerCase().includes('email not confirmed')) {
            setAuthResult({
              success: false,
              error: `Email confirmation required: ${authError.message}`,
              step: 'auth',
              mode: 'signin'
            });
            toast({
              title: "Email Confirmation Required",
              description: "Please check your email inbox for a confirmation link to verify your account before signing in.",
              variant: "destructive"
            });
          } else {
            setAuthResult({
              success: false,
              error: `Sign-in failed: ${authError.message}`,
              step: 'auth',
              mode: 'signin'
            });
            toast({
              title: "Sign-in Error",
              description: authError.message,
              variant: "destructive"
            });
          }
          return;
        }

        if (!authData.user) {
          console.error('No user returned from sign-in');
          setAuthResult({
            success: false,
            error: 'No user data returned from sign-in',
            step: 'auth',
            mode: 'signin'
          });
          toast({
            title: "Sign-in Error",
            description: "No user data returned from sign-in",
            variant: "destructive"
          });
          return;
        }

        console.log('User signed in successfully:', authData.user.id);

        // Handle remember me functionality - save credentials if checked
        if (rememberMe) {
          saveCredentials(signInData.email, signInData.password);
        }

        // Fetch user data from our users table
        const { data: dbData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (dbError) {
          console.error('Database fetch error:', dbError);
          setAuthResult({
            success: false,
            authUser: authData.user,
            error: `Failed to fetch user data: ${dbError.message}`,
            step: 'database',
            mode: 'signin'
          });
          toast({
            title: "Database Error",
            description: `User authenticated but failed to fetch user data: ${dbError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('User data fetched successfully:', dbData);

        // Success!
        setAuthResult({
          success: true,
          authUser: authData.user,
          dbUser: dbData,
          mode: 'signin'
        });

        toast({
          title: "Sign-in Successful!",
          description: `Welcome back, ${dbData.name || authData.user.email}!`,
          variant: "default"
        });

        // Redirect user based on their role
        setTimeout(() => {
          redirectUserByRole(dbData.role);
        }, 1500);
      }

      // Reset form
      reset();

    } catch (error) {
      console.error('Unexpected error during authentication:', error);
      setAuthResult({
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        mode: isSignUpMode ? 'signup' : 'signin'
      });
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'traveler':
        return 'End users who book and plan trips';
      case 'advisor':
        return 'Travel advisors who help plan trips';
      case 'admin':
        return 'System administrators with full access';
      case 'supplier':
        return 'Travel service providers';
      case 'influencer':
        return 'Travel influencers and content creators';
      case 'agency':
        return 'Travel agencies and organizations';
      default:
        return '';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'traveler':
        return 'bg-blue-100 text-blue-800';
      case 'advisor':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supplier':
        return 'bg-purple-100 text-purple-800';
      case 'influencer':
        return 'bg-pink-100 text-pink-800';
      case 'agency':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container-spacing">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-heading font-semibold mb-4">
              {isSignUpMode ? 'Sign-Up Test Form' : 'Sign-In Test Form'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isSignUpMode 
                ? 'Test user registration with Supabase authentication and database integration'
                : 'Test user authentication with existing Supabase accounts'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isSignUpMode ? "default" : "outline"}
                  onClick={() => !isSignUpMode && toggleMode()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
                <div className="text-muted-foreground">or</div>
                <Button
                  variant={!isSignUpMode ? "default" : "outline"}
                  onClick={() => isSignUpMode && toggleMode()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Credentials - Only show in sign-in mode */}
          {!isSignUpMode && savedCredentials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Saved Credentials ({savedCredentials.length})
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSavedCredentials(!showSavedCredentials)}
                    >
                      {showSavedCredentials ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllCredentials}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {showSavedCredentials && (
                <CardContent>
                  <div className="space-y-2">
                    {savedCredentials.map((credential, index) => (
                      <div key={credential.email} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{credential.email}</span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">Most Recent</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last used: {new Date(credential.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setValue('email', credential.email);
                              setValue('password', credential.password);
                              setRememberMe(true);
                            }}
                          >
                            Use
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeCredential(credential.email)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Authentication Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isSignUpMode ? (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create New User Account
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In to Your Account
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field - Only for Sign Up */}
                {isSignUpMode && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isSignUpMode ? "Enter your password (min 6 characters)" : "Enter your password"}
                      {...register('password')}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me Checkbox - Only for Sign In */}
                {!isSignUpMode && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember my email and password
                    </Label>
                  </div>
                )}

                {/* Role Selection - Only for Sign Up */}
                {isSignUpMode && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      User Role
                    </Label>
                    <Select onValueChange={(value) => setValue('role', value as any)}>
                      <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traveler">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Traveler</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="advisor">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Travel Advisor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Administrator</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="supplier">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Supplier</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="influencer">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Influencer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="agency">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Agency</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-600">{errors.role.message}</p>
                    )}
                    {selectedRole && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRoleColor(selectedRole)}>
                          {selectedRole}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getRoleDescription(selectedRole)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isSignUpMode ? (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          {authResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {authResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {authResult.mode === 'signup' ? 'Sign-Up Result' : 'Sign-In Result'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {authResult.success ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Success
                      </Badge>
                      <span className="text-green-700">
                        {authResult.mode === 'signup' 
                          ? 'User account created successfully!' 
                          : 'User signed in successfully!'
                        }
                      </span>
                      {authResult.dbUser?.role && (
                        <Badge className={getRoleColor(authResult.dbUser.role)}>
                          {authResult.dbUser.role}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Redirecting...</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will be redirected to the appropriate page based on your role: {authResult.dbUser?.role || 'unknown'}
                      </p>
                    </div>
                    
                    {authResult.authUser && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Authentication Data:</h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <p><strong>User ID:</strong> {authResult.authUser.id}</p>
                          <p><strong>Email:</strong> {authResult.authUser.email}</p>
                          <p><strong>Created:</strong> {new Date(authResult.authUser.created_at).toLocaleString()}</p>
                          {authResult.authUser.last_sign_in_at && (
                            <p><strong>Last Sign In:</strong> {new Date(authResult.authUser.last_sign_in_at).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {authResult.dbUser && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Database Record:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p><strong>Name:</strong> {authResult.dbUser.name}</p>
                          <p><strong>Role:</strong> {authResult.dbUser.role}</p>
                          <p><strong>Auth Provider:</strong> {authResult.dbUser.auth_provider}</p>
                          {authResult.dbUser.last_login_at && (
                            <p><strong>Last Login:</strong> {new Date(authResult.dbUser.last_login_at).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        Failed
                      </Badge>
                      <span className="text-red-700">
                        {authResult.mode === 'signup' ? 'Sign-up' : 'Sign-in'} failed at {authResult.step || 'unknown'} step
                      </span>
                    </div>
                    
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                      <p className="text-sm text-red-700">{authResult.error}</p>
                    </div>
                    
                    {authResult.authUser && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Partial Success:</h4>
                        <p className="text-sm text-yellow-700">
                          Authentication succeeded but database operation failed. 
                          User ID: {authResult.authUser.id}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">What this form tests:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Sign Up:</strong> Supabase authentication + database insertion</li>
                  <li>• <strong>Sign In:</strong> Supabase authentication + database lookup</li>
                  <li>• Role assignment and validation (sign-up only)</li>
                  <li>• Error handling for both auth and database operations</li>
                  <li>• <strong>Auto-redirect:</strong> Users are redirected based on their role after successful authentication</li>
                  <li>• <strong>Enhanced Remember Me:</strong> Saves email and password combinations locally, auto-fills based on email selection</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Enhanced Remember Me Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Stores up to 5 email/password combinations</li>
                  <li>• Auto-fills password when you type a saved email</li>
                  <li>• Shows saved credentials with management options</li>
                  <li>• Most recently used credential is auto-loaded</li>
                  <li>• Individual credential removal and bulk clear options</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Role-based redirections:</h4>
                <div className="space-y-1 text-sm text-muted-foreground ml-4">
                  <p>• <strong>Traveler:</strong> → /explore (Browse travel inspirations)</p>
                  <p>• <strong>Advisor:</strong> → /advisor/dashboard (Advisor dashboard)</p>
                  <p>• <strong>Admin:</strong> → /advisor/admin/settings (Admin settings page)</p>
                  <p>• <strong>Supplier/Influencer/Agency:</strong> → /explore (General landing)</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Available roles (sign-up only):</h4>
                <div className="flex flex-wrap gap-2">
                  {['traveler', 'advisor', 'admin', 'supplier', 'influencer', 'agency'].map((role) => (
                    <Badge key={role} className={getRoleColor(role)}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This is a test form for development purposes. 
                  Use the toggle above to switch between sign-up and sign-in modes.
                  For sign-in, use credentials from accounts you've previously created.
                  After successful authentication, you'll be automatically redirected to the appropriate page.
                  The enhanced "Remember me\" feature will save your email and password combinations locally for future sign-ins.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}