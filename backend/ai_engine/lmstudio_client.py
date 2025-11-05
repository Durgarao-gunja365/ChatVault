import requests
import json


class LMStudioClient:
    def __init__(self):
        # Local LM Studio API endpoint
        self.base_url = "http://localhost:1234/v1"
        self.chat_model = "qwen/qwen3-8b"
        self.embed_model = "text-embedding-nomic-embed-text-v1.5"

    def get_chat_response(self, messages, user_message, conversation_meta=None):
        """
        Send messages to LM Studio's chat endpoint and return AI reply text.
        """
        history = [{"role": m["sender"], "content": m["content"]} for m in messages]
        history.append({"role": "user", "content": user_message})

        payload = {
            "model": self.chat_model,
            "messages": history,
            "temperature": 0.7,
        }

        try:
            resp = requests.post(f"{self.base_url}/chat/completions", json=payload)
            data = resp.json()
            # Handle different response formats gracefully
            if "choices" in data and data["choices"]:
                return data["choices"][0]["message"]["content"].strip()
            elif "message" in data:
                return data["message"].get("content", "").strip()
            elif "text" in data:
                return data["text"].strip()
            else:
                return "(Error: unexpected response format)"
        except Exception as e:
            return f"(Error contacting LM Studio: {e})"

    def generate_summary(self, messages, conversation_meta=None):
        """
        Generate a short summary of a conversation.
        """
        text = "\n".join([f"{m['sender']}: {m['content']}" for m in messages])
        prompt = f"Summarize this conversation in 3 sentences:\n\n{text}"

        return self.get_chat_response([], prompt)

    def get_embedding(self, text):
        """
        Get embedding vector for given text from LM Studio.
        """
        try:
            payload = {"model": self.embed_model, "input": text}
            resp = requests.post(f"{self.base_url}/embeddings", json=payload)
            data = resp.json()
            if "data" in data and len(data["data"]) > 0:
                return data["data"][0]["embedding"]
            return []
        except Exception as e:
            print("Embedding error:", e)
            return []

    def answer_query(self, query, context, conversation_meta=None):
        """
        Answer a question based on past conversation excerpts.
        """
        joined_context = "\n".join(context)
        prompt = f"Using the following past conversation excerpts, answer this query:\n\n{joined_context}\n\nQuestion: {query}"

        return self.get_chat_response([], prompt)
