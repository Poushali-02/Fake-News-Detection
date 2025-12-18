from flask import Flask, jsonify, request, send_from_directory
from Utilities.utils import predict_label
import os

app = Flask(__name__, static_folder='../frontend/dist')

@app.route('/predict', methods=['POST'])
def predict():
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
        
    if flash_message:
        response_data['flash_message'] = flash_message
        
    return jsonify(response_data)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)