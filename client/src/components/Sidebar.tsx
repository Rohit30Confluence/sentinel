import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { Conversation, KnowledgeStatus } from '../types/chat.js';

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
  onOpenKnowledge: () => void;
  knowledgeStatus: KnowledgeStatus | null;
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
  onClearAll,
  onOpenKnowledge,
  knowledgeStatus
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#FAF9F6] dark:bg-[#1A1A18] border-r border-[#E4E0D8] dark:border-white/10 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="p-4 border-b border-[#E4E0D8] dark:border-white/10 space-y-3">
          {/* New Chat Button with ThatJoint arrow */}
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            type="button"
            className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-sm bg-[#141413] hover:bg-[#2B2B2B] text-white dark:bg-white dark:text-[#141413] dark:hover:bg-gray-100 font-sans font-medium text-xs tracking-tight shadow-sm transition-all group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#A459FF]" />
              <span>01 / New Terminal Chat</span>
            </div>
            <span className="text-[#A459FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">
              ↗
            </span>
          </button>

          {/* Numbered Navigation Markers */}
          <div className="grid gap-1 pt-1">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-mono bg-black/5 dark:bg-white/5 text-[#141413] dark:text-white font-medium border border-[#E4E0D8] dark:border-white/10">
              <span className="flex items-center gap-2">
                <span className="text-[#A459FF]">01</span>
                <span>Chat Terminal</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Active</span>
            </div>

            <button
              onClick={() => {
                onOpenKnowledge();
                if (window.innerWidth < 768) onClose();
              }}
              type="button"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-mono text-[#5C5A55] hover:text-[#141413] dark:text-[#9E9B95] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-[#7A7A7A]">02</span>
                <span>Active Knowledge</span>
              </span>
              <span className="text-[10px] text-[#7A7A7A]">
                {knowledgeStatus ? `${knowledgeStatus.totalFiles} files` : 'Index'}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenKnowledge();
                if (window.innerWidth < 768) onClose();
              }}
              type="button"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-mono text-[#5C5A55] hover:text-[#141413] dark:text-[#9E9B95] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-[#7A7A7A]">03</span>
                <span>Operations Context</span>
              </span>
              <span className="text-[10px] text-[#7A7A7A]">5-Step</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative pt-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
            <input
              type="text"
              placeholder="Search conversation records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-sm text-xs bg-white dark:bg-[#141413] border border-[#E4E0D8] dark:border-white/10 text-[#141413] dark:text-white placeholder-[#7A7A7A] focus:outline-none focus:border-[#A459FF] transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-[#7A7A7A]">
              {searchQuery ? 'No matching logs' : 'No prior session logs'}
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
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-sm text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#242422] text-[#141413] dark:text-white font-medium border border-[#E4E0D8] dark:border-white/20 shadow-sm'
                      : 'hover:bg-white/70 dark:hover:bg-white/5 text-[#5C5A55] dark:text-[#9E9B95] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#A459FF]' : 'text-[#7A7A7A]'
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
                          className="w-full px-1.5 py-0.5 text-xs bg-white dark:bg-[#141413] border border-[#A459FF] rounded-sm focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1 hover:text-emerald-600 text-gray-400"
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

                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-0.5 ml-1 shrink-0">
                      <button
                        onClick={(e) => startRename(conv, e)}
                        type="button"
                        title="Rename"
                        className="p-1 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 text-[#7A7A7A] hover:text-[#141413] dark:hover:text-white"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete session "${conv.title}"?`)) {
                            onDeleteConversation(conv.id);
                          }
                        }}
                        type="button"
                        title="Delete"
                        className="p-1 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 text-[#7A7A7A] hover:text-red-500"
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

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="p-3 border-t border-[#E4E0D8] dark:border-white/10">
            <button
              onClick={() => {
                if (confirm('Clear all conversation history? This cannot be undone.')) {
                  onClearAll();
                }
              }}
              type="button"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono text-[#7A7A7A] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Session History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
