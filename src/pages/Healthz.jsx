import { useState, useEffect } from 'react';
import apiUrl from '../api';

export default function Healthz() {
  // Backend URL - change this when deploying
  // const API_URL = 'http://localhost:8001';

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHealth();
    // Refresh every 5 seconds
    const interval = setInterval(loadHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to check health - GET request
  async function loadHealth() {
    try {
      // Make GET request to health check endpoint
      const response = await fetch(`${apiUrl}/healthz`);
      
      // Convert response to JSON
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error('Health check failed');
      }

      setHealth(result);
      setError('');
    } catch (err) {
      setError(err.message || 'Health check failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Health Check</h1>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500">Checking health...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">System Unhealthy</h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : health ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-gray-900">System Healthy</h2>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Status: </span>
                <span className="text-sm text-gray-900">{health.ok ? 'OK' : 'Unknown'}</span>
              </div>
              {health.version && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Version: </span>
                  <span className="text-sm text-gray-900">{health.version}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}


