import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a consistent conversation ID between two users
 * Always puts the smaller UUID first to ensure consistency regardless of order
 */
export function generateConversationId(userId1: string, userId2: string): string {
  const sortedIds = [userId1, userId2].sort();
  return `conversation-${sortedIds[0]}-${sortedIds[1]}`;
}