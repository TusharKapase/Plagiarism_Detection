import re
from collections import Counter
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import Levenshtein
import os


import re
from collections import Counter
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import Levenshtein
import os


# -----------------------
# C CODE PREPROCESSING
# -----------------------

def preprocess_c_code(code: str) -> str:
    """
    Remove C comments and normalize whitespace.
    """
    # Remove multi-line comments /* ... */
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)

    # Remove single-line comments // ...
    code = re.sub(r'//.*', '', code)

    # Normalize whitespace
    code = re.sub(r'\s+', ' ', code)

    return code.strip()


# -----------------------
# JAVA CODE PREPROCESSING
# -----------------------

def preprocess_java_code(code: str) -> str:
    """
    Remove Java comments and normalize whitespace.
    """
    # Remove multi-line comments
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)

    # Remove single-line comments
    code = re.sub(r'//.*', '', code)

    # Normalize whitespace
    code = re.sub(r'\s+', ' ', code)

    return code.strip()


# -----------------------
# File Text Extraction Helper
# -----------------------

def extract_text_from_file(filepath):
    """Safely read text content from source code file."""
    try:
        ext = os.path.splitext(filepath)[1].lower()

        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # Language preprocessing
        if ext == ".c":
            content = preprocess_c_code(content)

        elif ext == ".java":
            content = preprocess_java_code(content)

        # Normalize whitespace
        content = re.sub(r'\s+', ' ', content)
        content = content.strip()

        return content

    except Exception as e:
        print(f"[Error] Could not read file {filepath}: {e}")
        return ""


# -----------------------
# Individual Similarity Functions
# -----------------------

def jaccard_similarity(text1, text2):
    tokens1, tokens2 = set(text1.split()), set(text2.split())
    if not tokens1 or not tokens2:
        return 0
    return len(tokens1 & tokens2) / len(tokens1 | tokens2) * 100


def cosine_similarity_tfidf(text1, text2):
    vectorizer = TfidfVectorizer(token_pattern=r'\b\w+\b')
    tfidf = vectorizer.fit_transform([text1, text2])
    return (tfidf * tfidf.T).toarray()[0, 1] * 100


def levenshtein_similarity(text1, text2):
    max_len = max(len(text1), len(text2))
    if max_len == 0:
        return 0
    return (1 - Levenshtein.distance(text1, text2) / max_len) * 100


def keyword_symbol_similarity(text1, text2):
    counter1 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text1))
    counter2 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text2))

    keys = set(counter1.keys()).union(counter2.keys())
    if not keys:
        return 0

    score = sum(min(counter1[k], counter2[k]) for k in keys) / \
            sum(max(counter1[k], counter2[k]) for k in keys)

    return score * 100


# -----------------------
# KL Divergence & Jensen–Shannon Divergence
# -----------------------

def _get_probability_distribution(text):
    tokens = re.findall(r'\b\w+\b|[^\s\w]', text)

    if not tokens:
        return {}

    counter = Counter(tokens)
    total = sum(counter.values())

    return {k: v / total for k, v in counter.items()}


def kl_divergence(p, q):
    keys = set(p.keys()).union(q.keys())

    p_vec = np.array([p.get(k, 1e-10) for k in keys])
    q_vec = np.array([q.get(k, 1e-10) for k in keys])

    divergence = np.sum(p_vec * np.log(p_vec / q_vec))

    return max(0, (1 / (1 + divergence)) * 100)


def jensen_shannon_divergence(text1, text2):

    p = _get_probability_distribution(text1)
    q = _get_probability_distribution(text2)

    if not p or not q:
        return 0

    keys = set(p.keys()).union(q.keys())

    p_vec = np.array([p.get(k, 1e-10) for k in keys])
    q_vec = np.array([q.get(k, 1e-10) for k in keys])

    m = 0.5 * (p_vec + q_vec)

    kl_pm = np.sum(p_vec * np.log(p_vec / m))
    kl_qm = np.sum(q_vec * np.log(q_vec / m))

    js_div = 0.5 * (kl_pm + kl_qm)

    js_sim = (1 - np.sqrt(js_div)) * 100

    return max(0, min(100, js_sim))


# -----------------------
# Unified Similarity Wrapper
# -----------------------

def compute_similarity(text1, text2, method="tfidf"):
    """
    Choose which similarity metric to use.
    Default = TF-IDF cosine similarity
    """

    if method == "jaccard":
        return jaccard_similarity(text1, text2)

    elif method == "levenshtein":
        return levenshtein_similarity(text1, text2)

    elif method == "keyword":
        return keyword_symbol_similarity(text1, text2)

    elif method == "jsd":
        return jensen_shannon_divergence(text1, text2)

    elif method == "kl":
        p = _get_probability_distribution(text1)
        q = _get_probability_distribution(text2)
        return kl_divergence(p, q)

    else:
        return cosine_similarity_tfidf(text1, text2)










