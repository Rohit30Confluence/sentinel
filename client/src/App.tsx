import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { ChatArea } from './components/ChatArea.js';
import { SettingsModal } from './components/SettingsModal.js';
import { useChatStream } from './hooks/useChatStream.js';
import {
  Conversation,
  UserSettings,
  Persona,
  ModelOption
} from './types/chat.js';
import {
  loadStoredSettings,
  saveStoredSettings,
  loadStoredConversations,
  saveStoredConversations,
  generateId
} from './utils/storage.js';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(loadStoredSettings);
  const [conversations, setConversations] = useState<Conversation[]>(loadStoredConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);

  // Fetch models & personas from backend
  useEffect(() => {
    fetch('/api/models')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setModels(data))
      .catch((err) => console.warn('Could not fetch models:', err));

    fetch('/api/personas')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPersonas(data))
      .catch((err) => console.warn('Could not fetch personas:', err));

    // Also fetch initial history from server if local is empty
    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : []))
      .then((serverConvs: Conversation[]) => {
        if (serverConvs.length > 0 && conversations.length === 0) {
          setConversations(serverConvs);
          saveStoredConversations(serverConvs);
          if (!activeId) setActiveId(serverConvs[0].id);
        }
      })
      .catch((err) => console.warn('Could not sync history:', err));
  }, []);

  // Sync settings updates to localStorage
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Sync conversations updates to localStorage
  const updateConversationsList = (newList: Conversation[]) => {
    setConversations(newList);
    saveStoredConversations(newList);
  };

  // Ensure there is always an active conversation
  useEffect(() => {
    if (!activeId) {
      if (conversations.length > 0) {
        setActiveId(conversations[0].id);
      } else {
        createNewChat();
      }
    }
  }, [conversations, activeId]);

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;

  const handleUpdateActiveConversation = (updated: Conversation) => {
    const exists = conversations.some((c) => c.id === updated.id);
    let nextList: Conversation[];
    if (exists) {
      nextList = conversations.map((c) => (c.id === updated.id ? updated : c));
    } else {
      nextList = [updated, ...conversations];
    }
    updateConversationsList(nextList);
  };

  const createNewChat = () => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      personaId: settings.selectedPersona,
      model: settings.selectedModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    const nextList = [newConv, ...conversations];
    updateConversationsList(nextList);
    setActiveId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    const nextList = conversations.filter((c) => c.id !== id);
    updateConversationsList(nextList);

    // Call server to delete
    fetch(`/api/history/${id}`, { method: 'DELETE' }).catch((e) =>
      console.warn('Failed deleting history on server:', e)
    );

    if (activeId === id) {
      setActiveId(nextList.length > 0 ? nextList[0].id : null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    const nextList = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c
    );
    updateConversationsList(nextList);
  };

  const handleClearAll = () => {
    updateConversationsList([]);
    fetch('/api/history', { method: 'DELETE' }).catch((e) =>
      console.warn('Failed clearing history on server:', e)
    );
    createNewChat();
  };

  // Streaming Hook
  const {
    sendMessage,
    stopGenerating,
    isStreaming,
    tokensProcessed,
    lastDurationMs
  } = useChatStream({
    currentConversation: activeConversation,
    onUpdateConversation: handleUpdateActiveConversation,
    settings
  });

  const selectedPersonaObj = personas.find(
    (p) => p.id === settings.selectedPersona
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-dark-base">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={setActiveId}
        onNewChat={createNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAll={handleClearAll}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          personas={personas}
          selectedPersona={settings.selectedPersona}
          onSelectPersona={(id) => handleSaveSettings({ ...settings, selectedPersona: id })}
          selectedModel={settings.selectedModel}
          models={models}
          tokensProcessed={tokensProcessed}
          lastDurationMs={lastDurationMs}
          isStreaming={isStreaming}
        />

        <ChatArea
          messages={activeConversation?.messages || []}
          isStreaming={isStreaming}
          onSendMessage={sendMessage}
          onStopGenerating={stopGenerating}
          selectedPersonaName={selectedPersonaObj?.name || 'Sentinel Prime'}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        models={models}
      />
    </div>
  );
};
export default App;
