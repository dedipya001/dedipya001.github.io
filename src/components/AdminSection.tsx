import React, { useState, useEffect } from 'react';
import { Plus, Trash, Database, ArrowLeft, RefreshCw, FileText } from 'lucide-react';

interface RAGDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  source: string;
}

export const AdminSection: React.FC = () => {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('other');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  
  const [message, setMessage] = useState('');

  // Fetch documents
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          source: source || 'admin_manual_upload.txt',
          tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        })
      });

      if (response.ok) {
        setMessage('Document ingested successfully!');
        // Reset form
        setTitle('');
        setContent('');
        setCategory('other');
        setSource('');
        setTags('');
        fetchDocs();
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit document');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document from the vector space?')) return;

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchDocs();
      } else {
        alert('Failed to delete document');
      }
    } catch (err) {
      console.error(err);
      alert('Error calling delete API');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-indigo-400" />
            <div>
              <h1 className="text-xl font-bold text-white">RAG Database Ingestion Control Panel</h1>
              <p className="text-xs text-slate-400">Add, list, and purge semantic knowledge vectors</p>
            </div>
          </div>
          <a 
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </a>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Form */}
          <div className="lg:col-span-1 bg-slate-850 border border-slate-700 rounded-lg p-5">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Ingest Document Chunk
            </h2>

            {message && (
              <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-xs p-2.5 rounded mb-4">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Encye RAG Library details"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="bio">Biography</option>
                    <option value="projects">Projects</option>
                    <option value="experience">Experience</option>
                    <option value="skills">Skills</option>
                    <option value="achievements">Achievements</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Source File</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. experience_file.md"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. RAG, Python, LangChain"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Text Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste details of projects, certifications or role highlights here..."
                  rows={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Ingest Vector Node
              </button>
            </form>
          </div>

          {/* Right Panel: List */}
          <div className="lg:col-span-2 bg-slate-850 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Ingested Knowledge Nodes ({documents.length})
              </h2>
              <button 
                onClick={fetchDocs}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="Refresh database view"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading && documents.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                Loading knowledge documents...
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-800 border border-slate-700 rounded-md flex justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{doc.title}</span>
                        <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Source: {doc.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {doc.content}
                      </p>
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[9px] bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-all shrink-0 self-start"
                      title="Purge Node"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
