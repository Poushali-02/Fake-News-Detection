# Fake News Detection

A web application that analyzes news articles to determine if they are real or fake. Users can input either a URL to a news article or paste the article text directly. The application uses machine learning to analyze the content and provide a prediction on whether the news is real or fake.

## Features

- Analyze news articles via URL or text input
- Real-time prediction with confidence score
- Support for different news categories
- Responsive design for desktop and mobile
- Loading indicators for better user experience

## Tech Stack

### Backend
- Flask (Python web framework)
- XGBoost (Machine learning model)
- Newspaper3k (URL scraping and article extraction)
- Scikit-learn (Text vectorization and preprocessing)

### Frontend
- React (JavaScript UI library)
- Vite (Build tool)
- CSS for styling

## Setup Instructions

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/Poushali-02/Fake-News-Detection.git
   cd Fake-News-Detection
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install JavaScript dependencies:
   ```
   npm install
   # or if you use yarn
   yarn install
   ```

3. Build the frontend:
   ```
   npm run build
   # or if you use yarn
   yarn build
   ```

## Running the Application

1. Start the Flask backend (from the root directory):
   ```
   python app.py
   ```

2. For development, you can also run the frontend separately:
   ```
   cd frontend
   npm run dev
   # or if you use yarn
   yarn dev
   ```

3. Open your browser and navigate to:
   - Production: http://localhost:5000
   - Development: http://localhost:5173
