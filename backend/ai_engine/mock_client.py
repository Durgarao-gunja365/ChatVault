import random
import hashlib

class MockAIClient:
    def __init__(self, *args, **kwargs):
        pass

    def get_chat_response(self, messages, user_message, conversation_meta=None):
        # simple echo + canned response
        last_user = user_message
        return f"(mock) I got: '{last_user}'. Try asking me for a summary or query."

    def generate_summary(self, messages, conversation_meta=None):
        # naive: join first 2 and last 2 messages
        texts = [m["content"] for m in messages]
        if not texts:
            return "(mock) No content to summarize."
        sample = texts[:2] + (texts[-2:] if len(texts) > 2 else [])
        joined = " | ".join(sample)
        return f"(mock) Summary: {joined}"

    def get_embedding(self, text):
        # crude deterministic pseudo-embedding for demo: hash -> small floats
        h = hashlib.sha256(text.encode("utf-8")).digest()
        # create 32-dim vector from bytes
        vec = [((b % 100) - 50) / 50.0 for b in h[:32]]  # floats in roughly [-1,1]
        # normalize
        norm = sum(x*x for x in vec) ** 0.5 or 1.0
        vec = [x / norm for x in vec]
        return vec

    def answer_query(self, query, context, conversation_meta=None):
        # provide a simple collated answer using context excerpts
        if not context:
            return "(mock) I don't find any relevant conversation."
        joined = "\n---\n".join(context)
        return f"(mock) Based on excerpts:\n{joined}\n\nAnswer to '{query}': (mock) see excerpts above."
