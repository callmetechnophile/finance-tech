import csv
import io
import openpyxl
from typing import Dict, Any, List

def convert_tabular_to_records(file_content: bytes, file_name: str, file_type: str) -> Dict[str, Any]:
    try:
        records = []
        columns = []
        
        if file_type == "CSV":
            content_str = file_content.decode('utf-8', errors='ignore')
            f = io.StringIO(content_str)
            reader = csv.DictReader(f)
            records = []
            for row in reader:
                # Clean keys and values
                clean_row = {str(k).strip(): (str(v).strip() if v is not None else "") for k, v in row.items()}
                records.append(clean_row)
            columns = [str(c).strip() for c in (reader.fieldnames or [])]
            
        elif file_type == "EXCEL":
            wb = openpyxl.load_workbook(io.BytesIO(file_content), data_only=True)
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            if not rows or len(rows) == 0:
                return {
                    "success": True,
                    "format": "TABULAR",
                    "records": [],
                    "columns": [],
                    "error": None
                }
            
            # First row is headers
            columns = [str(cell).strip() if cell is not None else f"Col_{i}" for i, cell in enumerate(rows[0])]
            
            for row in rows[1:]:
                record = {}
                for idx, val in enumerate(row):
                    if idx < len(columns):
                        col_name = columns[idx]
                        record[col_name] = str(val).strip() if val is not None else ""
                records.append(record)
        else:
            return {"success": False, "records": [], "error": f"Unsupported tabular format: {file_type}"}
            
        return {
            "success": True,
            "format": "TABULAR",
            "records": records,
            "columns": columns,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "format": "TABULAR",
            "records": [],
            "columns": [],
            "error": f"Tabular parsing error: {str(e)}"
        }
