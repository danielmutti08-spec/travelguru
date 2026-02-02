import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const [heroImage, setHeroImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch current hero image
    fetch('/api/settings/hero_image')
      .then(res => res.json())
      .then(data => {
        setHeroImage(data.value || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings/hero_image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: heroImage }),
      });

      if (response.ok) {
        setMessage('✅ Hero image updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to update hero image');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Website Settings</h1>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Hero Image Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Homepage Hero Image</h2>
              <p className="text-gray-600 mb-4">
                This image appears as the background on the homepage hero section.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Paste the full URL of your image. Recommended size: 1920x1080px or larger.
                  </p>
                </div>

                {/* Preview */}
                {heroImage && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div
                        style={{ display: 'none' }}
                        className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
                      >
                        <div className="text-center">
                          <span className="text-4xl">🖼️</span>
                          <p className="mt-2">Invalid image URL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl ${
                message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-3">💡 Tips for best results:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Use high-quality images (at least 1920x1080px)</li>
              <li>• Choose images with good contrast for white text readability</li>
              <li>• Landscape/nature photos work best for the hero section</li>
              <li>• Use free stock photos from Unsplash.com or Pexels.com</li>
              <li>• Make sure you have rights to use the image</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
