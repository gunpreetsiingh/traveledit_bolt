import { useEffect, useState } from 'react';
import { supabase, testConnection, getTableList, User } from '@/lib/supabaseClient';
import { generateConversationId } from '@/lib/utils';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Database, RefreshCw, Users, Eye, LogOut, User as UserIcon, MessageSquare, Plus, Trash2, UserCheck } from 'lucide-react';

interface TableStatus {
  table: string;
  accessible: boolean;
  count?: number;
  error?: string;
}

export default function ProfilePage() {
  const { user: currentUser, loading: userLoading } = useSupabaseUser();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    error?: any;
    data?: any;
  } | null>(null);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [addingDummyData, setAddingDummyData] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const fetchAdvisorId = async () => {
    try {
      console.log('Fetching advisor ID...');
      
      if (!currentUser) {
        console.log('No current user, cannot fetch advisor');
        setAdvisorId(null);
        return;
      }

      // First, get the current user's data from the users table to check their advisor_id and role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, role, advisor_id, name, email')
        .eq('id', currentUser.id)
        .single();

      if (userError) {
        console.error('Error fetching current user data:', userError);
        setAdvisorId(null);
        return;
      }

      console.log('Current user data from database:', userData);

      // If the current user is a traveler and has an assigned advisor
      if (userData.role === 'traveler' && userData.advisor_id) {
        console.log('User is a traveler with assigned advisor:', userData.advisor_id);
        
        // Verify the advisor exists and is actually an advisor
        const { data: advisorData, error: advisorError } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', userData.advisor_id)
          .eq('role', 'advisor')
          .single();

        if (advisorError) {
          console.error('Error fetching assigned advisor:', advisorError);
          console.log('Assigned advisor not found or not an advisor, falling back to any advisor');
        } else {
          console.log('Found assigned advisor:', advisorData);
          setAdvisorId(advisorData.id);
          return;
        }
      }

      // If the current user is an advisor, use themselves as the recipient for testing
      if (userData.role === 'advisor') {
        console.log('User is an advisor, using self as recipient for testing');
        setAdvisorId(userData.id);
        return;
      }

      // Fallback: find any advisor in the system
      console.log('Falling back to finding any advisor in the system');
      const { data: fallbackAdvisor, error: fallbackError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'advisor')
        .limit(1);

      if (fallbackError) {
        console.error('Error fetching fallback advisor:', fallbackError);
        setAdvisorId(null);
        return;
      }

      if (fallbackAdvisor && fallbackAdvisor.length > 0) {
        console.log('Found fallback advisor:', fallbackAdvisor[0]);
        setAdvisorId(fallbackAdvisor[0].id);
      } else {
        console.log('No advisor found in the system');
        setAdvisorId(null);
      }

    } catch (err) {
      console.error('Error fetching advisor:', err);
      setAdvisorId(null);
    }
  };

  const fetchAllUsers = async () => {
    setFetchingUsers(true);
    
    try {
      console.log('Fetching all users...');
      
      // Clear previous data
      setUsers([]);
      setAllUsers([]);
      
      // Try different approaches to get users data
      const approaches = [
        // Approach 1: Simple select all
        () => supabase.from('users').select('*'),
        
        // Approach 2: Select with specific columns
        () => supabase.from('users').select('id, name, email, role, created_at, auth_provider, google_id, advisor_id'),
        
        // Approach 3: Select with limit
        () => supabase.from('users').select('*').limit(100),
        
        // Approach 4: Count only first, then fetch data
        async () => {
          const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
          console.log(`Found ${count} users, now fetching data...`);
          return await supabase.from('users').select('*');
        }
      ];

      let success = false;
      
      for (let i = 0; i < approaches.length; i++) {
        try {
          console.log(`Trying approach ${i + 1}...`);
          const result = await approaches[i]();
          const { data, error, count } = result;
          
          if (error) {
            console.error(`Approach ${i + 1} error:`, error);
            continue;
          }
          
          console.log(`Approach ${i + 1} success:`, { 
            dataLength: data?.length, 
            count, 
            sampleData: data?.slice(0, 2) 
          });
          
          if (data && data.length > 0) {
            setAllUsers(data);
            setUsers(data.slice(0, 5)); // Show first 5 for preview
            setLastFetchTime(new Date());
            success = true;
            break;
          } else if (data && data.length === 0) {
            console.log('Users table is empty');
            setAllUsers([]);
            setUsers([]);
            setLastFetchTime(new Date());
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Approach ${i + 1} exception:`, err);
        }
      }
      
      if (!success) {
        console.error('All approaches failed to fetch users');
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const addDummyChatMessages = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add dummy chat messages.",
        variant: "destructive"
      });
      return;
    }

    setAddingDummyData(true);

    try {
      console.log('Adding dummy chat messages for user:', currentUser.id);
      console.log('Using advisor ID:', advisorId);

      // Use advisor as recipient if available, otherwise use current user (self-chat)
      const recipientId = advisorId || currentUser.id;
      
      // Use the consistent conversation ID generation function
      const conversationId = generateConversationId(currentUser.id, recipientId);

      // Create dummy messages with varied content types
      // Note: Include unique IDs for each message to satisfy the NOT NULL constraint
      // DO NOT include 'text' field as it's a generated column
      const dummyMessages = [
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'text',
          content: {
            text: "Hi! I'm excited to start planning my dream vacation to Greece!",
            type: 'text'
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: 'dummy_data',
          is_deleted: false
        },
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'text',
          content: {
            text: "I've been dreaming about visiting Santorini and seeing those famous sunsets!",
            type: 'text'
          },
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
          source: 'dummy_data',
          is_deleted: false
        },
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'link',
          content: {
            text: "I found this amazing hotel in Oia that I'd love to stay at!",
            type: 'link',
            metadata: {
              url: 'https://example.com/santorini-hotel',
              title: 'Luxury Cave Hotel in Oia',
              description: 'Experience the magic of Santorini in this stunning cave hotel with caldera views',
              image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
              location: 'Oia, Santorini',
              tags: ['luxury', 'cave-hotel', 'caldera-view', 'romantic']
            }
          },
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          source: 'dummy_data',
          is_deleted: false
        },
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'inspiration',
          content: {
            text: "Here's a curated experience I think you'd love!",
            type: 'inspiration',
            metadata: {
              title: 'Private Sunset Dinner Experience',
              description: 'Enjoy a private dinner on a secluded terrace overlooking the Aegean Sea as the sun sets behind the caldera',
              image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400',
              location: 'Santorini, Greece',
              tags: ['private-dining', 'sunset', 'romantic', 'exclusive']
            }
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          source: 'dummy_data',
          is_deleted: false
        },
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'text',
          content: {
            text: "What would be the best time of year to visit? I'm flexible with dates and want to avoid crowds.",
            type: 'text'
          },
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          source: 'dummy_data',
          is_deleted: false
        },
        {
          id: crypto.randomUUID(),
          sender_id: currentUser.id,
          recipient_id: recipientId,
          conversation_id: conversationId,
          message_type: 'text',
          content: {
            text: "Also, I'd love to include some island hopping - maybe Mykonos and Crete too?",
            type: 'text'
          },
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          source: 'dummy_data',
          is_deleted: false
        }
      ];

      console.log('Inserting dummy messages:', dummyMessages);

      const { data, error } = await supabase
        .from('user_messages')
        .insert(dummyMessages)
        .select();

      if (error) {
        console.error('Error inserting dummy messages:', error);
        toast({
          title: "Database Error",
          description: `Failed to insert dummy messages: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully inserted dummy messages:', data);

      const recipientType = advisorId ? 'advisor' : 'yourself (self-chat)';
      toast({
        title: "Dummy Data Added!",
        description: `Successfully added ${data.length} dummy chat messages from you to ${recipientType}.`,
        variant: "default"
      });

      // Refresh the table statuses to show updated message count
      const tableResults = await getTableList();
      setTableStatuses(tableResults);

    } catch (err) {
      console.error('Unexpected error adding dummy messages:', err);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while adding dummy messages.",
        variant: "destructive"
      });
    } finally {
      setAddingDummyData(false);
    }
  };

  const clearDummyChatMessages = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to clear dummy chat messages.",
        variant: "destructive"
      });
      return;
    }

    setAddingDummyData(true);

    try {
      console.log('Clearing dummy chat messages...');

      const { data, error } = await supabase
        .from('user_messages')
        .delete()
        .eq('source', 'dummy_data')
        .eq('sender_id', currentUser.id);

      if (error) {
        console.error('Error clearing dummy messages:', error);
        toast({
          title: "Database Error",
          description: `Failed to clear dummy messages: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully cleared dummy messages');

      toast({
        title: "Dummy Data Cleared!",
        description: "Successfully removed all dummy chat messages from the database.",
        variant: "default"
      });

      // Refresh the table statuses to show updated message count
      const tableResults = await getTableList();
      setTableStatuses(tableResults);

    } catch (err) {
      console.error('Unexpected error clearing dummy messages:', err);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while clearing dummy messages.",
        variant: "destructive"
      });
    } finally {
      setAddingDummyData(false);
    }
  };

  const runConnectionTest = async () => {
    setLoading(true);
    console.log('Testing Supabase connection...');
    
    try {
      // Test basic connection
      const connectionResult = await testConnection();
      setConnectionStatus(connectionResult);
      
      // Test table access
      const tableResults = await getTableList();
      setTableStatuses(tableResults);
      
      // Fetch users data
      await fetchAllUsers();
      
      // Fetch advisor ID
      await fetchAdvisorId();
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const runDirectQuery = async () => {
    setLoading(true);
    try {
      console.log('Running direct SQL-like query...');
      
      // Clear previous data
      setUsers([]);
      setAllUsers([]);
      
      // Try different select patterns
      const queries = [
        'id,name,email,role,advisor_id',
        'id,email',
        'id',
        '*'
      ];
      
      for (const query of queries) {
        try {
          const { data, error, count } = await supabase
            .from('users')
            .select(query, { count: 'exact' });
          
          console.log(`Query "${query}":`, { 
            success: !error, 
            count, 
            dataLength: data?.length,
            error: error?.message 
          });
          
          if (!error && data) {
            setAllUsers(data);
            setUsers(data.slice(0, 5));
            setLastFetchTime(new Date());
            break;
          }
        } catch (err) {
          console.error(`Query "${query}" failed:`, err);
        }
      }
    } catch (err) {
      console.error('Direct query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFetch = async () => {
    console.log('Retry fetch button clicked');
    await fetchAllUsers();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('User signed out successfully');
        // The useSupabaseUser hook will automatically update the user state
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    }
  };

  useEffect(() => {
    // Only run connection test when user loading is complete
    if (!userLoading) {
      console.log('Current logged-in user:', currentUser);
      runConnectionTest();
    }
  }, [currentUser, userLoading]);

  // Get the user_messages table status for display
  const userMessagesTable = tableStatuses.find(table => table.table === 'user_messages');

  // Find the assigned advisor in the users list for display
  const assignedAdvisor = allUsers.find(user => user.id === advisorId);

  return (
    <div className="pt-20">
      <div className="container-spacing section-padding">
        <div className="space-y-8">
          {/* Header with User Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Supabase Connection & Users Data</h1>
              {currentUser && (
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              Testing connection to your Supabase database and fetching users table data.
            </p>
            
            {/* Current User Status */}
            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  {userLoading ? (
                    <p className="text-sm text-muted-foreground">Loading user data...</p>
                  ) : currentUser ? (
                    <div>
                      <p className="font-medium">
                        Logged in as: <span className="text-primary">{currentUser.email}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        User ID: {currentUser.id}
                      </p>
                      {currentUser.user_metadata?.role && (
                        <Badge variant="secondary" className="mt-1">
                          {currentUser.user_metadata.role}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">No user logged in</p>
                      <p className="text-sm text-muted-foreground">
                        Please sign in to see personalized data
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {lastFetchTime && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {lastFetchTime.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Dummy Chat Messages Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat Messages Test Data
                {userMessagesTable && (
                  <Badge variant="outline">
                    {userMessagesTable.count} messages in DB
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Advisor Status */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-gray-800">Advisor Lookup Status</h4>
                  </div>
                  {advisorId ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">
                          Found advisor (ID: {advisorId}) - Messages will be sent to advisor
                        </span>
                      </div>
                      {assignedAdvisor && (
                        <div className="ml-6 p-2 bg-green-50 border border-green-200 rounded text-sm">
                          <p><strong>Advisor:</strong> {assignedAdvisor.name || assignedAdvisor.email}</p>
                          <p><strong>Email:</strong> {assignedAdvisor.email}</p>
                          <p><strong>Role:</strong> {assignedAdvisor.role}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-700">
                        No advisor found - Messages will be sent to yourself (self-chat for testing)
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Test Chat Connection</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Add dummy chat messages to test the useSupabaseChat hook and verify that the chat system is working correctly.
                    Messages will be sent from the logged-in user to {advisorId ? 'their assigned advisor' : 'yourself (self-chat)'}.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={addDummyChatMessages}
                      disabled={addingDummyData || !currentUser}
                      size="sm"
                    >
                      {addingDummyData ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Adding Messages...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Dummy Messages
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={clearDummyChatMessages}
                      disabled={addingDummyData || !currentUser}
                      variant="outline"
                      size="sm"
                    >
                      {addingDummyData ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear Dummy Messages
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {!currentUser && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> You must be logged in to add or clear dummy chat messages. 
                      Please sign in using the test form to continue.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">What this creates:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 6 dummy messages with varied content types (text, link, inspiration)</li>
                    <li>• Messages sent from logged-in user to {advisorId ? 'assigned advisor' : 'self (for testing)'}</li>
                    <li>• Messages with realistic timestamps (spread over 2 hours)</li>
                    <li>• Conversation ID: {currentUser && advisorId ? generateConversationId(currentUser.id, advisorId) : 'Generated based on user IDs'}</li>
                    <li>• Rich metadata for link and inspiration message types</li>
                    <li>• Proper JSON structure matching the useSupabaseChat hook expectations</li>
                    <li>• Text and tags are automatically generated from content (generated columns)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection Status
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={runConnectionTest}
                  disabled={loading || fetchingUsers}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${(loading || fetchingUsers) ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={runDirectQuery}
                  disabled={loading || fetchingUsers}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Direct Query
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus ? (
                <div className="flex items-center gap-2">
                  {connectionStatus.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700">Connection successful!</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700">Connection failed</span>
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Testing connection...</span>
                </div>
              )}
              
              {connectionStatus?.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {JSON.stringify(connectionStatus.error, null, 2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table Access Status */}
          <Card>
            <CardHeader>
              <CardTitle>Table Access Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tableStatuses.map((status) => (
                  <div 
                    key={status.table} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      status.table === 'user_messages' ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.accessible ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{status.table}</span>
                      {status.table === 'user_messages' && (
                        <MessageSquare className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <div className="text-right">
                      {status.accessible ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {status.count} rows
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users Table Data
                <Badge variant="outline">
                  {allUsers.length} total users found
                </Badge>
                {fetchingUsers && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Fetching...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allUsers.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowAllUsers(!showAllUsers)}
                    >
                      {showAllUsers ? 'Show Preview Only' : 'Show All Users'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleRetryFetch}
                      disabled={fetchingUsers}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${fetchingUsers ? 'animate-spin' : ''}`} />
                      Refresh Users
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {showAllUsers ? `Showing all ${allUsers.length} users` : `Showing first ${Math.min(5, allUsers.length)} of ${allUsers.length} users`}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {(showAllUsers ? allUsers : users).map((user, index) => (
                      <div 
                        key={user.id || index} 
                        className={`p-4 border rounded-lg ${
                          currentUser && user.id === currentUser.id 
                            ? 'border-primary bg-primary/5' 
                            : user.id === advisorId
                            ? 'border-green-500 bg-green-50'
                            : ''
                        }`}
                      >
                        <div className="mb-2 flex gap-2">
                          {currentUser && user.id === currentUser.id && (
                            <Badge variant="default" className="text-xs">
                              Current User
                            </Badge>
                          )}
                          {user.id === advisorId && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Selected Advisor
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>ID:</strong> {user.id || 'N/A'}
                          </div>
                          <div>
                            <strong>Name:</strong> {user.name || 'N/A'}
                          </div>
                          <div>
                            <strong>Email:</strong> {user.email || 'N/A'}
                          </div>
                          <div>
                            <strong>Role:</strong> {user.role || 'N/A'}
                          </div>
                          <div>
                            <strong>Auth Provider:</strong> {user.auth_provider || 'N/A'}
                          </div>
                          <div>
                            <strong>Created:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                          {user.advisor_id && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <strong>Advisor ID:</strong> {user.advisor_id}
                            </div>
                          )}
                        </div>
                        {user.google_id && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <strong>Google ID:</strong> {user.google_id}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {fetchingUsers ? 'Fetching Users...' : 'No Users Found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {fetchingUsers 
                      ? 'Please wait while we fetch user data from the database.'
                      : 'The users table appears to be empty or inaccessible.'
                    }
                  </p>
                  <Button 
                    onClick={handleRetryFetch} 
                    disabled={fetchingUsers}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${fetchingUsers ? 'animate-spin' : ''}`} />
                    {fetchingUsers ? 'Fetching...' : 'Retry Fetch'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environment Variables Check */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {import.meta.env.VITE_SUPABASE_URL ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</span>
                </div>
              </div>
              
              {import.meta.env.VITE_SUPABASE_URL && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}
                  </p>
                </div>
              )}
              
              {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> You need to set up your environment variables in the .env file. 
                    Add your Supabase URL and Anon Key from your Supabase project dashboard.
                  </p>
                </div>
                )}
            </CardContent>
          </Card>

          {/* useSupabaseUser Hook Demo */}
          <Card>
            <CardHeader>
              <CardTitle>useSupabaseUser Hook Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Hook Status:</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>Loading:</strong> {userLoading ? 'true' : 'false'}</p>
                    <p><strong>User:</strong> {currentUser ? 'Authenticated' : 'Not authenticated'}</p>
                    {currentUser && (
                      <>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>ID:</strong> {currentUser.id}</p>
                        <p><strong>Created:</strong> {new Date(currentUser.created_at || '').toLocaleString()}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">How it works:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Automatically fetches the current user on component mount</li>
                    <li>• Listens for authentication state changes (login/logout)</li>
                    <li>• Provides real-time updates when user status changes</li>
                    <li>• Returns both user data and loading state</li>
                    <li>• Cleans up subscriptions when component unmounts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}