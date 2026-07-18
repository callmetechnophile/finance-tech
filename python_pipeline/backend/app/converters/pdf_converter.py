import pdfplumber
from typing import Dict, Any

def convert_pdf_to_intermediate_format(file_content: bytes, file_name: str) -> Dict[str, Any]:
    # Write temporary file to read via pdfplumber
    temp_path = f"temp_{file_name}"
    with open(temp_path, "wb") as f:
        f.write(file_content)
        
    try:
        text_content = ""
        is_scanned = True
        
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content += page_text + "\n"
                    
        # If we successfully extracted more than 50 characters, we classify it as a Digital PDF
        if len(text_content.strip()) > 50:
            is_scanned = False
            
        import os
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if is_scanned:
            return {
                "source": "scanned_pdf",
                "format": "IMAGE_STREAM",
                "content": "SIMULATED_IMAGE_REPRESENTATION_OF_SCAN",
                "is_scanned": True
            }
        else:
            return {
                "source": "digital_pdf",
                "format": "MARKDOWN",
                "content": text_content,
                "is_scanned": False
            }
    except Exception as e:
        import os
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return {
            "source": "corrupted_pdf",
            "format": "TEXT",
            "content": f"Error parsing PDF: {str(e)}",
            "is_scanned": True
        }
