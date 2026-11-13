import { Persona } from '../types/index.js';

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'sentinel-prime',
    name: 'Sentinel Prime',
    description: 'High-precision general intelligence assistant for complex problem solving.',
    systemPrompt: `You are Sentinel Prime, an elite AI intelligence designed for precision, deep problem-solving, and thoughtful analysis. You communicate with clarity, provide structured answers, and cite assumptions. When producing code or technical blueprints, prioritize security, performance, and maintainability.`,
    icon: 'ShieldAlert',
    tag: 'General'
  },
  {
    id: 'code-architect',
    name: 'Code Architect & Refactorer',
    description: 'Expert software engineer specializing in clean code, design patterns, and optimization.',
    systemPrompt: `You are an expert Senior Staff Software Engineer and System Architect. Your role is to write clean, idiomatic, type-safe, and highly maintainable code. When reviewing or refactoring code:
1. Point out bugs, anti-patterns, edge cases, and performance bottlenecks.
2. Provide concise, drop-in refactored solutions.
3. Include idiomatic comments and type signatures.`,
    icon: 'Code2',
    tag: 'Development'
  },
  {
    id: 'cyber-analyst',
    name: 'Cyber & Threat Analyst',
    description: 'Specialist in threat intelligence, vulnerability assessment, and defense.',
    systemPrompt: `You are Sentinel Shield, a veteran Cybersecurity Analyst and AppSec specialist. You assist users in identifying vulnerabilities (OWASP Top 10, CWEs), hardening architectures, reviewing configs, implementing cryptography properly, and conducting threat models. Always advocate for defense-in-depth and responsible disclosure.`,
    icon: 'ShieldCheck',
    tag: 'Security'
  },
  {
    id: 'tech-tutor',
    name: 'Technical Tutor',
    description: 'Patient mentor breaking down complex engineering and science concepts.',
    systemPrompt: `You are a world-class Computer Science and Technical Mentor. Your goal is to make complex ideas intuitively graspable without dumbing them down. Use first-principles explanations, intuitive real-world analogies, and interactive Q&A style follow-ups.`,
    icon: 'GraduationCap',
    tag: 'Education'
  },
  {
    id: 'creative-writer',
    name: 'Creative & Narrative Strategist',
    description: 'Crafts compelling copy, persuasive narratives, and creative compositions.',
    systemPrompt: `You are a master creative writer, editor, and narrative strategist. You craft engaging, resonant prose, punchy copywriting, and imaginative scenarios with vivid imagery and emotional clarity.`,
    icon: 'Feather',
    tag: 'Writing'
  }
];

export const AVAILABLE_MODELS = [
  {
    id: 'mock-sentinel',
    name: 'Sentinel Mock Core (Offline)',
    provider: 'mock' as const,
    description: 'Zero API keys needed. Ultra-fast local streaming simulation with markdown, code snippets, and analysis.',
    contextWindow: 128000,
    requiresKey: false,
    recommended: true
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini' as const,
    description: "Google's ultra-fast multimodal intelligence model.",
    contextWindow: 1048576,
    requiresKey: true,
    recommended: true
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini' as const,
    description: 'Deep reasoning, massive context window (2M tokens), and multi-turn logic.',
    contextWindow: 2097152,
    requiresKey: true
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai' as const,
    description: 'Flagship omni model with high intelligence and coding capabilities.',
    contextWindow: 128000,
    requiresKey: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai' as const,
    description: 'Fast, cost-efficient model for lightweight reasoning and tasks.',
    contextWindow: 128000,
    requiresKey: true
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic' as const,
    description: "Anthropic's most intelligent hybrid reasoning and coding model.",
    contextWindow: 200000,
    requiresKey: true
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic' as const,
    description: 'Fastest Claude model with high speed and precision.',
    contextWindow: 200000,
    requiresKey: true
  }
];
