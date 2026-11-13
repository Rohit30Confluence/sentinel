import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Pin,
  Check,
  X,
  Shield,
  Download
} from 'lucide-react';
import { Conversation } from '../types/chat.js';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onClearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const submitRename = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleExport = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `# ${conv.title}\n\nDate: ${new Date(
      conv.createdAt
    ).toLocaleString()}\n\n---\n\n` +
      conv.messages
        .map(
          (m) =>
            `### ${m.role === 'user' ? 'User' : 'Sentinel AI'}\n\n${m.content}\n`
        )
        .join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-3.5 border-b border-gray-200 dark:border-dark-border space-y-2.5">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sentinel-600 hover:bg-sentinel-500 text-white font-medium text-xs shadow-sm shadow-sentinel-600/20 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-dark-card border border-transparent focus:border-sentinel-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              {searchQuery ? 'No matching conversations' : 'No chat history yet'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = conv.id === editingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-sentinel-500/10 text-sentinel-800 dark:text-sentinel-300 font-medium border border-sentinel-500/20'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-sentinel-500' : 'text-gray-400'
                      }`}
                    />

                    {isEditing ? (
                      <form
                        onSubmit={(e) => submitRename(conv.id, e)}
                        className="flex items-center gap-1 flex-1 min-w-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-1.5 py-0.5 text-xs bg-white dark:bg-dark-base border border-sentinel-500 rounded focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1 hover:text-emerald-500 text-gray-400"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 hover:text-red-500 text-gray-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  {/* Hover action buttons */}
                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-0.5 ml-1 shrink-0">
                      <button
                        onClick={(e) => handleExport(conv, e)}
                        type="button"
                        title="Export Markdown"
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-card text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => startRename(conv, e)}
                        type="button"
                        title="Rename"
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-card text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${conv.title}"?`)) {
                            onDeleteConversation(conv.id);
                          }
                        }}
                        type="button"
                        title="Delete"
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-card text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Clear All */}
        {conversations.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={() => {
                if (confirm('Clear all conversation history? This cannot be undone.')) {
                  onClearAll();
                }
              }}
              type="button"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
