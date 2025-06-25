/*
  # Create chat attachments storage bucket

  1. Storage Setup
    - Create `chat_attachments` bucket for file uploads
    - Enable public access for file sharing
    - Set up RLS policies for secure access

  2. Security
    - Users can upload files to their own folders
    - Users can read files they have access to
    - Automatic cleanup policies can be added later
*/

-- Create the chat_attachments bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat_attachments',
  'chat_attachments',
  true,
  10485760, -- 10MB limit
  ARRAY[
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
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view files they have access to"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat_attachments' AND (
    -- Users can view their own files
    (storage.foldername(name))[1] = auth.uid()::text OR
    -- Users can view files in conversations they're part of
    EXISTS (
      SELECT 1 FROM user_messages um
      WHERE um.sender_id = auth.uid() OR um.recipient_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);