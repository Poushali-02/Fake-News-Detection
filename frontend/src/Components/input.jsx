import { useState, useEffect } from 'react';

const Input = ({ onSubmit, loading }) => {
  const [inputType, setInputType] = useState('url');
  const [input, setInput] = useState('');
  const [tag, setTag] = useState('politics');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [error, setError] = useState(null);

  const categoryOptions = [
    'Government News',
    'Middle-east',
    'News',
    'US_News',
    'left-news',
    'politics',
    'politicsNews',
    'worldnews',
  ];

  // URL validation function
  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  // Effect for URL validation
  useEffect(() => {
    if (inputType === 'url' && input.trim()) {
      setIsValidUrl(validateUrl(input));
    } else {
      setIsValidUrl(true);
    }
  }, [input, inputType]);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please provide a URL or text to analyze');
      return;
    }

    if (inputType === 'url' && !isValidUrl) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setError(null);
    onSubmit({
      type_of_content: inputType,
      content: input,
      tag,
    });
  };

  // Handler for paste from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      setError('Unable to access clipboard. Please paste manually.');
    }
  };

  // Reset the form
  const resetForm = () => {
    setInput('');
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-xl p-8 max-w-xl mx-auto border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900 mb-3">
          News Verification Tool
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg">
          Our AI analyzes news content to detect potential misinformation.
        </p>
      </div>

      {/* Toggle buttons */}
      <div className="flex mb-8 bg-blue-50 rounded-lg p-1 shadow-inner border border-blue-100">
        <button
          type="button"
          className={`flex-1 py-3 px-6 font-semibold rounded-md transition duration-300 ease-in-out flex items-center justify-center ${
            inputType === 'url' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
              : 'text-blue-800 hover:bg-blue-100'
          }`}
          onClick={() => {
            setInputType('url');
            resetForm();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
          </svg>
          URL
        </button>
        <button
          type="button"
          className={`flex-1 py-3 px-6 font-semibold rounded-md transition duration-300 ease-in-out flex items-center justify-center ${
            inputType === 'text' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
              : 'text-blue-800 hover:bg-blue-100'
          }`}
          onClick={() => {
            setInputType('text');
            resetForm();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Article Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="input" className="flex items-center mb-3 font-medium text-blue-800 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {inputType === 'url' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              )}
            </svg>
            {inputType === 'url' ? 'Enter News Article URL:' : 'Paste Article Text:'}
          </label>
          
          {inputType === 'url' ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-700 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://example.com/news-article"
                  className={`w-full p-4 text-base placeholder-gray-400 border-2 rounded-lg shadow-sm focus:outline-none
                    focus:shadow-lg transition-all duration-300 ${
                      !isValidUrl && input.trim() 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-blue-300 bg-white focus:border-blue-500'
                    }`}
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 
                              disabled:cursor-not-allowed transition p-1 rounded-full
                              hover:bg-blue-100"
                    title="Paste from clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {input.trim() && (
                <div className="mt-2 flex items-center select-none animate-fade-in">
                  {isValidUrl ? (
                    <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Valid URL</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Invalid URL format</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-700 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the full article text here..."
                className="relative w-full p-4 text-base placeholder-gray-400 border-2 border-blue-300 
                          rounded-lg shadow-sm min-h-[180px] resize-y focus:outline-none
                          focus:border-blue-500 focus:shadow-lg transition-all duration-300"
                rows={6}
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="category" className="flex items-center mb-3 font-medium text-blue-800 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Select News Category:
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-700 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative">
              <select
                id="category"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-4 pr-12 text-base border-2 border-blue-300 rounded-lg appearance-none bg-white 
                         shadow-sm focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all duration-300"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-sm flex items-center select-none animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim() || (inputType === 'url' && !isValidUrl)}
          className={`relative w-full py-4 px-6 text-white text-lg font-semibold rounded-lg overflow-hidden
                    focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 focus:ring-offset-2 
                    transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                    ${loading ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Analyze News</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default Input;
