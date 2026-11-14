import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel: Warm architectural surface #F2EFE9 with 1px solid #E4E0D8 border */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#F2EFE9] border-r border-[#E4E0D8] flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Controls */}
        <div className="p-4 border-b border-[#E4E0D8] space-y-3">
          {/* + New Session ↗ Button */}
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            type="button"
            className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-sm bg-[#141413] hover:bg-[#2B2B2B] text-white font-sans font-medium text-xs tracking-tight shadow-sm transition-all group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#A459FF]" />
              <span>New Session</span>
            </div>
            <span
              className="text-[#A459FF] font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            >
              ↗
            </span>
          </button>

          {/* Navigation Markers */}
          <div className="grid gap-1 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-sm bg-[#FFFFFF] border border-[#E4E0D8] text-[#141413] font-medium shadow-xs">
              <span className="flex items-center gap-2">
                <span className="text-[#A459FF] font-bold">01</span>
                <span>Chat Terminal</span>
              </span>
              <span className="text-[10px] text-[#2D8A78] font-bold">● Active</span>
            </div>

            <button
              onClick={() => {
                onOpenKnowledge();
                if (window.innerWidth < 768) onClose();
              }}
              type="button"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-sm text-[#5C5A55] hover:text-[#141413] hover:bg-[#EFECE6] transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-[#7A7A7A]">02</span>
                <span>Knowledge Scope</span>
              </span>
              <span className="text-[10px] text-[#7A7A7A]">
                {knowledgeStatus?.totalFiles ? `${knowledgeStatus.totalFiles} files` : 'Grounded'}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenKnowledge();
                if (window.innerWidth < 768) onClose();
              }}
              type="button"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-sm text-[#5C5A55] hover:text-[#141413] hover:bg-[#EFECE6] transition-colors text-left"
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
              placeholder="Filter sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-sm text-xs bg-[#FFFFFF] border border-[#E4E0D8] text-[#141413] placeholder-[#7A7A7A] focus:outline-none focus:border-[#A459FF] transition-colors font-sans"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-[#7A7A7A]">
              {searchQuery ? 'No matching sessions' : 'No recorded sessions'}
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
                      ? 'bg-[#FFFFFF] text-[#141413] font-medium border border-[#E4E0D8] shadow-xs'
                      : 'hover:bg-[#EFECE6] text-[#5C5A55] border border-transparent'
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
                          className="w-full px-1.5 py-0.5 text-xs bg-[#FFFFFF] border border-[#A459FF] rounded-sm focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1 hover:text-emerald-700 text-[#7A7A7A]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 hover:text-red-600 text-[#7A7A7A]"
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
                        className="p-1 rounded-sm hover:bg-[#EFECE6] text-[#7A7A7A] hover:text-[#141413]"
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
                        className="p-1 rounded-sm hover:bg-[#EFECE6] text-[#7A7A7A] hover:text-red-600"
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
          <div className="p-3 border-t border-[#E4E0D8]">
            <button
              onClick={() => {
                if (confirm('Clear all conversation history? This cannot be undone.')) {
                  onClearAll();
                }
              }}
              type="button"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono text-[#7A7A7A] hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
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
