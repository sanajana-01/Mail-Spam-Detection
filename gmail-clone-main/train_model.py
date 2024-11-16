import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import pickle

# Load dataset, specifying only the required columns
try:
    data = pd.read_csv('spam.csv', encoding='latin-1', usecols=[0, 1], names=['label', 'message'], skiprows=1)
except Exception as e:
    print("Error loading CSV file:", e)
    exit()

# Display initial data information
print("Initial data loaded:")
print(data.head())
print("Data shape:", data.shape)

# Drop rows with missing values in either 'label' or 'message' columns
data.dropna(subset=['label', 'message'], inplace=True)

# Print data shape after dropping NaNs
print("Data after dropping rows with NaNs in 'label' or 'message':")
print(data.head())
print("Data shape:", data.shape)

# Map 'ham' to 0 and 'spam' to 1, and drop rows where mapping failed
data['label'] = data['label'].map({'ham': 0, 'spam': 1})
data.dropna(subset=['label'], inplace=True)

# Print final data shape
print("Data after mapping labels:")
print(data.head())
print("Data shape:", data.shape)

# Check if data is empty
if data.shape[0] == 0:
    print("Error: No data available after processing. Please check the CSV file format.")
    exit()

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(data['message'], data['label'], test_size=0.2, random_state=42)

# Vectorize text data
vectorizer = CountVectorizer()
X_train_vect = vectorizer.fit_transform(X_train)
X_test_vect = vectorizer.transform(X_test)

# Train Naive Bayes model
model = MultinomialNB()
model.fit(X_train_vect, y_train)

# Evaluate model
predictions = model.predict(X_test_vect)
accuracy = (predictions == y_test).mean()
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save the model and vectorizer to files
with open('spam_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('vectorizer.pkl', 'wb') as vectorizer_file:
    pickle.dump(vectorizer, vectorizer_file)
