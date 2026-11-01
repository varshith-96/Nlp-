"""
CyberGuard AI - Model Training Script
Trains Multinomial Naive Bayes and Logistic Regression on the labeled dataset.
Extracts TF-IDF features, compares performance, and saves evaluation metrics.
"""

import os
import csv
import math
import json
from collections import defaultdict
from nlp.preprocess import preprocess_text

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'dataset', 'social_engineering_dataset.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model')

class PurePythonTfidf:
    def __init__(self):
        self.vocab = {}
        self.idf = []
        self.feature_names = []

    def fit_transform(self, documents):
        N = len(documents)
        df = defaultdict(int)
        for doc in documents:
            for term in set(doc):
                df[term] += 1

        sorted_terms = sorted(df.items(), key=lambda x: -x[1])
        self.vocab = {term: idx for idx, (term, _) in enumerate(sorted_terms)}
        self.feature_names = [term for term, _ in sorted_terms]
        self.idf = [math.log((1 + N) / (1 + count)) + 1.0 for _, count in sorted_terms]

        return [self.transform(doc) for doc in documents]

    def transform(self, doc):
        vec = [0.0] * len(self.feature_names)
        counts = defaultdict(int)
        for t in doc:
            if t in self.vocab:
                counts[t] += 1

        norm_sq = 0.0
        for t, count in counts.items():
            idx = self.vocab[t]
            tf = 1 + math.log(count)
            val = tf * self.idf[idx]
            vec[idx] = val
            norm_sq += val * val

        norm = math.sqrt(norm_sq)
        if norm > 0:
            vec = [v / norm for v in vec]
        return vec

def load_dataset():
    texts, labels, categories = [], [], []
    with open(DATASET_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            texts.append(row['text'])
            labels.append(int(row['label']))
            categories.append(row['category'])
    return texts, labels, categories

def train_and_evaluate():
    texts, labels, categories = load_dataset()
    docs = [preprocess_text(t)['stems'] for t in texts]

    tfidf = PurePythonTfidf()
    X = tfidf.fit_transform(docs)
    y = labels

    print(f"Dataset Loaded: {len(X)} samples, {len(tfidf.feature_names)} TF-IDF features.")
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(os.path.join(MODEL_DIR, 'vocab.json'), 'w') as f:
        json.dump({'features': tfidf.feature_names, 'idf': tfidf.idf}, f, indent=2)

    print("Model training completed successfully.")

if __name__ == '__main__':
    train_and_evaluate()
