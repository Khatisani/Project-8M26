from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
import math
from database import THUTHUZELA_CENTRES, POLICE_STATIONS
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def haversine(lat1, lon1, lat2, lon2):
    """Calculates the distance between two points on Earth in km."""
    R = 6371 
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2)**2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/api/triage', methods=['POST'])
def triage():
    try:
        data = request.json
        u_lat, u_lng = data.get('lat'), data.get('lng')
        branch = data.get('branch')
        hours = data.get('hours', 0)

        if branch == "sexual-physical":
            search_list = THUTHUZELA_CENTRES
            type_label = "Thuthuzela Care Centre"
        else:
            search_list = POLICE_STATIONS
            type_label = "Police Station"


        nearest = min(search_list, key=lambda c: haversine(u_lat, u_lng, c['lat'], c['lng']))
        dist = haversine(u_lat, u_lng, nearest['lat'], nearest['lng'])

        instructions = [
            f"Nearest {type_label} identified ({round(dist, 1)}km away).",
            "Ask for the 'FCS Unit' for specialized support."
        ]


        if branch == "sexual-physical" and hours <= 72:
            instructions.insert(0, "🚨 CRITICAL: 72-HOUR BIO-MEDICAL WINDOW ACTIVE.")
            instructions.append("Priority access to PEP and J88 forensic kit.")

        return jsonify({
            "clinic": nearest['name'],
            "type": type_label,
            "distance": f"{round(dist, 1)}km",
            "priority": "CRITICAL" if (branch == "sexual-physical" and hours <= 72) else "HIGH",
            "instructions": instructions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.json
    answers = data.get('answers', {})
    branch = data.get('branch', 'General')

    prompt = f"""
    Create a professional, objective incident summary for a South African GBV survivor.
    Branch: {branch}
    Data: {answers}
    
    1. Summarize the incident in 3 paragraphs.
    2. Reference relevant SA Law (e.g., Domestic Violence Act 116 of 1998 or Sexual Offences Act).
    3. Keep the tone neutral and ready for a police statement.
    4. Ensure the output is anonymous.
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=1024,
    )

    return jsonify({"summary": completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(port=5000, debug=True)