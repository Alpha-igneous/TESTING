# backend/chain_simulator/simulator.py
import google.generativeai as genai

# configure Gemini
import os
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)
llm = genai.GenerativeModel("gemini-1.5-flash")

# Base causal chain knowledge (10 scenarios)
causal_chains = {
    "high salinity at surface": {
        "chain": [
            {"if": "Salinity is high at the surface", 
             "then": "Water density increases", 
             "because": "High salinity raises density compared to fresh water"},
            {"if": "Water density increases", 
             "then": "Surface water sinks", 
             "because": "Denser water moves downward (convection)"},
            {"if": "Surface water sinks", 
             "then": "Deep circulation patterns change", 
             "because": "Sinking modifies thermohaline circulation"}
        ],
        "explanation": "High salinity at the surface promotes vertical mixing and alters large-scale ocean currents."
    },
    "low temperature at depth": {
        "chain": [
            {"if": "Temperature is very low at 1000m", 
             "then": "Water density increases", 
             "because": "Cold water is denser than warm water"},
            {"if": "Density increases at depth", 
             "then": "Stratification strengthens", 
             "because": "Denser deep water makes it harder for mixing to occur"},
            {"if": "Stratification strengthens", 
             "then": "Nutrient exchange reduces", 
             "because": "Mixing barrier prevents nutrient transport"}
        ],
        "explanation": "Cold water at depth stabilizes stratification and reduces nutrient cycling."
    },
    "increased surface temperature": {
        "chain": [
            {"if": "Surface temperature rises abnormally", 
             "then": "Surface water density decreases", 
             "because": "Warm water is lighter than cold water"},
            {"if": "Density decreases", 
             "then": "Stratification increases", 
             "because": "Warm light water sits on top of cold dense water"},
            {"if": "Stratification increases", 
             "then": "Phytoplankton growth is affected", 
             "because": "Nutrients cannot rise to the surface"}
        ],
        "explanation": "This is a common driver of harmful algal blooms in warming oceans."
    },
    "oxygen minimum zone expansion": {
        "chain": [
            {"if": "Oxygen drops below threshold at mid-depth", 
             "then": "Marine life migrates away", 
             "because": "Most organisms cannot survive hypoxia"},
            {"if": "Marine life migrates", 
             "then": "Fisheries productivity drops", 
             "because": "Fish avoid oxygen-poor zones"},
            {"if": "Fisheries productivity drops", 
             "then": "Local economies are affected", 
             "because": "Fishing communities rely on catch"}
        ],
        "explanation": "Oxygen minimum zones are expanding due to climate change, impacting ecosystems and economies."
    },
    "acidification increase": {
        "chain": [
            {"if": "CO2 dissolves in seawater", 
             "then": "Ocean pH decreases", 
             "because": "Carbonic acid is formed"},
            {"if": "pH decreases", 
             "then": "Calcium carbonate dissolves", 
             "because": "Acidic water corrodes shells"},
            {"if": "Shells dissolve", 
             "then": "Coral reefs degrade", 
             "because": "Calcifying organisms cannot grow"}
        ],
        "explanation": "Ocean acidification threatens coral reefs and shellfish industries."
    },"nutrient runoff increase": {
    "chain": [
        {"if": "Excess nutrients (N, P) enter ocean from rivers", 
         "then": "Algal blooms form", 
         "because": "Nutrients act as fertilizer for phytoplankton"},
        {"if": "Algal blooms form", 
         "then": "Oxygen depletion occurs", 
         "because": "Decomposing algae consume oxygen"},
        {"if": "Oxygen depletion occurs", 
         "then": "Dead zones expand", 
         "because": "Marine life cannot survive in hypoxic areas"}
    ],
    "explanation": "Agricultural runoff drives eutrophication and creates hypoxic dead zones."
},

"sea ice decline": {
    "chain": [
        {"if": "Sea ice melts", 
         "then": "Surface albedo decreases", 
         "because": "Ice reflects sunlight, while open water absorbs heat"},
        {"if": "Albedo decreases", 
         "then": "Ocean warms faster", 
         "because": "Absorbed solar radiation increases"},
        {"if": "Ocean warms faster", 
         "then": "Further sea ice melts", 
         "because": "Positive feedback amplifies melting"}
    ],
    "explanation": "Sea ice loss creates a feedback loop that accelerates global warming."
},

"intense storm frequency increase": {
    "chain": [
        {"if": "Ocean surface warms", 
         "then": "Hurricane intensity increases", 
         "because": "Warm water fuels storm energy"},
        {"if": "Hurricane intensity increases", 
         "then": "Coastal erosion worsens", 
         "because": "Stronger waves and surge hit the shore"},
        {"if": "Coastal erosion worsens", 
         "then": "Habitats are destroyed", 
         "because": "Wetlands and mangroves are washed away"}
    ],
    "explanation": "Warmer oceans fuel stronger storms, reshaping coastlines and ecosystems."
},

"plastic pollution increase": {
    "chain": [
        {"if": "Plastic waste enters ocean", 
         "then": "Marine animals ingest plastic", 
         "because": "Small fragments resemble food"},
        {"if": "Marine animals ingest plastic", 
         "then": "Health and reproduction decline", 
         "because": "Plastics block digestion and release toxins"},
        {"if": "Reproduction declines", 
         "then": "Population collapses may occur", 
         "because": "Species cannot sustain their numbers"}
    ],
    "explanation": "Plastic pollution disrupts marine food webs and threatens biodiversity."
},

"upwelling weakening": {
    "chain": [
        {"if": "Winds driving upwelling weaken", 
         "then": "Nutrient supply to surface decreases", 
         "because": "Deep nutrient-rich water stops rising"},
        {"if": "Nutrient supply decreases", 
         "then": "Phytoplankton productivity drops", 
         "because": "Nutrients are essential for primary production"},
        {"if": "Phytoplankton productivity drops", 
         "then": "Fisheries collapse risk increases", 
         "because": "Food chain base is weakened"}
    ],
    "explanation": "Weakened upwelling reduces productivity in some of the world’s richest fisheries."
}
}


def ask_chain_simulator(query: str):
    """Feed query + base causal chains into Gemini to generate answer in if-then-because format."""
    
    chain_text = "\n\n".join(
        f"Scenario: {name}\nChain: {case['chain']}\nExplanation: {case['explanation']}"
        for name, case in causal_chains.items()
    )
    
    prompt = f"""
You are a causal reasoning oceanographic assistant. 
Here are some known oceanographic causal chains:

{chain_text}

Now, the user asks: "{query}"

Task:
- Identify the most relevant scenario(s) or combine them.
- Return the reasoning as a JSON with fields: chain (list of if-then-because steps) and explanation.
- Always format in a structured way.
"""
    response = llm.generate_content(prompt)
    
    try:
        return response.text
    except:
        return {"error": "LLM failed"}
