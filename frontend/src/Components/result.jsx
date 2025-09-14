import React from 'react';

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  const isReal = result.prediction === 'REAL';
  const confidencePercent = Math.round(result.confidence * 100);

  const getConfidenceLevel = (confidence) => {
    if (confidence > 0.8) return 'High confidence';
    if (confidence > 0.6) return 'Moderate confidence';
    return 'Low confidence';
  };

  return (
    <div
      className={`mt-8 p-0 rounded-lg shadow-2xl overflow-hidden max-w-xl mx-auto transform transition-all duration-500 ease-in-out animate-fade-in`}
      role="region"
      aria-live="polite"
      aria-label="News verification result"
    >
      {/* Header with gradient background */}
      <div 
        className={`p-6 ${
          isReal 
            ? 'bg-gradient-to-r from-green-600 to-green-800' 
            : 'bg-gradient-to-r from-red-600 to-red-800'
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-white flex items-center">
            {isReal ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Real News
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fake News
              </>
            )}
          </h3>
          <span
            className={`text-sm font-bold px-4 py-2 rounded-full select-none
              ${
                isReal
                  ? 'bg-green-200 text-green-900'
                  : 'bg-red-200 text-red-900'
              } shadow-lg`}
            aria-label={`Confidence level: ${getConfidenceLevel(result.confidence)}`}
          >
            {getConfidenceLevel(result.confidence)}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 border-b border-gray-200">
        {/* Confidence bar */}
        <div className="mb-6" aria-label={`Confidence level is ${confidencePercent} percent`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isReal ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-bold text-lg">Confidence Level</span>
            </div>
            <span className={`text-xl font-bold ${isReal ? 'text-green-600' : 'text-red-600'}`}>
              {confidencePercent}%
            </span>
          </div>
          
          <div className="relative pt-1">
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={confidencePercent} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-full ${
                  isReal 
                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                } transition-all duration-1000 ease-out shadow-inner relative`}
                style={{ width: `${confidencePercent}%` }}
              >
                <div className="absolute inset-0 overflow-hidden opacity-30">
                  <span className="animate-pulse"></span>
                </div>
              </div>
            </div>
            
            {/* Confidence threshold markers */}
            <div className="flex justify-between mt-1 px-1 text-xs text-gray-600">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Analysis details */}
        <div className="mb-6 text-gray-800 text-base leading-relaxed">
          <div className={`p-4 mb-4 border-l-4 ${isReal ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-r-lg`}>
            <p className="font-medium">{result.message}</p>
          </div>
          
          <p className={`mt-3 font-medium ${isReal ? 'text-green-700' : 'text-red-700'}`}>
            {isReal
              ? 'This article appears to be genuine based on our analysis.'
              : 'This article shows characteristics of fake or misleading news.'}
          </p>
        </div>

        {/* Warning/information box */}
        <section
          className={`mb-6 p-5 rounded-lg shadow-sm ${
            isReal 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
          }`}
          aria-label={isReal ? 'Verification tips' : 'Warning signs'}
        >
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 flex-shrink-0 ${isReal ? 'bg-green-200' : 'bg-red-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isReal ? 'text-green-700' : 'text-red-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className={`text-lg font-semibold mb-2 ${isReal ? 'text-green-800' : 'text-red-800'}`}>
                {isReal ? 'Verification Tips' : 'Warning Signs'}
              </h4>
              <p className="text-sm leading-relaxed">
                {isReal
                  ? 'Even though this article appears legitimate, always cross-check important information with multiple sources.'
                  : 'This content may contain misleading information. Be cautious about sharing it and verify with trusted sources.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Analyze another article button */}
      <div className={`px-6 py-4 ${isReal ? 'bg-green-50' : 'bg-red-50'}`}>
        <button
          onClick={onReset}
          className="w-full py-3 px-5 bg-gradient-to-r from-black to-gray-800 text-white text-lg font-semibold rounded-lg 
            hover:from-gray-900 hover:to-black shadow-md hover:shadow-lg transform hover:translate-y-[-1px]
            focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 
            transition-all duration-300 flex items-center justify-center"
          aria-label="Analyze another article"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Analyze Another Article
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
