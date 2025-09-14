#config.py 

import os
import google.generativeai as genai

# ---------------- CONFIG ----------------
API_KEY = os.getenv("GEMINI_API_KEY", "")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Model name
LLM_MODEL = "gemini-1.5-flash"
