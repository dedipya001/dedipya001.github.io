import { RAGDocument } from './initialData.js';

export class VectorEngine {
  private documents: RAGDocument[] = [];
  private idfs: { [key: string]: number } = {};
  private docVectors: { [docId: string]: { [word: string]: number } } = {};

  constructor(documents: RAGDocument[]) {
    this.documents = documents;
    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  public updateDocuments(documents: RAGDocument[]) {
    this.documents = documents;
    this.buildIndex();
  }

  private buildIndex() {
    const N = this.documents.length;
    if (N === 0) {
      this.idfs = {};
      this.docVectors = {};
      return;
    }

    const dfs: { [word: string]: number } = {};

    // 1. Calculate Document Frequencies (DF)
    const docTokens = this.documents.map(doc => {
      const textToTokenize = `${doc.title} ${doc.content} ${(doc.tags || []).join(' ')}`;
      const tokens = this.tokenize(textToTokenize);
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach(token => {
        dfs[token] = (dfs[token] || 0) + 1;
      });
      return { id: doc.id, tokens };
    });

    // 2. Calculate Inverse Document Frequency (IDF)
    this.idfs = {};
    for (const [word, df] of Object.entries(dfs)) {
      this.idfs[word] = Math.log(1 + N / df);
    }

    // 3. Build normalized TF-IDF vectors for documents
    this.docVectors = {};
    docTokens.forEach(({ id, tokens }) => {
      const tfs: { [word: string]: number } = {};
      tokens.forEach(token => {
        tfs[token] = (tfs[token] || 0) + 1;
      });

      const vector: { [word: string]: number } = {};
      let sumSq = 0;

      for (const [word, count] of Object.entries(tfs)) {
        const idf = this.idfs[word] || 0;
        const tfidf = count * idf;
        vector[word] = tfidf;
        sumSq += tfidf * tfidf;
      }

      const magnitude = Math.sqrt(sumSq);
      if (magnitude > 0) {
        for (const word in vector) {
          vector[word] /= magnitude;
        }
      }
      this.docVectors[id] = vector;
    });
  }

  public search(query: string, topN = 3): { doc: RAGDocument; score: number }[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      // Fallback: return first N items if query is empty or not tokenizeable
      return this.documents.slice(0, topN).map(doc => ({ doc, score: 0.1 }));
    }

    // Calculate TF for query
    const queryTfs: { [word: string]: number } = {};
    queryTokens.forEach(token => {
      queryTfs[token] = (queryTfs[token] || 0) + 1;
    });

    // Build TF-IDF vector for query
    const queryVector: { [word: string]: number } = {};
    let querySumSq = 0;
    for (const [word, count] of Object.entries(queryTfs)) {
      const idf = this.idfs[word] || 0;
      const tfidf = count * idf;
      queryVector[word] = tfidf;
      querySumSq += tfidf * tfidf;
    }

    const queryMagnitude = Math.sqrt(querySumSq);
    if (queryMagnitude > 0) {
      for (const word in queryVector) {
        queryVector[word] /= queryMagnitude;
      }
    }

    // Calculate Cosine Similarity for each document
    const results = this.documents.map(doc => {
      const docVec = this.docVectors[doc.id] || {};
      let score = 0;

      // Cosine similarity
      for (const [word, queryWeight] of Object.entries(queryVector)) {
        if (docVec[word]) {
          score += queryWeight * docVec[word];
        }
      }

      // Title Boost
      const lowerQuery = query.toLowerCase();
      const lowerTitle = doc.title.toLowerCase();
      let titleBoost = 0;
      
      if (lowerTitle.includes(lowerQuery)) {
        titleBoost = 0.45;
      } else {
        const titleTokens = this.tokenize(lowerTitle);
        const overlap = queryTokens.filter(t => titleTokens.includes(t)).length;
        if (titleTokens.length > 0) {
          titleBoost = (overlap / titleTokens.length) * 0.25;
        }
      }

      // Tag Boost
      let tagBoost = 0;
      if (doc.tags) {
        const overlapTags = doc.tags.filter(t => queryTokens.includes(t.toLowerCase())).length;
        tagBoost = overlapTags * 0.2;
      }

      // Category match boost
      let categoryBoost = 0;
      if (lowerQuery.includes(doc.category.toLowerCase())) {
        categoryBoost = 0.15;
      }

      const finalScore = score + titleBoost + tagBoost + categoryBoost;

      return { doc, score: parseFloat(finalScore.toFixed(4)) };
    });

    // Filter results with score > 0, sort by score desc, and take topN
    return results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }
}
