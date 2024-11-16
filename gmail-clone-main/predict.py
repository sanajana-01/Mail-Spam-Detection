# predict.py

import pickle

# Load the trained model and vectorizer
with open('spam_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

def predict_spam(message):
    """
    Predicts whether a given message is spam or not.

    Parameters:
    - message (str): The message text to classify.

    Returns:
    - str: "Spam" if the message is spam, "Not Spam" otherwise.
    """
    # Vectorize the input message
    message_vect = vectorizer.transform([message])
    # Predict spam (1) or not spam (0)
    prediction = model.predict(message_vect)
    return "Spam" if prediction[0] == 1 else "Not Spam"
