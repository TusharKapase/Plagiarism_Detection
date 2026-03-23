import os
from datetime import datetime
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from textwrap import wrap


def _format_name(filename):
    """
    Converts:
    23510002_A1_-_23510002_MANE_BHUMIKA_SACHIN_1.py
    →
    MANE_BHUMIKA_SACHIN_23510002
    """
    name = filename.replace(".py", "")
    parts = name.split("_")

    prn = parts[0]
    person_name = "_".join(parts[4:-1])

    return f"{person_name}_{prn}"







def generate_excel_report(result_data, output_folder="reports"):
    os.makedirs(output_folder, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = os.path.join(output_folder, f"report_{timestamp}.xlsx")

    df = pd.DataFrame(result_data["details"])
    df.to_excel(report_path, index=False, engine="openpyxl")

    return report_path


def generate_pdf_report(result_data, output_folder="reports"):
    os.makedirs(output_folder, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = os.path.join(output_folder, f"report_{timestamp}.pdf")

    c = canvas.Canvas(report_path, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Plagiarism Detection Report")

    # Average score
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"Average Similarity: {result_data['average_score']}%")

    y = height - 120
    c.setFont("Helvetica", 10)

    for entry in result_data["details"]:
        name1 = _format_name(entry["file1"])
        name2 = _format_name(entry["file2"])
        similarity = f"{entry['similarity']}%"

        line = f"{name1}  vs  {name2}  →  {similarity}"

        wrapped_lines = wrap(line, 90)

        for wline in wrapped_lines:
            if y < 60:
                c.showPage()
                c.setFont("Helvetica", 10)
                y = height - 50

            c.drawString(50, y, wline)
            y -= 14

        y -= 10  # extra space between entries

    c.save()
    return report_path
