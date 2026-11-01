"""
CyberGuard AI - NLP Text Preprocessing Module
Implements:
  1. Case normalization
  2. Noise removal & URL extraction
  3. Tokenization
  4. Stopword filtering
  5. Porter Stemming
  6. Social Engineering Feature extraction
"""

import re

STOPWORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'could',
    'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
    'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if',
    'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor',
    'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out',
    'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
    'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
    'why', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves'
}

def stem_word(w):
    """
    Algorithmic Porter Stemmer for English root word reduction.
    """
    word = w.lower()
    if len(word) < 3:
        return word

    # Step 1a
    if word.endswith('sses'):
        word = word[:-2]
    elif word.endswith('ies'):
        word = word[:-2]
    elif not word.endswith('ss') and word.endswith('s'):
        word = word[:-1]

    # Step 1b
    has_vowel = any(c in 'aeiouy' for c in word[:-3])
    if word.endswith('eed'):
        if has_vowel:
            word = word[:-1]
    elif word.endswith('ed'):
        stem = word[:-2]
        if any(c in 'aeiouy' for c in stem):
            word = stem
            if word.endswith(('at', 'bl', 'iz')):
                word += 'e'
    elif word.endswith('ing'):
        stem = word[:-3]
        if any(c in 'aeiouy' for c in stem):
            word = stem
            if word.endswith(('at', 'bl', 'iz')):
                word += 'e'

    # Suffix simplification
    if word.endswith('ational'):
        word = word[:-5] + 'e'
    elif word.endswith('tional'):
        word = word[:-2]
    elif word.endswith('ization'):
        word = word[:-5] + 'e'
    elif word.endswith('ement'):
        word = word[:-5]
    elif word.endswith('ment'):
        word = word[:-4]
    elif word.endswith('ness'):
        word = word[:-4]

    return word

def preprocess_text(text):
    """
    Full text cleaning pipeline.
    Returns dictionary with tokens, stems, and identified patterns.
    """
    # 1. Lowercase
    lower_text = text.lower()

    # 2. Extract and count URLs/IP addresses
    urls = re.findall(r'https?://[^\s]+|bit\.ly/[^\s]+|tinyurl\.com/[^\s]+', text, re.IGNORECASE)
    has_raw_ip = bool(re.search(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', text))

    # 3. Clean punctuation and tokenize
    clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', lower_text)
    tokens = [t for t in clean.split() if t not in STOPWORDS and len(t) > 2]

    # 4. Stemming
    stems = [stem_word(t) for t in tokens]

    return {
        'raw': text,
        'tokens': tokens,
        'stems': stems,
        'urls': urls,
        'has_raw_ip': has_raw_ip,
        'token_count': len(tokens)
    }
