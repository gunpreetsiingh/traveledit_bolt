import { useState, useEffect } from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { supabase } from '@/lib/supabaseClient';
import { generateConversationId } from '@/lib/utils';
import FeasibilityChecker from '@/components/chat/FeasibilityChecker';
import ChatFeed from '@/components/chat/ChatFeed';
import ChatRightSidebar from '@/components/chat/ChatRightSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  AlertCircle, 
  RefreshCw,
  UserCheck,
  ArrowRight,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  profile_image_url: string | null;
}

export default function ChatPage() {
  const { user: currentUser, loading: userLoading } = useSupabaseUser();
  const { toast } = useToast();
  const [currentDbUser, setCurrentDbUser] = useState<UserDetails | null>(null);
  const [otherUser, setOtherUser] = useState<UserDetails | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Copy conversation ID to clipboard
  const copyConversationId = async () => {
    if (conversationId) {
      try {
        await navigator.clipboard.writeText(conversationId);
        toast({
          title: "Copied!",
          description: "Conversation ID copied to clipboard",
          variant: "default"
        });
      } catch (err) {
        console.error('Failed to copy conversation ID:', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy conversation ID to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  // Fetch other user and set up conversation
  const setupConversation = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Setting up conversation for user:', currentUser.id);

      // First, get the current user's data from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, role, advisor_id, name, email, profile_image_url')
        .eq('id', currentUser.id)
        .single();

      if (userError) {
        console.error('Error fetching current user data:', userError);
        setError('Failed to fetch user data');
        return;
      }

      console.log('Current user data from database:', userData);
      setCurrentDbUser(userData);

      let targetUser: UserDetails | null = null;

      // If the current user is a traveler and has an assigned advisor
      if (userData.role === 'traveler' && userData.advisor_id) {
        console.log('User is a traveler with assigned advisor:', userData.advisor_id);
        
        // Verify the advisor exists and is actually an advisor
        const { data: advisorData, error: advisorError } = await supabase
          .from('users')
          .select('id, name, email, role, profile_image_url')
          .eq('id', userData.advisor_id)
          .eq('role', 'advisor')
          .single();

        if (!advisorError && advisorData) {
          console.log('Found assigned advisor:', advisorData);
          targetUser = advisorData;
        } else {
          console.log('Assigned advisor not found or not an advisor, falling back to any advisor');
        }
      }

      // If the current user is an advisor, find a traveler to chat with (for testing)
      if (userData.role === 'advisor') {
        console.log('User is an advisor, finding a traveler to chat with');
        
        const { data: travelerData, error: travelerError } = await supabase
          .from('users')
          .select('id, name, email, role, profile_image_url')
          .eq('role', 'traveler')
          .limit(1);

        if (!travelerError && travelerData && travelerData.length > 0) {
          console.log('Found traveler for advisor to chat with:', travelerData[0]);
          targetUser = travelerData[0];
        } else {
          console.log('No traveler found, using self-chat');
          targetUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            profile_image_url: userData.profile_image_url
          };
        }
      }

      // Fallback: find any advisor in the system
      if (!targetUser) {
        console.log('Falling back to finding any advisor in the system');
        const { data: fallbackAdvisor, error: fallbackError } = await supabase
          .from('users')
          .select('id, name, email, role, profile_image_url')
          .eq('role', 'advisor')
          .limit(1);

        if (!fallbackError && fallbackAdvisor && fallbackAdvisor.length > 0) {
          console.log('Found fallback advisor:', fallbackAdvisor[0]);
          targetUser = fallbackAdvisor[0];
        } else {
          console.log('No advisor found in the system, using self-chat');
          targetUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            profile_image_url: userData.profile_image_url
          };
        }
      }

      // Generate consistent conversation ID using the utility function
      const convId = generateConversationId(currentUser.id, targetUser.id);
      
      setOtherUser(targetUser);
      setConversationId(convId);

      console.log('Conversation setup complete:', {
        currentDbUser: userData,
        otherUser: targetUser,
        conversationId: convId
      });

    } catch (err) {
      console.error('Error setting up conversation:', err);
      setError('Failed to set up conversation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      setupConversation();
    }
  }, [currentUser, userLoading]);

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Setting up chat...</h3>
          <p className="text-muted-foreground">
            {userLoading ? 'Loading user data...' : 'Preparing conversation...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center pt-20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Chat Setup Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={setupConversation} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="h-screen bg-background flex items-center justify-center pt-20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to access the chat feature.
            </p>
            <Button onClick={() => window.location.href = '/signup-test'} className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex pt-20">
      {/* Left Sidebar - Feasibility & Pricing Checker */}
      <div className="w-80 border-r bg-card p-4">
        <FeasibilityChecker />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Status Bar - Display User Information */}
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="space-y-2">
            {/* Current User Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  You are
                </Badge>
                <span className="font-medium">
                  {currentDbUser?.name || currentDbUser?.email || 'Unknown User'}
                </span>
                {currentDbUser?.role && (
                  <Badge variant="outline" className="text-xs">
                    {currentDbUser.role}
                  </Badge>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={setupConversation}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Other User Display */}
            {otherUser && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Chatting with
                </Badge>
                <span className="font-medium">
                  {otherUser.name || otherUser.email || 'Unknown User'}
                </span>
                {otherUser.role && (
                  <Badge variant="outline" className="text-xs">
                    {otherUser.role}
                  </Badge>
                )}
              </div>
            )}

            {/* Conversation ID Display */}
            {conversationId && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Conversation ID
                </Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {conversationId}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copyConversationId}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Feed */}
        <ChatFeed 
          currentUser={currentDbUser}
          otherUser={otherUser}
          conversationId={conversationId || undefined}
        />
      </div>

      {/* Right Sidebar - System Activity, Action Items, Inspiration */}
      <div className="w-80 border-l bg-card p-4">
        <ChatRightSidebar />
      </div>
    </div>
  );
}