import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { ChatArea } from './components/ChatArea.js';
import { KnowledgeModal } from './components/KnowledgeModal.js';
import { useChatStream } from './hooks/useChatStream.js';
import { Conversation, KnowledgeStatus } from './types/chat.js';
import {
  loadStoredConversations,
  saveStoredConversations,
  generateId
} from './utils/storage.js';

export const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(loadStoredConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [knowledgeStatus, setKnowledgeStatus] = useState<KnowledgeStatus | null>(null);

  // Fetch knowledge base status on mount
  const fetchKnowledgeStatus = () => {
    fetch('/api/knowledge/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setKnowledgeStatus(data))
      .catch((err) => console.warn('Could not fetch knowledge status:', err));
  };

  useEffect(() => {
    fetchKnowledgeStatus();

    // Fetch initial history if local is empty
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

  const updateConversationsList = (newList: Conversation[]) => {
    setConversations(newList);
    saveStoredConversations(newList);
  };

  // Ensure an active conversation always exists
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
      title: 'New Terminal Chat',
      personaId: 'sentinel-prime',
      model: 'mock-sentinel',
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

  // Chat Streaming Hook
  const {
    sendMessage,
    stopGenerating,
    isStreaming,
    tokensProcessed,
    lastDurationMs
  } = useChatStream({
    currentConversation: activeConversation,
    onUpdateConversation: handleUpdateActiveConversation
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F5F0] text-[#141413]">
      {/* Sidebar: Warm architectural panel #F2EFE9 with 1px solid #E4E0D8 border */}
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
        onOpenKnowledge={() => setKnowledgeOpen(true)}
        knowledgeStatus={knowledgeStatus}
      />

      {/* Main Terminal Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenKnowledge={() => setKnowledgeOpen(true)}
          knowledgeStatus={knowledgeStatus}
          tokensProcessed={tokensProcessed}
          lastDurationMs={lastDurationMs}
          isStreaming={isStreaming}
        />

        <ChatArea
          messages={activeConversation?.messages || []}
          isStreaming={isStreaming}
          onSendMessage={sendMessage}
          onStopGenerating={stopGenerating}
          onOpenKnowledge={() => setKnowledgeOpen(true)}
        />
      </div>

      {/* Active Knowledge Scope Modal */}
      <KnowledgeModal
        isOpen={knowledgeOpen}
        onClose={() => setKnowledgeOpen(false)}
        knowledgeStatus={knowledgeStatus}
        onRefresh={fetchKnowledgeStatus}
      />
    </div>
  );
};

export default App;
