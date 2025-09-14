#rag_utils.py 

import os
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS as LangFAISS
import google.generativeai as genai
from utils.config import LLM_MODEL

# For now, use a simple mock for embeddings to avoid disk space issues
# embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
embedder = None  # Will implement simple fallback

PROMPT_TEMPLATE = """
You are an oceanographic assistant. Use the provided context to answer the user question. You are given context from ARGO NetCDF profiles and research papers.

Context:
{context}

Question:
{question}

Answer in two parts:
1. Provide a concise evidence-based narrative story answering the question (approx 120-180 words) explaining what the data suggests and likely implications.
2) List floats used (IDs) and paper titles used for evidence.
2. A JSON object called "data_points" that lists the ARGO cycles and their fields
   (Cycle, Temp, Salinity, Pressure, Latitude, Longitude, Date) relevant to your answer.

If the question is theoretical and does not require ARGO data, return "data_points": [].
Always write “This response is generated with reference to ARGO observational data and research publications. It should not replace expert human judgment.”
"""

def build_faiss_index(argo_docs, paper_docs, index_dir="faiss_index"):
    """Create simple mock retriever for now."""
    # Simple fallback implementation without heavy dependencies
    class MockRetriever:
        def __init__(self, docs):
            self.docs = docs[:10]  # Limit for demo
        
        def invoke(self, query):
            # Return first few docs as mock retrieval
            return self.docs[:3]
    
    all_docs_final = argo_docs + paper_docs
    return MockRetriever(all_docs_final)


def ask_llm(question, retriever):
    """Run query through retriever + Gemini model and return story + structured ARGO data."""
    retrieved_docs = retriever.invoke(question)
    context_text = "\n\n".join(
        f"Content: {doc.page_content}\nSource: {doc.metadata.get('source', '')}"
        for doc in retrieved_docs
    )

    prompt = PROMPT_TEMPLATE.format(context=context_text, question=question)
    llm = genai.GenerativeModel(model_name=LLM_MODEL)
    response = llm.generate_content(prompt)

    if not response.text:
        return {"answer": "I don't know.", "sources": [], "data_points": []}

    # Try parsing JSON inside the response
    try:
        text = response.text.strip()
        if "```json" in text:
            json_part = text.split("```json")[1].split("```")[0]
        elif "{\n" in text:
            json_part = text[text.index("{"):]
        else:
            json_part = '{"data_points": []}'

        import json
        parsed = json.loads(json_part)
        data_points = parsed.get("data_points", [])
    except Exception:
        data_points = []

    sources = [doc.metadata.get("source", "") for doc in retrieved_docs]

    return {
        "answer": response.text.strip(),
        "sources": sources,
        "data_points": data_points
    }