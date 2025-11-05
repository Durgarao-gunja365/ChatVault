# 🤖 ChatVault – AI Chat Portal with Conversation Intelligence

**Developer:** Gunja Durgarao  
**GitHub:** [Durgarao-gunja365](https://github.com/Durgarao-gunja365)  
**Stack:** Django REST Framework + React (Vite + Tailwind) + PostgreSQL + OpenRouter AI

---

## 🚀 Overview

**ChatVault** is a full-stack AI chat portal that lets users:

- Chat in real time with an intelligent AI assistant.
- Automatically save and summarize conversations.
- Query past conversations intelligently using semantic understanding.

It provides a modern ChatGPT-like interface powered by **OpenRouter** for AI responses, and a Django REST backend with persistent PostgreSQL storage.

---

<h2 align="center">📸 Project Screenshots</h2>

<p align="center">
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/home%20page.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/home%20page.png" width="500" alt="Home Page"/>
  </a>
  <br>
  <sub><h2 align="center">Home Page</h2></sub>
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/login.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/login.png" width="300" alt="Login Page"/>
  </a>
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/register.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/register.png" width="300" alt="Register Page"/>
  </a>
  <br>
   <sub><h2 align="center">Login & Register Pages</h2></sub>

</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/chat%20window.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/chat%20window.png" width="500" alt="Chat Window"/>
  </a>
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/chat%20history.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/chat%20history.png" width="500" alt="Chat History"/>
  </a>
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/ai%20analasis1.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/ai%20analasis1.png" width="500" alt="AI Analysis 1"/>
  </a>
  <br>
   <sub><h2 align="center">Chat & AI Analysis</h2></sub>
 
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/ai%20analasis.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/ai%20analasis.png" width="300" alt="AI Analysis"/>
  </a>
  <a href="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/password%20change.png" target="_blank">
    <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/password%20change.png" width="300" alt="Password Change"/>
  </a>
  <br>
  <sub> <h2 align="center">AI Analysis & Password Change</h2></sub>
</p>

<h2 align="center">🧩 System Architecture</h2>

<p align="center">
  <img src="https://raw.githubusercontent.com/Durgarao-gunja365/ChatVault/main/chatvault%20System%20architecture.png" alt="System Architecture" width="100%"/>
</p>

<h2 align="center">🧩 Data Flow </h2>

<p align="center">
  <img src="https://github.com/Durgarao-gunja365/ChatVault/blob/72430267e0f7d8c55d63ccb216a10394548c8fc7/chatvault%20data%20flow.png" alt="System Architecture" width="100%" height="500"/>
</p>

## 🧩 Features

### 🌐 Core Functionalities

- **Real-Time Chat** – Interactive LLM chat with context memory.
- **Conversation Storage** – Each chat is stored with messages and timestamps.
- **Conversation Summaries** – Automatically generated using AI when the chat ends.
- **Conversation Intelligence** – Ask questions about past chats using semantic understanding.
- **User Authentication** – JWT-based secure login/register using Django REST Auth.
- **User Dashboard** – View all your past conversations with date/time.
- **Guest Mode** – Anyone can chat, but only logged-in users get chat history.
- **Responsive UI** – Modern, mobile-friendly Tailwind design.

### ✨ Advanced Features

- **Semantic Search (Bonus)** – Uses OpenRouter embeddings to find chats by meaning.
- **AI Summarization** – Generates short summaries of completed conversations.
- **Preferences & Profile Pages** – Users can manage profile info and password changes.
- **Dynamic Navbar** – Updates instantly after login/logout without refresh.
- **Loading Indicators** – Shows AI “thinking” animations for better UX.

---

## ⚙️ Tech Stack

| Layer                  | Technology                          |
| ---------------------- | ----------------------------------- |
| **Frontend**           | React (Vite), Tailwind CSS          |
| **Backend**            | Django REST Framework               |
| **Database**           | PostgreSQL                          |
| **AI Integration**     | OpenRouter API                      |
| **Auth**               | JWT (djangorestframework-simplejwt) |
| **Hosting (optional)** | Local or Render                     |

---

## 🛠️ Setup Instructions

### 🧮 1. Backend (Django + DRF)

#### Clone the Repository

```bash
git clone https://github.com/Durgarao-gunja365/ChatVault.git
cd ChatVault/backend

Create Virtual Environment
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)

Install Dependencies
pip install -r requirements.txt

Configure PostgreSQL

Edit your settings.py:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'chatvault_db',
        'USER': 'postgres',
        'PASSWORD': 'yourpassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

Run Migrations
python manage.py makemigrations
python manage.py migrate

Create Superuser (for Admin)
python manage.py createsuperuser

Run Server
python manage.py runserver

💻 2. Frontend (React + Vite)
cd ../frontend
npm install
npm run dev

Update API Base URL

In /src/api/apiClient.js, set your backend base:

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

🔐 3. Environment Variables

Create .env file in backend:

OPENROUTER_API_KEY=your_openrouter_api_key
SECRET_KEY=django_secret_key
DEBUG=True

📡 API Endpoints
Method	Endpoint	Description
GET	/api/conversations/	List all conversations (user-filtered)
POST	/api/conversations/	Create a new conversation
GET	/api/conversations/:id/	Retrieve full conversation with messages
POST	/api/messages/	Send message to LLM & store response
POST	/api/conversations/:id/end/	End conversation and generate AI summary
POST	/api/query/	Ask AI about past conversations
POST	/api/token/	JWT login
POST	/api/register/	Register new user
🧠 AI Integration Flow

When user sends a message → frontend posts to /api/messages/.

Backend sends prompt to OpenRouter → gets response.

Both user and AI messages are stored in PostgreSQL.

When user clicks End Conversation, backend:

Fetches all messages for that conversation.

Sends them to OpenRouter → receives summary.

Saves summary into Conversation.summary.

Later, user queries /api/query/ → backend searches summaries & replies using AI.

🧰 Folder Structure
ChatVault/
│
├── backend/
│   ├── chat/ (DRF app)
│   ├── users/ (auth app)
│   ├── manage.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   ├── package.json
│
└── README.md









```
