
# rag-llm/app.py

from flask import Flask, request, jsonify
from utils.data_utils import load_argo_data, load_papers
from utils.rag_utils import build_faiss_index, ask_llm
from utils.simulator import ask_chain_simulator
from utils.config import LLM_MODEL
import google.generativeai as genai
# ---------------- INIT ----------------
app = Flask(__name__)

# Load data
argo_df, argo_docs = load_argo_data()
papers = load_papers()

# Build FAISS retriever
retriever = build_faiss_index(argo_docs, papers)

# ---------------- ROUTES ----------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    result = ask_llm(question, retriever)
    return jsonify(result)

@app.route("/simulate_chain", methods=["POST"])
def simulate_chain():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    result = ask_chain_simulator(query)
    return jsonify({"result": result})

PROMPT_TEMPLATE = """
You are an assistant that converts natural language questions into MongoDB queries.

The collection is called 'argo'.
Available fields are:
- FLOAT_ID (int)
- CYCLE_NUMBER (int)
- LATITUDE (float)
- LONGITUDE (float)
- TEMP (float)
- PSAL (float)
- PRES (float)
- TIME (ISODate string)

Return ONLY a valid MongoDB query in strict JSON format.
Do not include explanations.

Example:
Question: Show me profiles with temperature above 20 near latitude -30
Output: {{"TEMP": {{"$gt": 20}}, "LATITUDE": {{"$lt": -25, "$gt": -35}}}}
"""

@app.route("/translate_query", methods=["POST"])
def translate_query():
    data = request.json
    user_query = data.get("question", "")
    if not user_query:
        return jsonify({"error": "No question provided"}), 400

    # Ask LLM to create MongoDB query
    prompt = PROMPT_TEMPLATE + f"\n\nQuestion: {user_query}\nOutput:"
    llm = genai.GenerativeModel(model_name=LLM_MODEL)
    response = llm.generate_content(prompt)

    mongo_query = response.text.strip() if response.text else "{}"

    # Return only the query (Node.js will execute it)
    return jsonify({"mongo_query": mongo_query})
    
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
