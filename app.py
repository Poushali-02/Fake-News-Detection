# from flask import Flask, jsonify, request
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
        article = Article(url)
        article.download()
        article.parse()
        cleaned_text = clean_text(article.text)
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
    return pred_xgb, prediction_xgb[0]


url = "https://www.indiatvnews.com/rajasthan/jaipur-rains-old-house-building-collapses-near-subhash-chowk-area-deaths-several-injured-watch-video-2025-09-06-1006927"

print("---URL Prediction---")
pred, prediction_xgb = predict(type_of_content='url', content=url, tag='politics')
print(pred)
print(f"Probability of True news:{ prediction_xgb:.2f}")

article = '''

Late Friday night, a four-storey dilapidated building collapsed suddenly in the Chile Ka Kuwan area of Subhash Chowk, Jaipur. The tragic incident claimed the lives of 33-year-old Prabhat and his 6-year-old daughter, Pihu, while four others, including Prabhat’s wife Sunita, sustained serious injuries. Rescue operations by the State Disaster Response Force (SDRF) and Civil Defence continued throughout the night, saving seven people trapped under the debris. The building housed over 20 tenants, mostly migrant labourer families. Continuous heavy rainfall had weakened the limestone structure, which led to the collapse.

'''
print("---Text Prediction---")
pred, prediction_xgb = predict(type_of_content='text', content=article, tag='politics')
print(pred)
print(f"Probability of True news:{ prediction_xgb:.2f}")