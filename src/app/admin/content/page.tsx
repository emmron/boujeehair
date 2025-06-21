'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  FileText,
  Image,
  Layout,
  Globe,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Copy,
  Star
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'PAGE' | 'BLOG_POST' | 'BANNER' | 'FAQ';
  title: string;
  slug: string;
  content: string | null;
  metadata: any;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, typeFilter, statusFilter]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter(item => item.published);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(item => !item.published);
    }

    setFilteredContent(filtered);
  };

  const togglePublished = async (itemId: string, published: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: !published })
      });

      if (response.ok) {
        setContent(prev => prev.map(item =>
          item.id === itemId ? { ...item, published: !published } : item
        ));
      }
    } catch (error) {
      console.error('Failed to toggle published status:', error);
    }
  };

  const deleteContent = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContent(prev => prev.filter(item => item.id !== itemId));
      } else {
        alert('Failed to delete content');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content');
    }
  };

  const duplicateContent = async (item: ContentItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: item.type,
          title: `${item.title} (Copy)`,
          slug: `${item.slug}-copy-${Date.now()}`,
          content: item.content,
          metadata: item.metadata,
          published: false
        })
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to duplicate content:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PAGE':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'BLOG_POST':
        return <Edit className="h-5 w-5 text-green-500" />;
      case 'BANNER':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'FAQ':
        return <Layout className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PAGE':
        return 'bg-blue-100 text-blue-800';
      case 'BLOG_POST':
        return 'bg-green-100 text-green-800';
      case 'BANNER':
        return 'bg-purple-100 text-purple-800';
      case 'FAQ':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Create and manage pages, posts, and content</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/content/new?type=PAGE"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            New Page
          </Link>
          <Link
            href="/admin/content/new?type=BLOG_POST"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="h-5 w-5 mr-2" />
            New Post
          </Link>
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Create
            </button>
            {/* Dropdown menu would go here */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{content.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(item => item.published).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Edit className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(item => !item.published).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(item => {
                  const itemDate = new Date(item.createdAt);
                  const now = new Date();
                  return itemDate.getMonth() === now.getMonth() && 
                         itemDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/content/new?type=PAGE"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Create Page</p>
              <p className="text-sm text-gray-600">Static landing pages</p>
            </div>
          </Link>
          <Link
            href="/admin/content/new?type=BLOG_POST"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
          >
            <Edit className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Write Post</p>
              <p className="text-sm text-gray-600">Blog articles & news</p>
            </div>
          </Link>
          <Link
            href="/admin/content/new?type=BANNER"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <Image className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add Banner</p>
              <p className="text-sm text-gray-600">Promotional content</p>
            </div>
          </Link>
          <Link
            href="/admin/content/new?type=FAQ"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
          >
            <Layout className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">FAQ Item</p>
              <p className="text-sm text-gray-600">Help & support</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="PAGE">Pages</option>
            <option value="BLOG_POST">Blog Posts</option>
            <option value="BANNER">Banners</option>
            <option value="FAQ">FAQ</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredContent.length} of {content.length} items
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getTypeIcon(item.type)}
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {item.published && <Star className="h-4 w-4 text-yellow-500" />}
                  <div className="relative">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Globe className="h-4 w-4 mr-1" />
                <span className="truncate">/{item.slug}</span>
              </div>
              
              {item.content && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full ${
                  item.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/content/${item.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/content/${item.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => duplicateContent(item)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteContent(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => togglePublished(item.id, item.published)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    item.published
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first piece of content'
            }
          </p>
          <div className="mt-6">
            <Link
              href="/admin/content/new"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Content
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}