import { useState } from 'react'
import './App.css'
import Input from './Components/input'
import ResultCard from './Components/result'
import LoadingState from './Components/LoadingState'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use environment variable for API URL in production, otherwise use relative path
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/analyze` 
        : '/analyze';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        if (response.status === 415) {
          throw new Error('Invalid content type. Please ensure you\'re sending valid data.')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const data = await response.json()
      
      // Check for API-level errors
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Check for empty content after processing
      if (data.message?.includes("Invalid type") || 
          (!data.prediction && !data.confidence)) {
        throw new Error('Could not process the content. Please check if the URL is valid or if the text contains enough information.')
      }
      
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white p-8 rounded-xl shadow-lg mb-6 overflow-hidden">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight relative z-10">
              Fake News Detection
            </h1>
            <p className="text-lg max-w-lg mx-auto opacity-90 relative z-10">
              This application uses AI to detect and analyze fake news articles.
            </p>
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10 z-0">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 w-96 h-96">
                <path fill="currentColor" d="M55,-56.1C70.2,-44.7,81,-23.8,80.9,-3.9C80.8,15.9,69.8,31.9,54.5,42.4C39.3,53,19.6,58.1,1.6,56.3C-16.4,54.6,-32.9,45.8,-46.2,32.7C-59.5,19.6,-69.8,2.1,-65.7,-11.2C-61.6,-24.4,-43.1,-33.6,-27.4,-44.8C-11.8,-56,13,-69.3,33.9,-69.1C54.8,-69,104.8,-55.3,55,-56.1Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600 mt-2">
            <span className="flex-shrink-0 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <p className="text-md">
              Our AI analyzes news content to detect potential misinformation.
            </p>
          </div>
        </header>
        
        <main className="relative">
          {/* Decorative elements - make sure they're in the background with negative z-index */}
          <div className="absolute -top-6 -left-12 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply opacity-30 animate-blob blur-xl -z-10"></div>
          <div className="absolute top-0 -right-12 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000 blur-xl -z-10"></div>
          <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000 blur-xl -z-10"></div>
          
          {/* Content */}
          <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {!result && !loading && <Input onSubmit={handleSubmit} loading={loading} />}
            
            {loading && <LoadingState />}
            
            {error && !loading && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-red-100 rounded-full">
                      <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-800">
                      Error Analyzing Content
                    </h3>
                    <div className="mt-2 text-md text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {result && !loading && (
              <ResultCard result={result} onReset={handleReset} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;