# Project8M26: Frontend

This is the interactive client-side application for Project 8M26. It is designed to be a high-speed, discreet portal for South African survivors to access medical triage and legal documentation.

## Tech Stack
Framework: Next.js 15 (App Router)

Language: TypeScript / React 19

Styling: Tailwind CSS

Components: Shadcn UI & Lucide React Icons

State Management: React Hooks (useState, useEffect)

## Features
1. The "Stealth" Flower Toggle

To ensure user safety in high-risk environments, a "Quick-Hide" flower icon is pinned to the top-right of the screen.

Action: Clicking the icon immediately swaps the triage UI for a generic "Flower Decoration Blog."

Purpose: To prevent discovery if a third party enters the room or looks at the screen.

2. Time-Sensitive Triage UI

A dynamic slider allows users to input how many hours have passed since an incident.

Logic: If the input is ≤ 72 hours, the UI triggers a CRITICAL alert, highlighting the window for PEP (HIV prevention) and J88 forensic evidence collection.

3. AI-Driven Decoy Download

The frontend communicates with the Flask backend to generate a legal summary.

Filename: Flower decorations suggestions.txt

Camouflage: The file is prepended with 200+ characters of actual floral care tips to hide the legal statement from casual inspection.

## Local Setup
Install dependencies:

Bash
cd Frontend
npm install
Run the development server:

Bash
npm run dev
Environment Sync: Ensure the fetch calls in project-8m26.tsx are pointing to your local Python server (usually http://127.0.0.1:5000).
