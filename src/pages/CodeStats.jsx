import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import apiUrl from '../api';

export default function CodeStats() {
  // Backend URL - change this when deploying
  // const API_URL = 'http://localhost:8001';

  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, [code]);

  // Function to load stats for a specific code - GET request
  async function loadStats() {
    try {
      setLoading(true);
      
      // Make GET request to fetch link stats
      const response = await fetch(`${apiUrl}/api/links/${code}`);
      
      // Convert response to JSON
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(result.message || 'Failed to load link stats');
      }

      setLink(result);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load link stats');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The link you are looking for does not exist.'}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Link Details</h2>
          
          <div className="space-y-4">
            {/* Short Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Code
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono text-blue-600">{link.code}</span>
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  <Copy/>
                </button>
              </div>
            </div>

            {/* Short URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 break-all">{shortUrl}</span>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="text-sm text-gray-500 hover:text-blue-600 whitespace-nowrap"
                >
                  <Copy/>
                </button>
              </div>
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target URL
              </label>
              <div className="flex items-center gap-2">
                <a
                  href={link.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {link.target_url}
                </a>
                <button
                  onClick={() => copyToClipboard(link.target_url)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  <Copy/>
                </button>
              </div>
            </div>

            {/* Total Clicks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Clicks
              </label>
              <span className="text-2xl font-bold text-gray-900">
                {link.total_clicks || 0}
              </span>
            </div>

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created At
              </label>
              <span className="text-sm text-gray-900">
                {formatDate(link.created_at)}
              </span>
            </div>

            {/* Last Clicked */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Clicked
              </label>
              <span className="text-sm text-gray-900">
                {formatDate(link.last_clicked_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Test Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Test your link:</strong>
          </p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {shortUrl}
          </a>
        </div>
      </div>
    </div>
  );
}


