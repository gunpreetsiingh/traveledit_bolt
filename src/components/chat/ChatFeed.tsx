import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  ExternalLink,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  FileText,
  Download,
  Upload,
  Loader2,
  ChevronUp,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { useSupabaseChat, UIMessage } from '@/hooks/useSupabaseChat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  profile_image_url: string | null;
}

interface ChatFeedProps {
  currentUser: UserDetails | null;
  otherUser: UserDetails | null;
  conversationId?: string;
}

export default function ChatFeed({ currentUser, otherUser, conversationId }: ChatFeedProps) {
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Use the Supabase chat hook with lazy loading (limit to 5 initial messages)
  const { 
    messages, 
    loading, 
    loadingOlder,
    hasMoreMessages,
    error, 
    sendMessage, 
    loadOlderMessages,
    refetch
  } = useSupabaseChat(conversationId, 5);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when new messages arrive (but not when loading older messages)
  useEffect(() => {
    if (!loadingOlder) {
      scrollToBottom();
    }
  }, [messages, loadingOlder]);

  // Handle loading older messages with scroll position preservation
  const handleLoadOlderMessages = async () => {
    if (!messagesContainerRef.current || loadingOlder) return;

    // Capture current scroll position
    const container = messagesContainerRef.current;
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    // Load older messages
    const success = await loadOlderMessages();

    if (success) {
      // Wait for DOM to update, then restore scroll position
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const scrollHeightAfter = messagesContainerRef.current.scrollHeight;
          const heightDifference = scrollHeightAfter - scrollHeightBefore;
          messagesContainerRef.current.scrollTop = scrollTopBefore + heightDifference;
        }
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log('Sending message:', {
      content: newMessage,
      type: 'text',
      recipientId: otherUser?.id,
      conversationId
    });

    const success = await sendMessage(newMessage, 'text', otherUser?.id);
    if (success) {
      setNewMessage('');
    } else {
      console.error('Failed to send message');
    }
  };

  const ensureBucketExists = async (): Promise<boolean> => {
    try {
      // Check if bucket exists by trying to list objects
      const { error } = await supabase.storage
        .from('chat_attachments')
        .list('', { limit: 1 });

      if (error) {
        console.log('Bucket does not exist or is not accessible:', error.message);
        
        // Try to create the bucket
        const { error: createError } = await supabase.storage
          .createBucket('chat_attachments', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: [
              'image/jpeg',
              'image/png', 
              'image/gif',
              'image/webp',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
              'text/csv',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ]
          });

        if (createError) {
          console.error('Failed to create bucket:', createError);
          toast({
            title: "Storage Setup Required",
            description: "Please contact your administrator to set up file storage.",
            variant: "destructive"
          });
          return false;
        }

        console.log('Bucket created successfully');
        toast({
          title: "Storage Initialized",
          description: "File storage has been set up successfully.",
          variant: "default"
        });
      }

      return true;
    } catch (err) {
      console.error('Error checking/creating bucket:', err);
      toast({
        title: "Storage Error",
        description: "Unable to initialize file storage. Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleFileUpload = async (file: File, type: 'image' | 'document') => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      console.log(`Uploading ${type}:`, file.name, file.type, file.size);

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      if (type === 'image') {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: "Please select an image file.",
            variant: "destructive"
          });
          return;
        }
      }

      // Ensure bucket exists before uploading
      const bucketReady = await ensureBucketExists();
      if (!bucketReady) {
        return;
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      // Show upload progress toast
      toast({
        title: "Uploading File",
        description: `Uploading ${file.name}...`,
        variant: "default"
      });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload Failed",
          description: `Failed to upload file: ${uploadError.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        toast({
          title: "Upload Failed",
          description: "Failed to get file URL.",
          variant: "destructive"
        });
        return;
      }

      console.log('File public URL:', urlData.publicUrl);

      // Prepare metadata
      const metadata = {
        fileUrl: urlData.publicUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };

      // Prepare message content
      const messageContent = type === 'image' 
        ? `Shared an image: ${file.name}`
        : `Shared a document: ${file.name}`;

      // Send message with file metadata
      const success = await sendMessage(
        messageContent,
        type,
        otherUser?.id,
        metadata
      );

      if (success) {
        toast({
          title: "File Uploaded",
          description: `${file.name} has been shared successfully.`,
          variant: "default"
        });
      } else {
        console.error('Failed to send file message');
        toast({
          title: "Message Failed",
          description: "File uploaded but failed to send message.",
          variant: "destructive"
        });
      }

    } catch (err) {
      console.error('Unexpected error during file upload:', err);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = () => {
    if (uploading) return;
    imageInputRef.current?.click();
  };

  const handleAttachmentUpload = () => {
    if (uploading) return;
    attachmentInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'image');
    }
    // Reset input
    e.target.value = '';
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'document');
    }
    // Reset input
    e.target.value = '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessage = (message: UIMessage) => {
    const isCurrentUser = currentUser && message.sender.id === currentUser.id;
    
    return (
      <div key={message.id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {message.sender.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
          
          {message.type === 'text' && (
            <div className={`rounded-lg px-4 py-2 ${
              isCurrentUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          )}

          {message.type === 'image' && message.metadata && (
            <div className="space-y-2">
              <div className={`rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="max-w-sm">
                <img 
                  src={message.metadata.fileUrl} 
                  alt={message.metadata.fileName || 'Shared image'}
                  className="w-full rounded-lg object-cover max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    if (message.metadata?.fileUrl) {
                      window.open(message.metadata.fileUrl, '_blank');
                    }
                  }}
                />
                {message.metadata.fileName && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p className="font-medium">{message.metadata.fileName}</p>
                    {message.metadata.fileSize && (
                      <p>{formatFileSize(message.metadata.fileSize)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {(message.type === 'document' || message.type === 'transcript') && message.metadata && (
            <div className="space-y-2">
              <div className={`rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <Card className="p-4 max-w-sm">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {message.metadata.fileName || 'Document'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {message.metadata.fileType && (
                        <Badge variant="secondary" className="text-xs">
                          {message.metadata.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      )}
                      {message.metadata.fileSize && (
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(message.metadata.fileSize)}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3 w-full"
                      onClick={() => {
                        if (message.metadata?.fileUrl) {
                          window.open(message.metadata.fileUrl, '_blank');
                        }
                      }}
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {message.type === 'link' && message.metadata && (
            <div className="space-y-2">
              <div className={`rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <Card className="p-3 max-w-sm">
                <div className="flex gap-3">
                  {message.metadata.image && (
                    <img 
                      src={message.metadata.image} 
                      alt={message.metadata.title}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{message.metadata.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{message.metadata.description}</p>
                    {message.metadata.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{message.metadata.location}</span>
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
                {message.metadata.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
          
          {message.type === 'inspiration' && message.metadata && (
            <div className="space-y-2">
              <div className={`rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <Card className="p-4 max-w-sm">
                {message.metadata.image && (
                  <img 
                    src={message.metadata.image} 
                    alt={message.metadata.title}
                    className="w-full h-32 rounded object-cover mb-3"
                  />
                )}
                <h4 className="font-medium text-sm mb-1">{message.metadata.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{message.metadata.description}</p>
                {message.metadata.location && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{message.metadata.location}</span>
                  </div>
                )}
                {message.metadata.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {message.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Pin
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get the display name for the chat header
  const getDisplayName = () => {
    if (otherUser) {
      return otherUser.name || otherUser.email || 'Unknown User';
    }
    
    // If we have messages, try to find the other user's name from the messages
    if (messages.length > 0 && currentUser) {
      const otherUserMessage = messages.find(msg => msg.sender.id !== currentUser.id);
      if (otherUserMessage) {
        return otherUserMessage.sender.name;
      }
    }
    
    return 'Chat';
  };

  const getDisplayStatus = () => {
    if (otherUser) {
      const roleLabel = otherUser.role === 'advisor' ? 'Travel Advisor' : 
                       otherUser.role === 'admin' ? 'Administrator' :
                       otherUser.role === 'traveler' ? 'Traveler' : 'User';
      return `${roleLabel} • Online`;
    }
    
    return 'Ready to chat';
  };

  const getAvatarUrl = () => {
    if (otherUser?.profile_image_url) {
      return otherUser.profile_image_url;
    }
    
    // Default avatar based on role
    const isAdvisor = otherUser?.role === 'advisor' || otherUser?.role === 'admin';
    return isAdvisor 
      ? "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
      : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100";
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div>
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={attachmentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
        onChange={handleAttachmentChange}
        className="hidden"
      />

      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={getAvatarUrl()} />
            <AvatarFallback>
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{getDisplayName()}</h3>
            <p className="text-sm text-muted-foreground">{getDisplayStatus()}</p>
          </div>
          {error && (
            <div className="ml-auto flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Connection issue</span>
              <Button size="sm" variant="outline" onClick={refetch}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          )}
          {uploading && (
            <div className="ml-auto flex items-center gap-2 text-blue-600">
              <Upload className="h-4 w-4" />
              <span className="text-xs">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages - Fixed scroll area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-4 space-y-4">
          {/* Load Older Messages Button */}
          {hasMoreMessages && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadOlderMessages}
                disabled={loadingOlder}
                className="flex items-center gap-2"
              >
                {loadingOlder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading older messages...
                  </>
                ) : (
                  <>
                    <History className="h-4 w-4" />
                    Load older messages
                    <ChevronUp className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          {messages.length === 0 && !loading && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Start the conversation by sending a message below.
              </p>
            </div>
          )}
          
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Increased text area size */}
      <div className="border-t p-4">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleAttachmentUpload}
              disabled={uploading}
              title="Upload document"
              className="flex-shrink-0"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleImageUpload}
              disabled={uploading}
              title="Upload image"
              className="flex-shrink-0"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={uploading}
              rows={1}
              className="resize-none min-h-[48px] max-h-[120px]"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || uploading}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}