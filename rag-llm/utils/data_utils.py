
# utils/data_utils.py

import os
import pandas as pd
from argopy import DataFetcher
from langchain_community.document_loaders import PDFPlumberLoader
from langchain.schema import Document

def load_argo_data():
    """Create mock ARGO data for demo purposes."""
    print("Loading mock ARGO float data...")
    # Create sample data instead of fetching real data
    import pandas as pd
    df = pd.DataFrame({
        'CYCLE_NUMBER': [1, 2, 3],
        'DATA_MODE': ['R', 'R', 'R'],
        'DIRECTION': ['A', 'A', 'A'],
        'PRES': [10.5, 20.0, 30.2],
        'PRES_ERROR': [0.1, 0.1, 0.1],
        'PRES_QC': [1, 1, 1],
        'PSAL': [34.5, 34.7, 34.9],
        'PSAL_ERROR': [0.01, 0.01, 0.01],
        'PSAL_QC': [1, 1, 1],
        'TEMP': [15.2, 14.8, 14.5],
        'TEMP_ERROR': [0.01, 0.01, 0.01],
        'TEMP_QC': [1, 1, 1],
        'TIME_QC': [1, 1, 1],
        'LATITUDE': [-30.5, -30.4, -30.3],
        'LONGITUDE': [150.1, 150.2, 150.3],
        'TIME': ['2023-01-01', '2023-01-02', '2023-01-03'],
        'PLATFORM_NUMBER': [6902746, 6902746, 6902746]
    })

    # Summarize rows into text
    docs = []
    for _, row in df.iterrows():
        summary = (
            f"Cycle: {row['CYCLE_NUMBER']}, Data Mode: {row['DATA_MODE']}, "
            f"Direction: {row['DIRECTION']}, PRES: {row['PRES']}, PRES_ERROR: {row['PRES_ERROR']}, "
            f"PRES_QC: {row['PRES_QC']}, PSAL: {row['PSAL']}, PSAL_ERROR: {row['PSAL_ERROR']}, "
            f"PSAL_QC: {row['PSAL_QC']}, TEMP: {row['TEMP']}, TEMP_ERROR: {row['TEMP_ERROR']}, "
            f"TEMP_QC: {row['TEMP_QC']}, TIME_QC: {row['TIME_QC']}, "
            f"LATITUDE: {row['LATITUDE']}, LONGITUDE: {row['LONGITUDE']}, TIME: {row['TIME']}"
            f"Platform number={row.get('PLATFORM_NUMBER', '')}"
        )
        docs.append(Document(page_content=summary, metadata={"source": "ARGO"}))

    return df, docs


def load_papers(pdf_folder="data/papers"):
    """Load and split research papers."""
    print("Loading research papers...")
    all_docs = []
    for filename in os.listdir(pdf_folder):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(pdf_folder, filename)
            loader = PDFPlumberLoader(pdf_path)
            all_docs.extend(loader.load())
    return all_docs
