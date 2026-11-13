import { UserSettings, Conversation } from '../types/chat.js';

const SETTINGS_KEY = 'sentinel_settings_v1';
const CONVERSATIONS_KEY = 'sentinel_conversations_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  geminiKey: '',
  openaiKey: '',
  anthropicKey: '',
  selectedModel: 'mock-sentinel',
  selectedPersona: 'sentinel-prime',
  customSystemPrompt: '',
  temperature: 0.7,
  streamTokens: true,
  autoSaveHistory: true
};

export function loadStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse settings from storage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

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
