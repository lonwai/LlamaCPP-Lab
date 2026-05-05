const API_BASE_URL = 'http://localhost:3001/api';

export interface ConversationData {
  id: string;
  title: string;
  messages: any[];
  metrics: any[];
  createdAt: number;
  updatedAt: number;
}

export async function loadConversations(): Promise<ConversationData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) throw new Error('Failed to load conversations');
    return await response.json();
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

export async function saveConversations(conversations: ConversationData[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversations),
    });
    if (!response.ok) throw new Error('Failed to save conversations');
    console.log('Conversations saved successfully');
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
}

export async function loadSettings(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to load settings');
    return await response.json();
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
      stop: [],
    };
  }
}

export async function saveSettings(settings: any): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to save settings');
    console.log('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
