import { useState, useEffect } from 'react';

const Input = ({ onSubmit, loading, flashMessage: propFlashMessage }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const tag = 'article'; // fixed category as 'article'

  // Update local flash message when prop changes
  useEffect(() => {
    if (propFlashMessage) {
      setFlashMessage(propFlashMessage);

      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [propFlashMessage]);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please provide the article text to analyze');
      return;
    }

    setError(null);
    setFlashMessage(null);
    onSubmit({
      type_of_content: 'article',
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-xl mx-auto p-10 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent mb-2">
          News Verification Tool
        </h2>
        <div className="mx-auto mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-md mx-auto">
          Our AI analyzes news content to detect potential misinformation with high accuracy.
        </p>
      </div>

      {/* Flash Message */}
      {flashMessage && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 rounded-md text-yellow-800 dark:text-yellow-300 flex items-center space-x-3 shadow-inner">
          <svg
            className="h-6 w-6 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-semibold">{flashMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 relative">
        <label htmlFor="input" className="flex items-center text-blue-800 dark:text-blue-400 font-semibold text-xl mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Paste Article Text:
        </label>

        <div className="relative group rounded-lg shadow-lg">
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the full article text here to analyze..."
            className="w-full min-h-[180px] p-5 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-60 resize-y shadow-md transition duration-300 ease-in-out"
            rows={7}
            spellCheck="true"
          />
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            disabled={loading}
            title="Paste from clipboard"
            className="absolute top-3 right-3 p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900 border border-red-400 rounded-lg shadow-inner animate-pulse text-red-800 dark:text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`w-full py-4 rounded-xl text-white text-lg font-bold tracking-wide shadow-lg transform transition 
            duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-400 focus:ring-opacity-70
            ${
              loading 
                ? 'bg-blue-700 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:scale-95'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
