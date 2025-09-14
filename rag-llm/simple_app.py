#!/usr/bin/env python3

# Simple RAG-LLM service without heavy dependencies
from flask import Flask, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY", "")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Mock data for demo
SAMPLE_ARGO_DATA = [
    {"float_id": 6902746, "temp": 15.2, "salinity": 34.5, "pressure": 10.5, "lat": -30.5, "lon": 150.1},
    {"float_id": 6902746, "temp": 14.8, "salinity": 34.7, "pressure": 20.0, "lat": -30.4, "lon": 150.2},
    {"float_id": 6902746, "temp": 14.5, "salinity": 34.9, "pressure": 30.2, "lat": -30.3, "lon": 150.3}
]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "rag-llm"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Simple response with mock data
        context = "Sample ARGO float data shows temperature ranging from 14.5-15.2°C and salinity 34.5-34.9 PSU"
        
        if API_KEY:
            prompt = f"You are an oceanographic assistant. Based on this context: {context}\n\nAnswer this question: {question}\n\nProvide a brief scientific response."
            llm = genai.GenerativeModel(model_name="gemini-1.5-flash")
            response = llm.generate_content(prompt)
            answer = response.text if response.text else "Unable to generate response."
        else:
            answer = f"Based on the available oceanographic data, here's information about: {question}. The ARGO float data shows temperature measurements between 14.5-15.2°C with corresponding salinity values."
        
        return jsonify({
            "answer": answer,
            "sources": ["ARGO Float 6902746", "Mock Research Papers"],
            "data_points": SAMPLE_ARGO_DATA
        })
    except Exception as e:
        return jsonify({"error": f"Service error: {str(e)}"}), 500

@app.route("/simulate_chain", methods=["POST"])
def simulate_chain():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Simple causal chain response
    result = f"Based on oceanographic principles, if {query}, this could lead to changes in water density, which affects circulation patterns."
    return jsonify({"result": result})

@app.route("/translate_query", methods=["POST"])
def translate_query():
    data = request.json
    user_query = data.get("question", "")
    if not user_query:
        return jsonify({"error": "No question provided"}), 400

    # Simple MongoDB query generation
    mongo_query = '{"TEMP": {"$gt": 10}, "PSAL": {"$gt": 30}}'
    return jsonify({"mongo_query": mongo_query})

if __name__ == "__main__":
    print("Starting simple RAG-LLM service...")
    app.run(host="0.0.0.0", port=8000, debug=False)