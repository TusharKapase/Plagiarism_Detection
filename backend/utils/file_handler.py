import os
import zipfile
import re

def extract_and_preprocess_zip(zip_path, output_folder):
    """
    Extracts a ZIP file and returns a list of preprocessed text file paths.
    """
    os.makedirs(output_folder, exist_ok=True)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(output_folder)

    text_files = []
    for root, _, files in os.walk(output_folder):
        for f in files:
            if f.endswith(('.py', '.txt', '.cpp', '.java')):
                path = os.path.join(root, f)
                preprocess_code(path)
                text_files.append(path)
    return text_files

def preprocess_code(file_path):
    """Cleans comments, multiple spaces, and blank lines."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        code = file.read()

    code = re.sub(r'#.*', '', code)
    code = re.sub(r'//.*', '', code)
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.S)
    code = re.sub(r'\s+', ' ', code).strip()

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(code)
