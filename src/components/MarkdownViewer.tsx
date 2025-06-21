'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';

interface MarkdownViewerProps {
  markdownFile?: string;
  title?: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  markdownFile = 'index.md', 
  title = 'Documentation',
  className = '' 
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentFile, setCurrentFile] = useState(markdownFile);

  const markdownFiles = [
    { key: 'index.md', title: 'Documentation Index', icon: '📚' },
    { key: 'complete-data.md', title: 'Complete Data Export', icon: '📋' },
    { key: 'products.md', title: 'Product Catalog', icon: '🛍️' },
    { key: 'site-info.md', title: 'Site Information', icon: 'ℹ️' },
    { key: 'images.md', title: 'Image Gallery', icon: '🖼️' }
  ];

  useEffect(() => {
    loadMarkdownContent(currentFile);
  }, [currentFile]);

  const loadMarkdownContent = async (filename: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/markdown/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(`Error loading ${filename}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (markdown: string) => {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-pink-600 mb-6">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-pink-500 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-pink-400 mb-3 mt-6">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-semibold text-gray-800">$1</strong>')
      .replace(/^\*(.*)\*/gim, '<em class="italic text-gray-600">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">• $1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-pink-500 hover:text-pink-600 underline">$1</a>')
      .replace(/^\|(.*)\|$/gim, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.every((cell: string) => cell.match(/^-+$/))) {
          return ''; // Skip separator rows
        }
        const cellsHtml = cells.map((cell: string) => 
          `<td class="px-4 py-2 border-b border-pink-100">${cell}</td>`
        ).join('');
        return `<tr>${cellsHtml}</tr>`;
      })
      .replace(/(<tr>.*<\/tr>)/g, '<table class="w-full border-collapse bg-white rounded-lg shadow-sm mb-6 overflow-hidden">$1</table>')
      .replace(/^---$/gim, '<hr class="border-pink-200 my-8">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-pink-100 text-sm">Browse comprehensive website documentation</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {markdownFiles.map((file) => (
            <Button
              key={file.key}
              variant={currentFile === file.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentFile(file.key)}
              className="text-xs"
            >
              <span className="mr-1">{file.icon}</span>
              {file.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600">Loading documentation...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && content && (
          <div 
            className="prose prose-pink max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Documentation generated from live website data • Last updated: June 21, 2025
        </p>
      </div>
    </div>
  );
};

export default MarkdownViewer;