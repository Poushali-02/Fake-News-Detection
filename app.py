from flask import Flask, jsonify, request, flash
from flask_cors import CORS
import numpy as np
import re
import tensorflow as tf
from transformers import BertTokenizer, TFBertModel
from keras.models import load_model
import warnings
warnings.filterwarnings('ignore')

# model = tf.keras.models.load_model("model.keras")
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased", use_safetensors=False)
bert_model = TFBertModel.from_pretrained("bert-base-uncased", use_safetensors=False)

def bert_layer(inputs):
    input_ids, attention_mask = inputs
    outputs = bert_model(input_ids=input_ids, attention_mask=attention_mask)
    return outputs.last_hidden_state[:, 0, :]

model = load_model('news_prediction.keras', custom_objects={'bert_layer': bert_layer})

MAX_LEN = 128

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\sa-zA-Z0-9]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess_data(content: str):
    # Tokenize the content
    content = clean_text(content)
    try:
        encoded_new = tokenizer(
        [content],
        padding='max_length',
        truncation=True,
        max_length=MAX_LEN,
        return_tensors='tf'
        )
        
        new_input_ids = encoded_new['input_ids']
        new_attention_mask = encoded_new['attention_mask']
        
        return [new_input_ids, new_attention_mask], None
    except Exception as e:
        print("Error during tokenization:", e)
        flash_message = "Unable to analyze content"
        return [np.zeros((1, MAX_LEN)), np.zeros((1, MAX_LEN))], flash_message

def predict_label(content: str):
    data, flash_message = preprocess_data(content)

    if flash_message:
        return None, flash_message

    print(f"Data inputs count: {len(data)}")
    pred_probs = model.predict(data)

    probability = float(pred_probs[0][0])
    result_text = "The news seems to be " + ("REAL." if probability > 0.5 else "FAKE.")
    
    return result_text, probability, flash_message

app = Flask(__name__, static_folder='frontend/dist')

CORS(app, resources={r"/*": {
    "origins": ["http://localhost:5173", "https://fake-news-detector.vercel.app", 
                "https://fake-news-detection-six-inky.vercel.app", "*"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
    "supports_credentials": True
}})

@app.route('/analyze', methods=['POST'])
def api_predict():
    data = request.json
    type_of_content = data.get('type_of_content')
    content = data.get('content')
    tag = data.get('tag')

    if not type_of_content or not content or not tag:
        return jsonify({'error': 'Missing required fields'}), 400


    result_text, probability, flash_message = predict_label(content)
    if result_text is None and flash_message:
        return jsonify({
            'prediction': 'UNKNOWN',
            'confidence': 0.0,
            'message': flash_message
        })
    print("Result:", result_text, "Probability:", probability)
    print("content:", content)
    
    # Prepare response data
    if probability == 0.0 and "Unable to analyze" in result_text:
        response_data = {
            'prediction': 'UNKNOWN',
            'confidence': probability,
            'message': result_text
        }
    else:
        response_data = {
            'prediction': 'REAL' if probability > 0.5 else 'FAKE',
            'confidence': probability,
            'message': result_text
        }
    
    # Add flash message if available
    if flash_message:
        response_data['flash_message'] = flash_message
    
    return jsonify(response_data)

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