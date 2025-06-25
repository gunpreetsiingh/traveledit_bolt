import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateConversationId } from '@/lib/utils';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

// Database types based on your schema
export interface DatabaseMessage {
  id: string;
  sender_id: string | null;
  recipient_id: string | null;
  conversation_id: string | null;
  message_type: string | null;
  content: any | null;
  text: string | null;
  tags: any | null;
  timestamp: string | null;
  source: string | null;
  inferred_tags: any | null;
  is_deleted: boolean | null;
}

// UI Message type (what your ChatFeed expects)
export interface UIMessage {
  id: string;
  type: 'text' | 'link' | 'inspiration' | 'image' | 'document' | 'transcript';
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: 'client' | 'advisor';
  };
  timestamp: Date;
  metadata?: {
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    location?: string;
    tags?: string[];
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };
}

// User details for message senders
interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  profile_image_url: string | null;
}

/**
 * Custom hook for managing chat messages with Supabase
 * Handles fetching, sending, and real-time updates for chat messages
 * Now includes lazy loading functionality
 */
export function useSupabaseChat(conversationId?: string, initialMessageLimit: number = 5) {
  const { user: currentUser } = useSupabaseUser();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCache, setUserCache] = useState<Map<string, UserDetails>>(new Map());
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<string | null>(null);

  // Fetch user details and cache them
  const fetchUserDetails = useCallback(async (userId: string): Promise<UserDetails | null> => {
    // Check cache first
    if (userCache.has(userId)) {
      return userCache.get(userId)!;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, profile_image_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        return null;
      }

      const userDetails: UserDetails = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profile_image_url: data.profile_image_url
      };

      // Cache the user details
      setUserCache(prev => new Map(prev).set(userId, userDetails));
      
      return userDetails;
    } catch (err) {
      console.error('Error fetching user details:', err);
      return null;
    }
  }, [userCache]);

  // Convert database message to UI message format
  const convertToUIMessage = useCallback(async (dbMessage: DatabaseMessage): Promise<UIMessage | null> => {
    if (!dbMessage.sender_id) {
      console.warn('Message has no sender_id:', dbMessage);
      return null;
    }

    // Fetch sender details
    const senderDetails = await fetchUserDetails(dbMessage.sender_id);
    if (!senderDetails) {
      console.warn('Could not fetch sender details for:', dbMessage.sender_id);
      return null;
    }

    // Determine message type
    let messageType: UIMessage['type'] = 'text';
    let content = '';
    let metadata: UIMessage['metadata'] | undefined;

    // Parse content if it's JSON and has additional data
    if (dbMessage.content && typeof dbMessage.content === 'object') {
      if (dbMessage.content.type) {
        messageType = dbMessage.content.type;
      }
      if (dbMessage.content.text) {
        content = dbMessage.content.text;
      }
      if (dbMessage.content.metadata) {
        metadata = {
          ...dbMessage.content.metadata,
          // Extract file-related metadata for image, document, and transcript types
          ...(dbMessage.content.metadata.fileUrl && { fileUrl: dbMessage.content.metadata.fileUrl }),
          ...(dbMessage.content.metadata.fileName && { fileName: dbMessage.content.metadata.fileName }),
          ...(dbMessage.content.metadata.fileType && { fileType: dbMessage.content.metadata.fileType }),
          ...(dbMessage.content.metadata.fileSize && { fileSize: dbMessage.content.metadata.fileSize })
        };
      }
    } else if (dbMessage.text) {
      // Fallback to the generated text column
      content = dbMessage.text;
    } else {
      console.warn('Message has no content or text:', dbMessage);
      content = '[No content]';
    }

    // Determine sender role for UI
    const senderRole: 'client' | 'advisor' = 
      senderDetails.role === 'advisor' || senderDetails.role === 'admin' ? 'advisor' : 'client';

    // Generate avatar URL or use profile image
    const avatarUrl = senderDetails.profile_image_url || 
      `https://images.pexels.com/photos/${senderRole === 'advisor' ? '1239291' : '774909'}/pexels-photo-${senderRole === 'advisor' ? '1239291' : '774909'}.jpeg?auto=compress&cs=tinysrgb&w=100`;

    return {
      id: dbMessage.id,
      type: messageType,
      content,
      sender: {
        id: senderDetails.id,
        name: senderDetails.name || senderDetails.email || 'Unknown User',
        avatar: avatarUrl,
        role: senderRole
      },
      timestamp: new Date(dbMessage.timestamp || Date.now()),
      metadata
    };
  }, [fetchUserDetails]);

  // Fetch initial messages from database (most recent)
  const fetchMessages = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user, clearing messages');
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching initial messages for user:', currentUser.id, 'conversation:', conversationId, 'limit:', initialMessageLimit);

      let query = supabase
        .from('user_messages')
        .select('*')
        .eq('is_deleted', false)
        .order('timestamp', { ascending: false }) // Get most recent first
        .limit(initialMessageLimit);

      // If conversationId is provided, filter by it
      if (conversationId) {
        console.log('Filtering by conversation ID:', conversationId);
        query = query.eq('conversation_id', conversationId);
      } else {
        // Otherwise, get messages where current user is sender or recipient
        console.log('Filtering by sender/recipient:', currentUser.id);
        query = query.or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        setError(`Failed to fetch messages: ${error.message}`);
        return;
      }

      console.log(`Raw database query returned ${data?.length || 0} messages:`, data);

      if (!data || data.length === 0) {
        console.log('No messages found in database');
        setMessages([]);
        setHasMoreMessages(false);
        setOldestMessageTimestamp(null);
        return;
      }

      // Check if there are more messages available
      const hasMore = data.length === initialMessageLimit;
      setHasMoreMessages(hasMore);

      // Store the oldest message timestamp for pagination
      const oldestMessage = data[data.length - 1];
      setOldestMessageTimestamp(oldestMessage.timestamp);

      // Convert database messages to UI format
      const uiMessages: UIMessage[] = [];
      for (const dbMessage of data) {
        try {
          const uiMessage = await convertToUIMessage(dbMessage);
          if (uiMessage) {
            uiMessages.push(uiMessage);
          } else {
            console.warn('Failed to convert message to UI format:', dbMessage);
          }
        } catch (err) {
          console.error('Error converting message:', dbMessage, err);
        }
      }

      // Reverse the messages to show oldest first (ascending order for display)
      uiMessages.reverse();

      console.log(`Successfully converted ${uiMessages.length} messages to UI format:`, uiMessages);
      setMessages(uiMessages);

    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
      setError('An unexpected error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  }, [currentUser, conversationId, initialMessageLimit, convertToUIMessage]);

  // Load older messages (pagination)
  const loadOlderMessages = useCallback(async (): Promise<boolean> => {
    if (!currentUser || !oldestMessageTimestamp || loadingOlder) {
      console.log('Cannot load older messages:', { 
        currentUser: !!currentUser, 
        oldestMessageTimestamp, 
        loadingOlder 
      });
      return false;
    }

    try {
      setLoadingOlder(true);
      setError(null);

      console.log('Loading older messages before:', oldestMessageTimestamp);

      let query = supabase
        .from('user_messages')
        .select('*')
        .eq('is_deleted', false)
        .lt('timestamp', oldestMessageTimestamp) // Get messages older than the oldest we have
        .order('timestamp', { ascending: false }) // Get most recent of the older messages first
        .limit(initialMessageLimit);

      // Apply the same filters as the initial fetch
      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      } else {
        query = query.or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading older messages:', error);
        setError(`Failed to load older messages: ${error.message}`);
        return false;
      }

      console.log(`Loaded ${data?.length || 0} older messages:`, data);

      if (!data || data.length === 0) {
        console.log('No more older messages found');
        setHasMoreMessages(false);
        return false;
      }

      // Check if there are even more messages available
      const hasMore = data.length === initialMessageLimit;
      setHasMoreMessages(hasMore);

      // Update the oldest message timestamp for next pagination
      const newOldestMessage = data[data.length - 1];
      setOldestMessageTimestamp(newOldestMessage.timestamp);

      // Convert database messages to UI format
      const uiMessages: UIMessage[] = [];
      for (const dbMessage of data) {
        try {
          const uiMessage = await convertToUIMessage(dbMessage);
          if (uiMessage) {
            uiMessages.push(uiMessage);
          }
        } catch (err) {
          console.error('Error converting older message:', dbMessage, err);
        }
      }

      // Reverse the messages to show oldest first, then prepend to existing messages
      uiMessages.reverse();

      setMessages(prev => [...uiMessages, ...prev]);

      console.log(`Successfully loaded and added ${uiMessages.length} older messages`);
      return true;

    } catch (err) {
      console.error('Unexpected error loading older messages:', err);
      setError('An unexpected error occurred while loading older messages');
      return false;
    } finally {
      setLoadingOlder(false);
    }
  }, [currentUser, conversationId, oldestMessageTimestamp, loadingOlder, initialMessageLimit, convertToUIMessage]);

  // Send a new message
  const sendMessage = useCallback(async (
    content: string, 
    type: UIMessage['type'] = 'text',
    recipientId?: string,
    metadata?: UIMessage['metadata']
  ): Promise<boolean> => {
    if (!currentUser) {
      console.error('Cannot send message: user not authenticated');
      setError('You must be logged in to send messages');
      return false;
    }

    if (!content.trim()) {
      console.error('Cannot send empty message');
      return false;
    }

    try {
      // Generate a unique ID for the message
      const messageId = crypto.randomUUID();
      
      // Use the consistent conversation ID if we have a recipient
      let finalConversationId = conversationId;
      if (!finalConversationId && recipientId) {
        finalConversationId = generateConversationId(currentUser.id, recipientId);
      }
      
      // Prepare message data - DO NOT include 'text' field as it's a generated column
      const messageData = {
        id: messageId,
        sender_id: currentUser.id,
        recipient_id: recipientId || null,
        conversation_id: finalConversationId || null,
        message_type: type,
        content: {
          text: content,
          type,
          ...(metadata && { metadata })
        },
        timestamp: new Date().toISOString(),
        source: 'chat_interface',
        is_deleted: false
      };

      console.log('Sending message with data:', messageData);

      const { data, error } = await supabase
        .from('user_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        setError(`Failed to send message: ${error.message}`);
        return false;
      }

      console.log('Message sent successfully:', data);

      // If this is an image or document message with file metadata, also insert into message_attachments
      if ((type === 'image' || type === 'document') && metadata?.fileUrl) {
        console.log('Inserting attachment record for message:', messageId);
        
        const attachmentData = {
          id: crypto.randomUUID(),
          message_id: messageId,
          file_url: metadata.fileUrl,
          file_type: metadata.fileType || 'unknown',
          uploaded_by: currentUser.id,
          created_at: new Date().toISOString()
        };

        const { error: attachmentError } = await supabase
          .from('message_attachments')
          .insert(attachmentData);

        if (attachmentError) {
          console.error('Error inserting attachment record:', attachmentError);
          // Don't fail the message send if attachment record fails
        } else {
          console.log('Attachment record inserted successfully');
        }
      }

      // Convert and add to local state immediately for optimistic UI
      const uiMessage = await convertToUIMessage(data);
      if (uiMessage) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === uiMessage.id);
          if (exists) {
            console.log('Message already exists in state, not adding duplicate');
            return prev;
          }
          console.log('Adding new message to state:', uiMessage);
          return [...prev, uiMessage];
        });
      }

      return true;

    } catch (err) {
      console.error('Unexpected error sending message:', err);
      setError('An unexpected error occurred while sending the message');
      return false;
    }
  }, [currentUser, conversationId, convertToUIMessage]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, skipping real-time subscription');
      return;
    }

    console.log('Setting up real-time subscription for messages');

    // Create subscription for new messages
    const subscription = supabase
      .channel('user_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages',
          filter: conversationId 
            ? `conversation_id=eq.${conversationId}`
            : `or(sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id})`
        },
        async (payload) => {
          console.log('Received real-time message:', payload);
          
          const newMessage = payload.new as DatabaseMessage;
          
          // Don't add if it's from the current user (already added optimistically)
          if (newMessage.sender_id === currentUser.id) {
            console.log('Ignoring real-time message from current user (already added optimistically)');
            return;
          }

          // Convert and add to messages
          const uiMessage = await convertToUIMessage(newMessage);
          if (uiMessage) {
            setMessages(prev => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(msg => msg.id === uiMessage.id);
              if (exists) {
                console.log('Real-time message already exists, not adding duplicate');
                return prev;
              }
              console.log('Adding real-time message to state:', uiMessage);
              return [...prev, uiMessage];
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      console.log('Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [currentUser, conversationId, convertToUIMessage]);

  // Fetch messages when user or conversationId changes
  useEffect(() => {
    console.log('useEffect triggered for fetchMessages, currentUser:', !!currentUser, 'conversationId:', conversationId);
    fetchMessages();
  }, [fetchMessages]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    messages,
    loading,
    loadingOlder,
    hasMoreMessages,
    error,
    sendMessage,
    loadOlderMessages,
    refetch: fetchMessages,
    currentUser
  };
}