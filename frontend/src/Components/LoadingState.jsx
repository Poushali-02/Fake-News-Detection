import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 py-16">
      <div className="relative w-24 h-24 mb-6">
        {/* Gradient spinning outer circle */}
        <div className="absolute w-full h-full border-4 border-b-transparent border-l-blue-400 border-t-indigo-500 border-r-purple-600 rounded-full animate-spin"
             style={{animationDuration: '2.5s'}}></div>
        
        {/* Spinning inner circle with gradient */}
        <div className="absolute w-[85%] h-[85%] top-[7.5%] left-[7.5%] border-4 border-r-transparent border-t-blue-500 border-l-indigo-600 border-b-purple-500 rounded-full animate-spin" 
             style={{animationDuration: '1.8s', animationDirection: 'reverse'}}></div>
             
        {/* Pulsing center with gradient */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg"
             style={{animationDuration: '1.5s'}}></div>
                      
        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
      
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <h3 className="text-2xl font-bold mb-2">Analyzing Article</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">Our AI is examining the content for patterns and indicators of misinformation...</p>
        
        {/* Progress bar */}
        <div className="mt-6 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full animate-pulse"
               style={{ width: '100%', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Features being analyzed */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span>Language</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping opacity-75"
                   style={{ animationDelay: '0.5s' }}></div>
            </div>
            <span>Sources</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75"
                   style={{ animationDelay: '1s' }}></div>
            </div>
            <span>Context</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;