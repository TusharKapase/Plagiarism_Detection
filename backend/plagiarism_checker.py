
import os
import zipfile
import uuid
from .utils.similarity import extract_text_from_file, compute_similarity
from .utils.report_generator import generate_excel_report, generate_pdf_report


# -------------------- BATCH COMPARISON --------------------
def analyze_submissions(zip_path):
    """
    Full plagiarism detection:
    Extract ZIP → compare all .py, .c, and .java files with each other
    """

    extract_folder = os.path.join("uploads", "extracted")
    os.makedirs(extract_folder, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_folder)

    file_texts = {}

    # Collect .py, .c, .java files
    for root, _, files in os.walk(extract_folder):
        for fname in files:
            if fname.endswith((".py", ".c", ".java")):
                full_path = os.path.join(root, fname)

                text = extract_text_from_file(full_path)

                if text.strip():
                    file_texts[fname] = text

    if not file_texts:
        return {"average_score": 0.0, "details": []}

    details = []
    scores = []
    file_names = list(file_texts.keys())

    for i in range(len(file_names)):
        for j in range(i + 1, len(file_names)):

            f1 = file_names[i]
            f2 = file_names[j]

            similarity = compute_similarity(
                file_texts[f1],
                file_texts[f2]
            )

            scores.append(similarity)

            details.append({
                "file1": f1,
                "file2": f2,
                "similarity": round(similarity, 2)
            })

    average_score = round(sum(scores) / len(scores), 2) if scores else 0.0

    return {
        "average_score": average_score,
        "details": details
    }


# -------------------- PAIRWISE COMPARISON --------------------
def analyze_pairwise(path1, path2):
    """
    Handles:
    - .py / .c / .java vs file
    - file vs zip
    - zip vs zip
    """

    temp_id = str(uuid.uuid4())
    extract_base = os.path.join("uploads", "pairwise", temp_id)
    os.makedirs(extract_base, exist_ok=True)

    def collect_code_files(path):

        files = []

        # Direct file
        if path.endswith((".py", ".c", ".java")):
            files.append(path)

        # ZIP file
        elif path.endswith(".zip"):

            extract_path = os.path.join(extract_base, os.path.basename(path))
            os.makedirs(extract_path, exist_ok=True)

            with zipfile.ZipFile(path, "r") as z:
                z.extractall(extract_path)

            for root, _, fs in os.walk(extract_path):
                for f in fs:
                    if f.endswith((".py", ".c", ".java")):
                        files.append(os.path.join(root, f))

        return files

    files1 = collect_code_files(path1)
    files2 = collect_code_files(path2)

    details = []
    scores = []

    for f1 in files1:

        t1 = extract_text_from_file(f1)

        if not t1.strip():
            continue

        for f2 in files2:

            t2 = extract_text_from_file(f2)

            if not t2.strip():
                continue

            sim = compute_similarity(t1, t2)

            scores.append(sim)

            details.append({
                "file1": os.path.basename(f1),
                "file2": os.path.basename(f2),
                "similarity": round(sim, 2)
            })

    average_score = round(sum(scores) / len(scores), 2) if scores else 0.0

    result = {
        "filename": f"{os.path.basename(path1)} vs {os.path.basename(path2)}",
        "average_score": average_score,
        "details": details
    }

    excel = generate_excel_report(result)
    pdf = generate_pdf_report(result)

    return {
        "filename": result["filename"],
        "plagiarismScore": average_score,
        "results": details,
        "report_excel": os.path.basename(excel),
        "report_pdf": os.path.basename(pdf)
    }








#//////////////////////////////////////////////////////////
# import os
# import zipfile
# import uuid
# from utils.similarity import extract_text_from_file, compute_similarity, preprocess_c_code
# from utils.report_generator import generate_excel_report, generate_pdf_report


# # -------------------- BATCH COMPARISON --------------------
# def analyze_submissions(zip_path):
#     """
#     Full plagiarism detection:
#     Extract ZIP → compare all .py and .c files with each other
#     """