#///////////////////////////////////////////////////////////////////

# -----------------------
# C CODE PREPROCESSING
# -----------------------

# def preprocess_c_code(code: str) -> str:
#     """
#     Remove C comments and normalize whitespace.
#     """
#     # Remove multi-line comments /* ... */
#     code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)

#     # Remove single-line comments // ...
#     code = re.sub(r'//.*', '', code)

#     # Remove extra whitespace
#     code = re.sub(r'\s+', ' ', code)

#     return code.strip()


# # -----------------------
# # File Text Extraction Helper
# # -----------------------

# def extract_text_from_file(filepath):
#     """Safely read text content from source code file."""
#     try:
#         ext = os.path.splitext(filepath)[1].lower()

#         with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
#             content = f.read()

#         # 🔹 If C file → preprocess
#         if ext == ".c":
#             content = preprocess_c_code(content)

#         # Normalize whitespace
#         content = re.sub(r'\s+', ' ', content)
#         content = content.strip()

#         return content

#     except Exception as e:
#         print(f"[Error] Could not read file {filepath}: {e}")
#         return ""


# # -----------------------
# # Individual Similarity Functions
# # -----------------------

# def jaccard_similarity(text1, text2):
#     tokens1, tokens2 = set(text1.split()), set(text2.split())
#     if not tokens1 or not tokens2:
#         return 0
#     return len(tokens1 & tokens2) / len(tokens1 | tokens2) * 100


# def cosine_similarity_tfidf(text1, text2):
#     vectorizer = TfidfVectorizer(token_pattern=r'\b\w+\b')
#     tfidf = vectorizer.fit_transform([text1, text2])
#     return (tfidf * tfidf.T).toarray()[0, 1] * 100


# def levenshtein_similarity(text1, text2):
#     max_len = max(len(text1), len(text2))
#     if max_len == 0:
#         return 0
#     return (1 - Levenshtein.distance(text1, text2) / max_len) * 100


# def keyword_symbol_similarity(text1, text2):
#     counter1 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text1))
#     counter2 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text2))

#     keys = set(counter1.keys()).union(counter2.keys())
#     if not keys:
#         return 0

#     score = sum(min(counter1[k], counter2[k]) for k in keys) / \
#             sum(max(counter1[k], counter2[k]) for k in keys)

#     return score * 100


# # -----------------------
# # KL Divergence & Jensen–Shannon Divergence
# # -----------------------

# def _get_probability_distribution(text):
#     tokens = re.findall(r'\b\w+\b|[^\s\w]', text)
#     if not tokens:
#         return {}

#     counter = Counter(tokens)
#     total = sum(counter.values())

#     return {k: v / total for k, v in counter.items()}


# def kl_divergence(p, q):
#     keys = set(p.keys()).union(q.keys())

#     p_vec = np.array([p.get(k, 1e-10) for k in keys])
#     q_vec = np.array([q.get(k, 1e-10) for k in keys])

#     divergence = np.sum(p_vec * np.log(p_vec / q_vec))

#     # Convert divergence into similarity (0–100)
#     return max(0, (1 / (1 + divergence)) * 100)


# def jensen_shannon_divergence(text1, text2):
#     p = _get_probability_distribution(text1)
#     q = _get_probability_distribution(text2)

#     if not p or not q:
#         return 0

#     keys = set(p.keys()).union(q.keys())

#     p_vec = np.array([p.get(k, 1e-10) for k in keys])
#     q_vec = np.array([q.get(k, 1e-10) for k in keys])

#     m = 0.5 * (p_vec + q_vec)

#     kl_pm = np.sum(p_vec * np.log(p_vec / m))
#     kl_qm = np.sum(q_vec * np.log(q_vec / m))

#     js_div = 0.5 * (kl_pm + kl_qm)

#     js_sim = (1 - np.sqrt(js_div)) * 100

#     return max(0, min(100, js_sim))


# # -----------------------
# # Unified Similarity Wrapper
# # -----------------------

# def compute_similarity(text1, text2, method="tfidf"):
#     """
#     Choose which similarity metric to use.
#     Default = TF-IDF cosine similarity
#     """

#     if method == "jaccard":
#         return jaccard_similarity(text1, text2)

#     elif method == "levenshtein":
#         return levenshtein_similarity(text1, text2)

