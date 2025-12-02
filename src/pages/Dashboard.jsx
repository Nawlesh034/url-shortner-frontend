import { useState, useEffect } from 'react';
import { ChartNoAxesColumn } from 'lucide-react';
import { Trash } from 'lucide-react';
import { Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiUrl from '../api';

export default function Dashboard() {
  // Backend URL - change this when deploying
  // const API_URL = 'http://localhost:8001';

  // State to store all links
  const [links, setLinks] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for form
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // Load all links when component mounts
  useEffect(() => {
    loadLinks();
  }, []);

  // Function to load all links from backend - GET request
  async function loadLinks() {
    try {
      setLoading(true);
      // Make GET request to fetch all links
      const response = await fetch(`${apiUrl}/api/links`);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error('Failed to load links');
      }
      
      // Convert response to JSON
      const result = await response.json();
      
      // Set the links data
      setLinks(result.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load links: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle form submission - POST request
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!targetUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data to send
      const dataToSend = {
        target_url: targetUrl.trim()
      };
      
      // Add custom code if provided
      if (customCode.trim()) {
        dataToSend.code = customCode.trim();
      }

      // Make POST request to create link
      const response = await fetch(`${apiUrl}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      // Convert response to JSON
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create link');
      }

      setSuccess('Link created successfully!');
      setTargetUrl('');
      setCustomCode('');
      // Reload links to show the new one
      loadLinks();
    } catch (err) {
      setError(err.message || 'Failed to create link');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to handle delete - DELETE request
  async function handleDelete(code) {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      // Make DELETE request
      const response = await fetch(`${apiUrl}/api/links/${code}`, {
        method: 'DELETE'
      });

      // Convert response to JSON
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete link');
      }

      setSuccess('Link deleted successfully!');
      // Reload links to update the list
      loadLinks();
    } catch (err) {
      setError(err.message || 'Failed to delete link');
    }
  }

  // Function to copy short URL to clipboard
  function copyToClipboard(code) {
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setSuccess('Short URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  }

  // Filter links based on search term
  const filteredLinks = links.filter(link => {
    const search = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(search) ||
      link.target_url.toLowerCase().includes(search)
    );
  });

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TinyLink Dashboard</h1>
          <p className="text-gray-600">Create and manage your short links</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add Link Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Short Link</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL *
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Code (optional)
              </label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Leave empty for auto-generated"
                pattern="[A-Za-z0-9]{5}"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be exactly 5 characters (A-Z, a-z, 0-9)
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or URL..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Links</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No links found matching your search' : 'No links yet. Create your first link above!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-600">
                            {link.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            className="text-xs text-gray-500 hover:text-blue-600"
                            title="Copy URL"
                          >
                            <Copy/>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate" title={link.target_url}>
                          {link.target_url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.total_clicks || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(link.last_clicked_at)}
                      </td>
                      <td className="px-6 py-4 flex gap-2 whitespace-nowrap text-sm">
                        <Link
                          href={`/code/${link.code}`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                           <ChartNoAxesColumn/>
                        </Link>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash/> 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

