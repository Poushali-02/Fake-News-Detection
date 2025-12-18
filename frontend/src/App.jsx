import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    type_of_content: 'text',
    tag: 'news',
    content: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getResultClass = (prediction) => {
    switch (prediction?.toLowerCase()) {
      case 'real': return 'real';
      case 'fake': return 'fake';
      case 'unknown': return 'unknown';
      default: return 'error';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/50">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📰 Fake News Detector
          </h1>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            Analyze content accuracy with AI-powered detection
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content Type:
            </label>
            <select
              value={formData.type_of_content}
              onChange={(e) => setFormData({...formData, type_of_content: e.target.value})}
              className="w-full p-4 border border-slate-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-lg shadow-sm hover:shadow-md"
              required
            >
              <option value="text">Text</option>
              <option value="news">News</option>
              <option value="social">Social Media</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category:
            </label>
            <select
              value={formData.tag}
              onChange={(e) => setFormData({...formData, tag: e.target.value})}
              className="w-full p-4 border border-slate-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-lg shadow-sm hover:shadow-md"
              required
            >
              <option value="news">News</option>
              <option value="politics">Politics</option>
              <option value="finance">Finance</option>
              <option value="tech">Technology</option>
              <option value="health">Health</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content to Analyze:
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={6}
              className="w-full p-5 border border-slate-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-lg resize-vertical shadow-sm hover:shadow-md placeholder-slate-400"
              placeholder="Paste your text, news article, or social media post here..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze Content
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-white font-bold text-sm">!</span>
              </div>
              <div>
                <strong className="text-red-900 font-semibold block mb-1">Error:</strong>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className={`mt-8 p-8 rounded-2xl shadow-xl border-4 transition-all duration-500 transform hover:scale-[1.02] ${
            getResultClass(result.prediction) === 'real' 
              ? 'bg-emerald-50 border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100' 
            : getResultClass(result.prediction) === 'fake'
              ? 'bg-red-50 border-red-300 bg-gradient-to-br from-red-50 to-red-100'
              : getResultClass(result.prediction) === 'unknown'
                ? 'bg-amber-50 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100'
                : 'bg-slate-50 border-slate-300'
          }`}>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                getResultClass(result.prediction) === 'real' ? 'bg-emerald-500 text-white' :
                getResultClass(result.prediction) === 'fake' ? 'bg-red-500 text-white' :
                getResultClass(result.prediction) === 'unknown' ? 'bg-amber-500 text-white' :
                'bg-slate-500 text-white'
              }`}>
                {getResultClass(result.prediction) === 'real' ? '✅' :
                 getResultClass(result.prediction) === 'fake' ? '❌' :
                 getResultClass(result.prediction) === 'unknown' ? '❓' : '⚠️'}
              </span>
              Prediction: 
              <span className={`font-black text-2xl ${
                getResultClass(result.prediction) === 'real' ? 'text-emerald-700' :
                getResultClass(result.prediction) === 'fake' ? 'text-red-700' :
                getResultClass(result.prediction) === 'unknown' ? 'text-amber-700' : 'text-slate-700'
              }`}>
                {result.prediction}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm border">
                <strong className="text-lg block text-slate-800 mb-2">Confidence Score</strong>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      getResultClass(result.prediction) === 'real' ? 'bg-emerald-500' :
                      getResultClass(result.prediction) === 'fake' ? 'bg-red-500' :
                      getResultClass(result.prediction) === 'unknown' ? 'bg-amber-500' : 'bg-slate-500'
                    }`}
                    style={{width: `${(result.confidence * 100).toFixed(1)}%`}}
                  ></div>
                </div>
                <p className="font-mono text-2xl font-bold mt-2 text-slate-800">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-lg text-slate-800 leading-relaxed mb-4">{result.message}</p>
            {result.flash_message && (
              <p className="text-sm italic text-slate-600 bg-white/70 p-4 rounded-xl backdrop-blur-sm border-l-4 border-indigo-300">
                💡 {result.flash_message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
