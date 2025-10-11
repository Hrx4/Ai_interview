# AI-Powered Interview Assistant 

A React-based AI-powered interview assistant designed for full-stack (React/Node) interviews.  
This project demonstrates dynamic AI-generated interview questions, timed responses, resume parsing, and a dashboard for interviewers.

---

##  Demo

- **Live Demo:** [Deployed Link](https://ai-interview-six-iota.vercel.app/)  
- **Demo Video:** [Video link](https://drive.google.com/file/d/1tEVOaXnCB94PP8AKZxm6ZQjUkhHpeqbC/view?usp=sharing)

---

##  Features

### Interviewee (Chat)
- Upload **PDF** (required) or **DOCX** (optional) resumes.  
- AI extracts **Name, Email, Phone**; missing fields are collected via chatbot.  
- Timed interview flow:
  - **6 questions**: 2 Easy → 2 Medium → 2 Hard  
  - Timers per question: Easy 20s, Medium 60s, Hard 120s  
  - Auto-submit answers on timeout  
- AI evaluates answers and generates a **final score and summary**.  
- Supports **pause/resume** with a “Welcome Back” modal.

### Interviewer (Dashboard)
- List of all candidates with **final scores** and **summary**.  
- Click a candidate to view **detailed Q&A** with AI scores.  
- Search and sort candidates.  
- Fully synced with interviewee tab.

### Persistence
- Local storage persistence using **Redux + redux-persist**  
- Restores interview progress on page reload or browser close.

---

##  Tech Stack

- **Frontend:** React, TypeScript, Ant Design  
- **State Management:** Redux Toolkit + redux-persist  
- **PDF Parsing:** `pdfjs-dist`  
- **DOCX Parsing:** `mammoth`  
- **AI Integration:** Gemini / Ollama (server-side and for local AI)
  - Resume extraction
  - Dynamic question generation
  - Answer scoring
  - Candidate summary
- **Deployment:** Vercel 

---

# Clone the repo
git clone https://github.com/Hrx4/Ai_interview

# Install dependencies
npm install

# Run locally
npm run dev
