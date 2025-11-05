import requests
import os

class OpenRouterClient:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.chat_model = "mistralai/mistral-7b-instruct"  # You can also use phi-3-mini

    def _post(self, endpoint, payload):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",  # Optional, but recommended by OpenRouter
            "X-Title": "AI Chat Portal"
        }
        url = f"{self.base_url}{endpoint}"
        resp = requests.post(url, json=payload, headers=headers)
        try:
            return resp.json()
        except Exception as e:
            return {"error": str(e), "raw": resp.text}

    def get_chat_response(self, messages, user_message, conversation_meta=None):
        # ✅ Include a system message to guide model behavior
        system_prompt = {
            "role": "system",
            "content": (
                "You are a helpful AI assistant. "
                "Respond clearly and conversationally. "
                "Always reply with useful text — never return empty or whitespace."
            ),
        }

        # ✅ Convert messages into proper chat format
        history = [system_prompt]
        for m in messages:
            role = "assistant" if m["sender"] == "ai" else "user"
            history.append({"role": role, "content": m["content"]})

        history.append({"role": "user", "content": user_message.strip()})

        payload = {"model": self.chat_model, "messages": history}

        data = self._post("/chat/completions", payload)
        print("🔍 OpenRouter raw response:", data)  # DEBUG

        try:
            content = data["choices"][0]["message"]["content"].strip()

            # ✅ Clean unwanted tokens
            cleaned = (
                content.replace("<s>", "")
                .replace("</s>", "")
                .replace("[/INST]", "")
                .replace("[INST]", "")
                .strip()
            )

            if not cleaned:
                return "I'm here and ready! Could you please rephrase or tell me more!"
            return cleaned
        except Exception as e:
            return f"(Error parsing model response: {e}) Raw: {data}"

    def generate_summary(self, messages, conversation_meta=None):
        # Combine the full conversation nicely
        conversation_text = "\n".join(
            [f"{m['sender'].capitalize()}: {m['content']}" for m in messages]
        )

        # Add a clear instruction to the model
        summary_prompt = (
            "You are an AI assistant that summarizes chat conversations.\n"
            "Summarize the key points of this conversation clearly in 3 to 5 sentences.\n"
            "Focus on what was discussed, questions asked, and answers provided.\n\n"
            f"Conversation:\n{conversation_text}\n\n"
            "🧠 Summary:"
        )

        # Ask the model
        response = self.get_chat_response([], summary_prompt)

        # Clean up the output
        cleaned = (
            response.replace("<s>", "")
            .replace("</s>", "")
            .replace("🧠 Summary:", "")
            .strip()
        )

        if not cleaned:
            cleaned = "No meaningful summary could be generated."
        return cleaned

    def get_embedding(self, text):
        # Optional embedding logic (not needed for now)
        return []

    def answer_query(self, query, context, conversation_meta=None):
        joined = "\n".join(context)
        prompt = f"Using the following past messages, answer this query:\n{joined}\n\nQuery: {query}"
        return self.get_chat_response([], prompt)
