import re
import numpy as np
import re
import tensorflow as tf
from transformers import BertTokenizer
import os
from keras import models
from transformers import TFBertModel

bert_model = TFBertModel.from_pretrained("bert-base-uncased", use_safetensors=False)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased", use_safetensors=False)

def bert_layer(inputs):
    input_ids, attention_mask = inputs
    outputs = bert_model(input_ids=input_ids, attention_mask=attention_mask)
    return outputs.last_hidden_state[:, 0, :]

MAX_LEN = 128

model = models.load_model("Utilities\\news_prediction.keras", custom_objects={'bert_layer': bert_layer})

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\sa-zA-Z0-9]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess_data(content: str):
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
