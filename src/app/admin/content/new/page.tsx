'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Settings,
  Image,
  Link as LinkIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Loader2
} from 'lucide-react';

interface ContentData {
  type: 'PAGE' | 'BLOG_POST' | 'BANNER' | 'FAQ';
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  metadata: {
    author?: string;
    tags?: string[];
    category?: string;
    template?: string;
  };
}

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  const [formData, setFormData] = useState<ContentData>({
    type: (searchParams.get('type') as any) || 'PAGE',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    published: false,
    metadata: {
      tags: [],
      category: '',
      template: 'default'
    }
  });

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const handleInputChange = (field: keyof ContentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const insertAtCursor = (text: string) => {
    if (contentRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const submitData = {
        ...formData,
        published: publish,
        content: contentRef.current?.innerHTML || formData.content
      };

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/content/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create content');
      }
    } catch (error) {
      console.error('Failed to create content:', error);
      alert('Failed to create content');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.metadata.tags?.includes(tag)) {
      handleMetadataChange('tags', [...(formData.metadata.tags || []), tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleMetadataChange('tags', formData.metadata.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const getTypeConfig = () => {
    switch (formData.type) {
      case 'BLOG_POST':
        return {
          title: 'New Blog Post',
          icon: '📝',
          description: 'Create engaging blog content',
          fields: ['excerpt', 'featuredImage', 'tags', 'category']
        };
      case 'BANNER':
        return {
          title: 'New Banner',
          icon: '🎨',
          description: 'Create promotional banners',
          fields: ['featuredImage', 'template']
        };
      case 'FAQ':
        return {
          title: 'New FAQ Item',
          icon: '❓',
          description: 'Add frequently asked questions',
          fields: ['category']
        };
      default:
        return {
          title: 'New Page',
          icon: '📄',
          description: 'Create static pages',
          fields: ['template']
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/content"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Content
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <span className="text-2xl mr-2">{typeConfig.icon}</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{typeConfig.title}</h1>
                  <p className="text-sm text-gray-500">{typeConfig.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              
              <button
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading || !formData.title}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              
              <button
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading || !formData.title}
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title and Slug */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full text-3xl font-bold border-0 outline-none placeholder-gray-400 resize-none"
                    style={{ background: 'transparent' }}
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">URL:</span>
                  <span className="text-gray-400">{process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.com'}/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                    placeholder="url-slug"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center space-x-1 flex-wrap gap-2">
                  <button
                    onClick={() => formatText('bold')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('italic')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('underline')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  <button
                    onClick={() => formatText('justifyLeft')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('justifyCenter')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('justifyRight')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  <button
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('insertOrderedList')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  <button
                    onClick={() => formatText('formatBlock', 'blockquote')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Quote className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText('formatBlock', 'pre')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Code className="h-4 w-4" />
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  <select
                    onChange={(e) => formatText('formatBlock', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">Format</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="p">Paragraph</option>
                  </select>
                </div>
              </div>
              
              {/* Editor */}
              <div className="p-6">
                <div
                  ref={contentRef}
                  contentEditable
                  className="min-h-96 outline-none prose prose-lg max-w-none"
                  style={{ minHeight: '400px' }}
                  onInput={(e) => handleInputChange('content', e.currentTarget.innerHTML)}
                  data-placeholder="Start writing your content..."
                />
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: contentRef.current?.innerHTML || formData.content }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="PAGE">Page</option>
                    <option value="BLOG_POST">Blog Post</option>
                    <option value="BANNER">Banner</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Publish immediately
                  </label>
                </div>
              </div>
            </div>

            {/* Type-specific Fields */}
            {typeConfig.fields.includes('excerpt') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Excerpt</h3>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Write a short excerpt..."
                />
              </div>
            )}

            {typeConfig.fields.includes('featuredImage') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Image URL"
                  />
                  {formData.featuredImage && (
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            )}

            {typeConfig.fields.includes('tags') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.metadata.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-pink-600 hover:text-pink-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addTag(input.value.trim());
                        input.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {typeConfig.fields.includes('category') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                <input
                  type="text"
                  value={formData.metadata.category}
                  onChange={(e) => handleMetadataChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter category"
                />
              </div>
            )}

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="SEO title (60 chars max)"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoTitle?.length || 0}/60 characters
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Meta description (160 chars max)"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}