# Project 8M26

A Full-Stack Stealth Intelligence Tool for GBV Survivors in South Africa.

Project 8M26 is a discreet decision-support application designed to bridge the gap between the "fog of trauma" and the South African legal/medical systems. By combining React/Next.js, Python (Flask), and Llama 3.3 AI, the platform provides survivors with immediate, anonymous, and GPS-guided paths to justice.

## Live Access & Deployment

Production:[https://project8m26.vercel.app]
<br> 
Backend API: link

The frontend is hosted on Vercel for high-speed edge delivery, while the Python Triage Engine is deployed via Railway to handle the Llama 3 API handshakes and geospatial processing.


## Features

1. Stealth-First Design

Camouflage UI: The app is designed with a minimalist aesthetic. A "Stealth Mode" (Flower Icon) allows users to instantly hide the assessment and replace it with a neutral wellness screen if their privacy is compromised.

The Decoy Download: AI-generated legal summaries are saved as Flower decorations suggestions.txt. The top of the file contains actual flower care tips, hiding the legal statement further down to protect the user during a phone search.

2. Geospatial Triage Engine

National Database: A custom Python backend cross-references Thuthuzela Care Centre and Police Stations across South Africa.

Haversine Intelligence: Uses spherical geometry to calculate the absolute nearest point of safety based on the user's real-time GPS coordinates.

3. AI Incident Summarization

Llama 3.3 Integration: Leverages the Llama 3.3-70B model (via Groq) to transform raw questionnaire data into a structured, professional summary that references the Domestic Violence Act 116 of 1998.


## Data Privacy

This project was built with a Zero-Storage Policy. No survivor data is stored in a database. All assessment logic exists only in the "Current Session" (React State) and is wiped the moment the browser tab is closed, ensuring the user leaves no digital footprint for an abuser to find.