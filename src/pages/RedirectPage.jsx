import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiUrl from '../api';

export default function RedirectPage() {
  // Backend URL - change this when deploying
 

  const { code } = useParams();

  useEffect(() => {
    // Redirect to backend which will handle the redirect
    // The backend will increment clicks and return 302 redirect to target URL
    window.location.href = `${apiUrl}/${code}`;
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

