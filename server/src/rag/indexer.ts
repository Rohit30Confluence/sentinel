import fs from 'fs';
import path from 'path';

export interface KnowledgeChunk {
  id: string;
  sourceFile: string;
  title: string;
  chunkIndex: number;
  content: string;
  keywords: string[];
}

export interface KnowledgeIndexManifest {
  version: string;
  indexedAt: string;
  totalFiles: number;
  totalChunks: number;
  files: string[];
  chunks: KnowledgeChunk[];
}

export class KnowledgeIndexer {
  private knowledgeDir: string;
  private outputFile: string;

  constructor(knowledgeDir?: string, outputFile?: string) {
    this.knowledgeDir =
      knowledgeDir || path.join(process.cwd(), 'knowledge');
    const dataDir = outputFile ? path.dirname(outputFile) : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.outputFile = outputFile || path.join(dataDir, 'knowledge_index.json');
  }

  public getIndexFilePath(): string {
    return this.outputFile;
  }

  public indexExists(): boolean {
    return fs.existsSync(this.outputFile);
  }

  public loadIndex(): KnowledgeIndexManifest | null {
    try {
      if (this.indexExists()) {
        const raw = fs.readFileSync(this.outputFile, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[KnowledgeIndexer] Failed to load index:', err);
    }
    return null;
  }

  public async buildIndex(): Promise<KnowledgeIndexManifest> {
    console.log(`[KnowledgeIndexer] Scanning knowledge directory: ${this.knowledgeDir}`);
    if (!fs.existsSync(this.knowledgeDir)) {
      fs.mkdirSync(this.knowledgeDir, { recursive: true });
    }

    const files = fs.readdirSync(this.knowledgeDir);
    const validFiles = files.filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return ['.md', '.txt', '.json', '.csv'].includes(ext);
    });

    const allChunks: KnowledgeChunk[] = [];

    for (const fileName of validFiles) {
      const fullPath = path.join(this.knowledgeDir, fileName);
      const ext = path.extname(fileName).toLowerCase();
      const rawContent = fs.readFileSync(fullPath, 'utf-8');

      if (ext === '.json') {
        const jsonChunks = this.chunkJson(fileName, rawContent);
        allChunks.push(...jsonChunks);
      } else {
        const textChunks = this.chunkText(fileName, rawContent);
        allChunks.push(...textChunks);
      }
    }

    const manifest: KnowledgeIndexManifest = {
      version: '1.0.0',
      indexedAt: new Date().toISOString(),
      totalFiles: validFiles.length,
      totalChunks: allChunks.length,
      files: validFiles,
      chunks: allChunks
    };

    fs.writeFileSync(this.outputFile, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(
      `[KnowledgeIndexer] Successfully indexed ${validFiles.length} files into ${allChunks.length} chunks.`
    );
    return manifest;
  }

  private chunkText(fileName: string, content: string): KnowledgeChunk[] {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const docTitle = titleMatch ? titleMatch[1].trim() : fileName;

    // Split text by markdown headings or paragraphs
    const paragraphs = content.split(/\n\n+/);
    const chunks: KnowledgeChunk[] = [];
    let currentBuffer = '';
    let chunkIndex = 0;

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      if ((currentBuffer + '\n\n' + trimmed).length > 650 && currentBuffer.length > 200) {
        chunks.push(this.createChunk(fileName, docTitle, chunkIndex++, currentBuffer));
        // Overlap last paragraph partially for continuity
        currentBuffer = trimmed;
      } else {
        currentBuffer = currentBuffer ? `${currentBuffer}\n\n${trimmed}` : trimmed;
      }
    }

    if (currentBuffer.trim().length > 0) {
      chunks.push(this.createChunk(fileName, docTitle, chunkIndex++, currentBuffer));
    }

    return chunks;
  }

  private chunkJson(fileName: string, content: string): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    try {
      const parsed = JSON.parse(content);
      const docTitle = parsed.dataset_name || fileName;

      if (parsed.summary) {
        chunks.push(
          this.createChunk(
            fileName,
            `${docTitle} — Overview Summary`,
            0,
            `Dataset Summary: ${JSON.stringify(parsed.summary, null, 2)}`
          )
        );
      }

      if (Array.isArray(parsed.room_types)) {
        chunks.push(
          this.createChunk(
            fileName,
            `${docTitle} — Room Typologies`,
            1,
            `Room Inventory & Allocations:\n${JSON.stringify(parsed.room_types, null, 2)}`
          )
        );
      }

      if (Array.isArray(parsed.employers)) {
        chunks.push(
          this.createChunk(
            fileName,
            `${docTitle} — Corporate Employers`,
            2,
            `Corporate Employers Breakdown:\n${JSON.stringify(parsed.employers, null, 2)}`
          )
        );
      }

      // Catch-all if structure differs
      if (chunks.length === 0) {
        chunks.push(this.createChunk(fileName, docTitle, 0, content.slice(0, 1500)));
      }
    } catch (e) {
      return this.chunkText(fileName, content);
    }
    return chunks;
  }

  private createChunk(
    fileName: string,
    title: string,
    chunkIndex: number,
    content: string
  ): KnowledgeChunk {
    const cleanContent = content.trim();
    const words = cleanContent
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const uniqueKeywords = Array.from(new Set(words)).slice(0, 30);

    return {
      id: `${path.basename(fileName, path.extname(fileName))}_chunk_${chunkIndex}`,
      sourceFile: fileName,
      title,
      chunkIndex,
      content: cleanContent,
      keywords: uniqueKeywords
    };
  }
}

export const knowledgeIndexer = new KnowledgeIndexer();
