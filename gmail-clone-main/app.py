# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle CORS
from predict import predict_spam

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    
    message = data['message']
    prediction = predict_spam(message)
    return jsonify({'prediction': prediction}), 200

if __name__ == '__main__':
    app.run(debug=True)