#     extract_folder = os.path.join("uploads", "extracted")
#     os.makedirs(extract_folder, exist_ok=True)

#     with zipfile.ZipFile(zip_path, "r") as zip_ref:
#         zip_ref.extractall(extract_folder)

#     file_texts = {}

#     # Collect .py and .c files
#     for root, _, files in os.walk(extract_folder):
#         for fname in files:
#             if fname.endswith((".py", ".c")):
#                 full_path = os.path.join(root, fname)

#                 text = extract_text_from_file(full_path)

#                 # 🔹 If C file → preprocess
#                 if fname.endswith(".c"):
#                     text = preprocess_c_code(text)

#                 if text.strip():
#                     file_texts[fname] = text

#     if not file_texts:
#         return {"average_score": 0.0, "details": []}

#     details = []
#     scores = []
#     file_names = list(file_texts.keys())

#     for i in range(len(file_names)):
#         for j in range(i + 1, len(file_names)):
#             f1, f2 = file_names[i], file_names[j]

#             similarity = compute_similarity(
#                 file_texts[f1],
#                 file_texts[f2]
#             )

#             scores.append(similarity)

#             details.append({
#                 "file1": f1,
#                 "file2": f2,
#                 "similarity": round(similarity, 2)
#             })

#     average_score = round(sum(scores) / len(scores), 2) if scores else 0.0

#     return {
#         "average_score": average_score,
#         "details": details
#     }


# # -------------------- PAIRWISE COMPARISON --------------------
# def analyze_pairwise(path1, path2):
#     """
#     Handles:
#     - .py vs .py
#     - .c vs .c
#     - .py/.c vs .zip
#     - .zip vs .zip
#     """

#     temp_id = str(uuid.uuid4())
#     extract_base = os.path.join("uploads", "pairwise", temp_id)
#     os.makedirs(extract_base, exist_ok=True)

#     def collect_code_files(path):
#         files = []

#         # Direct file
#         if path.endswith((".py", ".c")):
#             files.append(path)

#         # ZIP file
#         elif path.endswith(".zip"):
#             extract_path = os.path.join(extract_base, os.path.basename(path))
#             os.makedirs(extract_path, exist_ok=True)

#             with zipfile.ZipFile(path, "r") as z:
#                 z.extractall(extract_path)

#             for root, _, fs in os.walk(extract_path):
#                 for f in fs:
#                     if f.endswith((".py", ".c")):
#                         files.append(os.path.join(root, f))

#         return files

#     files1 = collect_code_files(path1)
#     files2 = collect_code_files(path2)

#     details = []
#     scores = []

#     for f1 in files1:
#         t1 = extract_text_from_file(f1)

#         # 🔹 Preprocess C file
#         if f1.endswith(".c"):
#             t1 = preprocess_c_code(t1)

#         if not t1.strip():
#             continue

#         for f2 in files2:
#             t2 = extract_text_from_file(f2)

#             # 🔹 Preprocess C file
#             if f2.endswith(".c"):
#                 t2 = preprocess_c_code(t2)

#             if not t2.strip():
#                 continue

#             sim = compute_similarity(t1, t2)
#             scores.append(sim)

#             details.append({
#                 "file1": os.path.basename(f1),
#                 "file2": os.path.basename(f2),
#                 "similarity": round(sim, 2)
#             })

#     average_score = round(sum(scores) / len(scores), 2) if scores else 0.0

#     result = {
#         "filename": f"{os.path.basename(path1)} vs {os.path.basename(path2)}",
#         "average_score": average_score,
#         "details": details
#     }

#     excel = generate_excel_report(result)
#     pdf = generate_pdf_report(result)

#     return {
#         "filename": result["filename"],
#         "plagiarismScore": average_score,
#         "results": details,
#         "report_excel": os.path.basename(excel),
#         "report_pdf": os.path.basename(pdf)
#     }
