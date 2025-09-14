from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd 
import re
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
from scipy.sparse import csr_matrix
from newspaper import Article
import xgboost as xgb
import joblib
import warnings
warnings.filterwarnings('ignore')

model = joblib.load('model.pkl')
tfidf = joblib.load('tfidf_vectorizer.pkl')
ohe = joblib.load('onehot_encoder.pkl')


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\sa-zA-Z0-9]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def get_content(content: str, type_of: str) -> str:
    cleaned_text = ""
    if type_of == 'url':
        try:
            article = Article(content)
            article.download()
            article.parse()
            cleaned_text = clean_text(article.text)
        except Exception as e:
            print(f"Error processing URL: {e}")
        return cleaned_text
    elif type_of == 'text':
        cleaned_text = clean_text(content)
        return cleaned_text
    else:
        return "Invalid type. Please use 'url' or 'text'."
    
def preprocess_data(type_of_content: str, content: str, tag:str):
    new_news_text = get_content(content, type_of=type_of_content)
    new_text_tfidf = tfidf.transform([new_news_text])
    new_tag_enc = ohe.transform([[tag]]).toarray()
    new_tag_sparse = csr_matrix(new_tag_enc)
    new_input = hstack([new_text_tfidf, new_tag_sparse])
    dtest_new = xgb.DMatrix(new_input)
    return dtest_new

def predict(type_of_content: str, content: str, tag:str):
    dtest_new = preprocess_data(type_of_content, content, tag)
    prediction_xgb = model.predict(dtest_new)
    prob_xgb = (prediction_xgb > 0.5).astype(int)
    pred_xgb = "The news is false" if prob_xgb == 0 else "The news is true"
    return pred_xgb, float(prediction_xgb[0])


app = Flask(__name__, static_folder='frontend/dist')
# Enable CORS for all domains in development, specific domain in production
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://fake-news-detector.vercel.app"]}})

@app.route('/analyze', methods=['POST'])
def api_predict():
    data = request.json
    type_of_content = data.get('type_of_content')
    content = data.get('content')
    tag = data.get('tag')

    if not type_of_content or not content or not tag:
        return jsonify({'error': 'Missing required fields'}), 400

    result_text, probability = predict(type_of_content, content, tag)
    
    return jsonify({
        'prediction': 'REAL' if probability > 0.5 else 'FAKE',
        'confidence': probability,
        'message': result_text
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        return app.send_static_file(path)
    except:
        return app.send_static_file('index.html')

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)