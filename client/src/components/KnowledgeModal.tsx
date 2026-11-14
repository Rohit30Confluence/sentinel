import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { KnowledgeStatus } from '../types/chat.js';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeStatus: KnowledgeStatus | null;
  onRefresh: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  knowledgeStatus,
  onRefresh
}) => {
  const [adminSecret, setAdminSecret] = useState('');
  const [reindexing, setReindexing] = useState(false);
  const [reindexMessage, setReindexMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReindex = async () => {
    setReindexing(true);
    setReindexMessage(null);
    try {
      const res = await fetch('/api/admin/reindex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify({ adminSecret })
      });
      const data = await res.json();
      if (res.ok) {
        setReindexMessage(`Success: Indexed ${data.totalFiles} files into ${data.totalChunks} chunks.`);
        onRefresh();
      } else {
        setReindexMessage(`Error: ${data.error || 'Failed to reindex'}`);
      }
    } catch (err: any) {
      setReindexMessage(`Network error: ${err.message}`);
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-sm bg-[#FAF9F6] border border-[#E4E0D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E0D8] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#F1E8FF] text-[#A459FF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#A459FF] uppercase tracking-wider">
                  02 / KNOWLEDGE SCOPE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-[#E3F2EE] text-[#2D8A78] border border-[#2D8A78]/30 font-bold">
                  ● Verified
                </span>
              </div>
              <h2 className="text-lg font-semibold font-display uppercase tracking-tight text-[#141413] mt-0.5">
                Service-Provider Grounded Datasets
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#7A7A7A] hover:text-[#141413] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Informational Banner */}
          <div className="p-4 rounded-sm bg-[#FFFFFF] border border-[#E4E0D8] space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#141413]">
              <ShieldCheck className="w-4 h-4 text-[#A459FF]" />
              <span>Strict Provider Governance Model</span>
            </div>
            <p className="text-[#5C5A55] leading-relaxed">
              THΛTJOINT operates on a closed, strictly managed service-provider knowledge base. All intelligence syntheses are verified against verified property ledgers, statutory tenancy requirements, and 5-step operational rhythms.
            </p>
          </div>

          {/* Dataset Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FFFFFF] border border-[#E4E0D8] rounded-sm">
              <span className="font-mono text-[10px] text-[#7A7A7A] uppercase tracking-wider block">
                Source Files
              </span>
              <strong className="text-xl font-display uppercase text-[#141413] mt-1 block">
                {knowledgeStatus?.totalFiles || 0} Documents
              </strong>
            </div>

            <div className="p-3 bg-[#FFFFFF] border border-[#E4E0D8] rounded-sm">
              <span className="font-mono text-[10px] text-[#7A7A7A] uppercase tracking-wider block">
                Active Chunks
              </span>
              <strong className="text-xl font-display uppercase text-[#141413] mt-1 block">
                {knowledgeStatus?.totalChunks || 0} Passages
              </strong>
            </div>

            <div className="p-3 bg-[#FFFFFF] border border-[#E4E0D8] rounded-sm col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] text-[#7A7A7A] uppercase tracking-wider block">
                Retrieval Engine
              </span>
              <strong className="text-xs font-mono text-[#2D8A78] mt-1 block font-bold">
                Hybrid BM25 + Vector
              </strong>
            </div>
          </div>

          {/* Document Manifest */}
          <div className="space-y-2">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A]">
              Active Indexed Datasets ({knowledgeStatus?.files?.length || 0})
            </h3>
            <div className="border border-[#E4E0D8] rounded-sm divide-y divide-[#E4E0D8] bg-[#FFFFFF] overflow-hidden">
              {(knowledgeStatus?.files || [
                '01_platform_modules.md',
                '02_operations_rhythm.md',
                '03_rollout_markets.md',
                '04_pricing_and_plans.md',
                '05_compliance_and_kyc.md',
                '06_payment_rails.md',
                '07_portfolio_residents_data.json'
              ]).map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-[#EFECE6] transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#A459FF]" />
                    <span className="font-mono text-[#141413] font-medium">{file}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#2D8A78] font-bold">● Verified</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hot-Reload & Admin Reindex */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E4E0D8] rounded-sm space-y-3">
            <div>
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#141413]">
                Hot-Reload Datasets
              </h4>
              <p className="text-[11px] text-[#5C5A55] mt-0.5">
                Drop new Markdown or JSON files into <code>server/knowledge/</code> and re-index.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Admin Secret (optional if not set in .env)"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-sm border border-[#E4E0D8] bg-[#FAF9F6] text-[#141413] font-mono focus:outline-none focus:border-[#A459FF]"
              />
              <button
                onClick={handleReindex}
                disabled={reindexing}
                type="button"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#141413] hover:bg-[#2B2B2B] text-white font-sans font-medium text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reindexing ? 'animate-spin' : ''}`} />
                <span>{reindexing ? 'Indexing...' : 'Reindex'}</span>
              </button>
            </div>

            {reindexMessage && (
              <p className="text-[11px] font-mono text-[#2D8A78] mt-1 font-bold">
                {reindexMessage}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#FAF9F6] border-t border-[#E4E0D8]">
          <span className="font-mono text-[10px] text-[#7A7A7A]">
            Indexed: {knowledgeStatus?.indexedAt ? new Date(knowledgeStatus.indexedAt).toLocaleDateString() : 'Active'}
          </span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-xs font-medium rounded-sm bg-[#141413] hover:bg-[#2B2B2B] text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
