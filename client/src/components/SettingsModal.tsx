import React, { useState } from 'react';
import { X, Key, Cpu, Sliders, ShieldCheck, Check, Sparkles, RefreshCw } from 'lucide-react';
import { UserSettings, ModelOption } from '../types/chat.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  models: ModelOption[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  models
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<'models' | 'keys' | 'params'>('models');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      ...settings,
      geminiKey: '',
      openaiKey: '',
      anthropicKey: '',
      selectedModel: 'mock-sentinel',
      temperature: 0.7
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sentinel-500/10 text-sentinel-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Sentinel AI Configuration
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Plug & play API keys, model routing, and intelligence parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-dark-border px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'border-sentinel-500 text-sentinel-600 dark:text-sentinel-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Active Model
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'keys'
                ? 'border-sentinel-500 text-sentinel-600 dark:text-sentinel-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            API Keys & Fallbacks
          </button>
          <button
            onClick={() => setActiveTab('params')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'params'
                ? 'border-sentinel-500 text-sentinel-600 dark:text-sentinel-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Hyperparameters
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'models' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                Select your default language model. If no API key is detected, Sentinel will smoothly route to the local offline simulator.
              </div>
              <div className="space-y-2">
                {models.map((model) => {
                  const isSelected = formData.selectedModel === model.id;
                  return (
                    <label
                      key={model.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sentinel-500 bg-sentinel-500/5 dark:bg-sentinel-500/10'
                          : 'border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modelSelection"
                        value={model.id}
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, selectedModel: model.id })}
                        className="mt-1 text-sentinel-500 focus:ring-sentinel-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {model.name}
                          </span>
                          {model.recommended && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Recommended
                            </span>
                          )}
                          {!model.requiresKey && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                              Zero Key Needed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {model.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sentinel-500/10 border border-sentinel-500/20 text-xs text-sentinel-800 dark:text-sentinel-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sentinel-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Client Security</strong>: Keys entered here are stored in your browser's private storage and sent only to authenticate your chat streams. You can also configure them in <code>.env</code> on the server.
                </span>
              </div>

              {/* Gemini Key */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={formData.geminiKey}
                  onChange={(e) => setFormData({ ...formData, geminiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-base text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sentinel-500 font-mono"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Powering Gemini 2.5 Flash & 1.5 Pro
                </span>
              </div>

              {/* OpenAI Key */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={formData.openaiKey}
                  onChange={(e) => setFormData({ ...formData, openaiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-base text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sentinel-500 font-mono"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Powering GPT-4o, GPT-4o Mini
                </span>
              </div>

              {/* Anthropic Key */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={formData.anthropicKey}
                  onChange={(e) => setFormData({ ...formData, anthropicKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-base text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sentinel-500 font-mono"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Powering Claude 3.7 Sonnet & 3.5 Haiku
                </span>
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Temperature (Sampling Randomness)
                  </label>
                  <span className="text-xs font-mono font-semibold text-sentinel-500">
                    {formData.temperature.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full h-1.5 bg-gray-200 dark:bg-dark-card rounded-lg appearance-none cursor-pointer accent-sentinel-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0.0 (Precise / Deterministic)</span>
                  <span>0.7 (Standard)</span>
                  <span>1.5 (Creative / Novel)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Global System Prompt (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Leave blank to use selected persona defaults, or define global guidelines here..."
                  value={formData.customSystemPrompt}
                  onChange={(e) => setFormData({ ...formData, customSystemPrompt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-base text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sentinel-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 dark:bg-dark-base border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-sentinel-600 hover:bg-sentinel-500 text-white shadow-sm transition-colors"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
