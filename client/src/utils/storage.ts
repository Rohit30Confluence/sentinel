import { Conversation } from '../types/chat.js';

const CONVERSATIONS_KEY = 'thatjoint_sentinel_conversations_v2';

export function loadStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load conversations from storage:', e);
    return [];
  }
}

export function saveStoredConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
