import os
from openai import OpenAI

class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.chat_model = "gpt-3.5-turbo"
        self.embed_model = "text-embedding-3-small"

    def get_chat_response(self, messages, user_message, conversation_meta):
        """
        Generates a chat completion using the latest OpenAI API (v1.x).
        """
        history = [
            {"role": "system", "content": "You are a helpful AI chat assistant."}
        ]

        # Add past messages
        for m in messages:
            role = "assistant" if m["sender"] == "ai" else "user"
            history.append({"role": role, "content": m["content"]})

        # Add the new user message
        history.append({"role": "user", "content": user_message})

        completion = self.client.chat.completions.create(
            model=self.chat_model,
            messages=history,
            temperature=0.7,
        )

        return completion.choices[0].message.content.strip()

    def generate_summary(self, messages, conversation_meta):
        """
        Summarizes conversation.
        """
        text = "\n".join(f"{m['sender']}: {m['content']}" for m in messages)
        prompt = f"Summarize this conversation briefly:\n{text}"

        completion = self.client.chat.completions.create(
            model=self.chat_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return completion.choices[0].message.content.strip()

    def get_embedding(self, text):
        """
        Create embeddings for semantic search.
        """
        embedding = self.client.embeddings.create(
            model=self.embed_model,
            input=text,
        )
        return embedding.data[0].embedding

    def answer_query(self, query, context, conversation_meta):
        """
        Answer user questions about past conversations.
        """
        context_text = "\n".join(context)
        prompt = f"Context:\n{context_text}\n\nQuestion: {query}"

        completion = self.client.chat.completions.create(
            model=self.chat_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        return completion.choices[0].message.content.strip()