#     elif method == "keyword":
#         return keyword_symbol_similarity(text1, text2)

#     elif method == "jsd":
#         return jensen_shannon_divergence(text1, text2)

#     elif method == "kl":
#         p = _get_probability_distribution(text1)
#         q = _get_probability_distribution(text2)
#         return kl_divergence(p, q)

#     else:
#         return cosine_similarity_tfidf(text1, text2)





# import re
# from collections import Counter
# import numpy as np
# from sklearn.feature_extraction.text import TfidfVectorizer
# import Levenshtein
# import os

# # -----------------------
# # File Text Extraction Helper
# # -----------------------

# def extract_text_from_file(filepath):
#     """Safely read text content from any source code or text file."""
#     try:
#         ext = os.path.splitext(filepath)[1].lower()
#         with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
#             content = f.read()
#         # clean content
#         content = re.sub(r'\s+', ' ', content)
#         content = content.strip()
#         return content
#     except Exception as e:
#         print(f"[Error] Could not read file {filepath}: {e}")
#         return ""

# # -----------------------
# # Individual Similarity Functions
# # -----------------------

# def jaccard_similarity(text1, text2):
#     tokens1, tokens2 = set(text1.split()), set(text2.split())
#     if not tokens1 or not tokens2:
#         return 0
#     return len(tokens1 & tokens2) / len(tokens1 | tokens2) * 100

# def cosine_similarity_tfidf(text1, text2):
#     vectorizer = TfidfVectorizer(token_pattern=r'\b\w+\b')
#     tfidf = vectorizer.fit_transform([text1, text2])
#     return (tfidf * tfidf.T).toarray()[0, 1] * 100


# def levenshtein_similarity(text1, text2):
#     max_len = max(len(text1), len(text2))
#     if max_len == 0: 
#         return 0
#     return (1 - Levenshtein.distance(text1, text2) / max_len) * 100

# def keyword_symbol_similarity(text1, text2):
#     counter1 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text1))
#     counter2 = Counter(re.findall(r'\b\w+\b|[^\s\w]', text2))
#     keys = set(counter1.keys()).union(counter2.keys())
#     if not keys: 
#         return 0
#     score = sum(min(counter1[k], counter2[k]) for k in keys) / sum(max(counter1[k], counter2[k]) for k in keys)
#     return score * 100

# # -----------------------
# # KL Divergence & Jensen–Shannon Divergence
# # -----------------------

# def _get_probability_distribution(text):
#     tokens = re.findall(r'\b\w+\b|[^\s\w]', text)
#     if not tokens:
#         return {}
#     counter = Counter(tokens)
#     total = sum(counter.values())
#     return {k: v / total for k, v in counter.items()}

# def kl_divergence(p, q):
#     keys = set(p.keys()).union(q.keys())
#     p_vec = np.array([p.get(k, 1e-10) for k in keys])
#     q_vec = np.array([q.get(k, 1e-10) for k in keys])
#     divergence = np.sum(p_vec * np.log(p_vec / q_vec))
#     return max(0, (1 / (1 + divergence)) * 100)

# def jensen_shannon_divergence(text1, text2):
#     p, q = _get_probability_distribution(text1), _get_probability_distribution(text2)
#     if not p or not q:
#         return 0
#     keys = set(p.keys()).union(q.keys())
#     p_vec = np.array([p.get(k, 1e-10) for k in keys])
#     q_vec = np.array([q.get(k, 1e-10) for k in keys])
#     m = 0.5 * (p_vec + q_vec)
#     kl_pm = np.sum(p_vec * np.log(p_vec / m))
#     kl_qm = np.sum(q_vec * np.log(q_vec / m))
#     js_div = 0.5 * (kl_pm + kl_qm)
#     js_sim = (1 - np.sqrt(js_div)) * 100
#     return max(0, min(100, js_sim))

# # -----------------------
# # Unified Similarity Wrapper
# # -----------------------

# def compute_similarity(text1, text2, method="tfidf"):
#     """Choose which similarity metric to use."""
#     if method == "jaccard":
#         return jaccard_similarity(text1, text2)
#     elif method == "levenshtein":
#         return levenshtein_similarity(text1, text2)
#     elif method == "keyword":
#         return keyword_symbol_similarity(text1, text2)
#     elif method == "jsd":
#         return jensen_shannon_divergence(text1, text2)
#     elif method == "kl":
#         p, q = _get_probability_distribution(text1), _get_probability_distribution(text2)
#         return kl_divergence(p, q)
#     else:
#         return cosine_similarity_tfidf(text1, text2)
