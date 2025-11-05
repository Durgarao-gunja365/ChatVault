from datetime import timezone

from django.shortcuts import render

# Create your views here.
import os
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Conversation, Message, Embedding
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
    EmbeddingSerializer,
)

# AI engine: pick adapter by env
AI_BACKEND = os.getenv("AI_BACKEND", "mock")  # "mock", "openai", or "lmstudio"

if AI_BACKEND == "openai":
    from ai_engine.openai_client import OpenAIClient as AIClient
elif AI_BACKEND == "openrouter":
    from ai_engine.openrouter_client import OpenRouterClient as AIClient, OpenRouterClient

else:
    from ai_engine.mock_client import MockAIClient as AIClient



ai_client = AIClient()




# backend/conversations/views.py
from rest_framework import generics
from .models import Conversation
from .serializers import ConversationDetailSerializer, ConversationListSerializer

from django.db.models import Max

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny

class ConversationListCreateView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]  # allow guests to chat
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Conversation.objects.filter(user=user).order_by("-start_time")
        # Guests should not see others' chats
        return Conversation.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()  # Anonymous conversation




    def get_queryset(self):
        # Annotate each conversation with its latest message timestamp
        return (
            Conversation.objects.annotate(last_activity=Max("messages__timestamp"))
            .order_by("-last_activity", "-start_time")
        )



class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer


# Conversations list / create
from rest_framework.permissions import IsAuthenticated

class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        # Only return logged-in user's conversations
        return Conversation.objects.filter(user=self.request.user).order_by("-start_time")

    def perform_create(self, serializer):
        # Assign the conversation to the logged-in user
        conv = serializer.save(user=self.request.user)
        if not conv.title:
            conv.title = f"Conversation {str(conv.id)[:8]}"
            conv.save()



class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer
    lookup_field = "id"  # 👈 this fixes the mismatch



# Add message to conversation (user message) -> AI responds
class ConversationMessageCreateView(APIView):
    def post(self, request, id):
        conv = get_object_or_404(Conversation, id=id)
        if conv.status != "active":
            return Response({"detail": "Conversation is ended."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        # expected: {"sender": "user", "content": "..."}
        data["conversation"] = str(conv.id)
        serializer = MessageSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        msg = serializer.save()

        # Call AI for a response (synchronously for now)
        # Provide recent messages to maintain context
        messages = list(conv.messages.order_by("timestamp").values("sender", "content", "timestamp"))
        ai_response_text = ai_client.get_chat_response(messages=messages, user_message=msg.content, conversation_meta={"id": str(conv.id)})

        # save AI message
        ai_msg = Message.objects.create(conversation=conv, sender="ai", content=ai_response_text)
        resp_serializer = MessageSerializer(ai_msg)
        return Response(resp_serializer.data, status=status.HTTP_201_CREATED)


# End conversation -> generate summary and index embeddings
class ConversationEndView(APIView):
    def post(self, request, id):
        conv = get_object_or_404(Conversation, id=id)
        if conv.status == "ended":
            return Response({"detail": "Already ended."}, status=status.HTTP_400_BAD_REQUEST)

        # Mark end time
        from django.utils import timezone
        conv.end_time = timezone.now()
        conv.status = "ended"
        conv.save()

        # Generate summary using AI
        messages = list(conv.messages.order_by("timestamp").values("sender", "content", "timestamp"))
        summary = ai_client.generate_summary(messages=messages, conversation_meta={"id": str(conv.id)})
        conv.summary = summary
        conv.save()

        # Create embeddings for chunks (simple approach here: one embedding per message)
        for m in conv.messages.all():
            vec = ai_client.get_embedding(text=m.content)
            Embedding.objects.create(conversation=conv, message=m, vector=vec, excerpt=m.content[:500])

        return Response({"summary": summary}, status=status.HTTP_200_OK)


# AI Query endpoint - ask about past conversations

@api_view(["POST"])

@api_view(["POST"])
def end_conversation(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk)
        messages = Message.objects.filter(conversation=conv).order_by("timestamp")
        ai_client = OpenRouterClient()
        summary = ai_client.generate_summary(
            [{"sender": m.sender, "content": m.content} for m in messages]
        )
        conv.summary = summary
        conv.save()
        return Response({"summary": summary}, status=status.HTTP_200_OK)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def get_conversation(request, pk):
    try:
        convo = Conversation.objects.get(pk=pk)
    except Conversation.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    messages = Message.objects.filter(conversation=convo).order_by("timestamp")
    data = {
        "id": convo.id,
        "title": convo.title,
        "summary": convo.summary,
        "status": convo.status,
        "messages": [{"sender": m.sender, "content": m.content, "timestamp": m.timestamp} for m in messages],
    }
    return Response(data)
@api_view(["GET"])
def get_all_conversations(request):
    conversations = Conversation.objects.all().order_by("-start_time")
    serializer = ConversationListSerializer(conversations, many=True)
    data = []
    for c in conversations:
        msg_count = Message.objects.filter(conversation=c).count()
        data.append({
            "id": str(c.id),
            "title": c.title or "Untitled Conversation",
            "summary": c.summary or "",
            "status": c.status,
            "message_count": msg_count,
            "created_at": c.start_time.isoformat() if c.start_time else timezone.now().isoformat(),
        })
    return Response(data)



@api_view(["POST"])
def ai_query(request):
    """
    Unified AI Query:
    - If AI_BACKEND=mock → keyword-based mock search
    - If AI_BACKEND=openai → semantic search using embeddings
    """
    from django.conf import settings
    import math

    query_text = request.data.get("query", "").strip()
    if not query_text:
        return Response({
            "answer": "Please enter a query.",
            "excerpts": []
        })

    backend_mode = os.getenv("AI_BACKEND", "mock")

    # 🧩 MOCK MODE (simple keyword match)
    if backend_mode == "mock":
        all_convos = Conversation.objects.all().order_by("-id")
        matches = []

        for convo in all_convos:
            msgs = Message.objects.filter(conversation=convo)
            for msg in msgs:
                if query_text.lower() in msg.content.lower():
                    matches.append({
                        "conversation_id": convo.id,
                        "conversation": convo.title or f"Conversation {convo.id}",
                        "excerpt": msg.content[:150],
                        "sender": msg.sender
                    })

        if not matches:
            return Response({
                "answer": f"(mock) No matches found for '{query_text}'. Try another keyword.",
                "excerpts": []
            })

        return Response({
            "answer": f"(mock) I found {len(matches)} relevant message(s) containing '{query_text}'.",
            "excerpts": matches
        })

    # 🧠 OPENAI / SEMANTIC MODE
    else:
        qvec = ai_client.get_embedding(text=query_text)
        all_embs = Embedding.objects.select_related("conversation", "message").all()

        def cosine(a, b):
            if not a or not b:
                return 0.0
            dot = sum(x * y for x, y in zip(a, b))
            na = math.sqrt(sum(x * x for x in a))
            nb = math.sqrt(sum(y * y for y in b))
            return 0.0 if na == 0 or nb == 0 else dot / (na * nb)

        scored = []
        for e in all_embs:
            try:
                score = cosine(qvec, e.vector)
            except Exception:
                score = 0.0
            scored.append((score, e))

        scored.sort(key=lambda x: x[0], reverse=True)
        top_k = scored[:5]

        if not top_k:
            return Response({
                "answer": f"No relevant excerpts found for '{query_text}'.",
                "excerpts": []
            })

        # Build excerpts from top matches
        excerpts = []
        for score, e in top_k:
            excerpts.append({
                "conversation_id": e.conversation.id,
                "conversation": e.conversation.title or f"Conversation {e.conversation.id}",
                "excerpt": e.excerpt,
                "sender": e.message.sender,
                "score": float(score)
            })

        # Ask AI for final answer
        top_context = [e.excerpt for _, e in top_k]
        final_answer = ai_client.answer_query(query=query_text, context=top_context, conversation_meta={})

        return Response({
            "answer": final_answer,
            "excerpts": excerpts
        })





@api_view(["DELETE"])
def delete_conversation(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk)
        conv.delete()
        return Response({"message": "Conversation deleted."}, status=status.HTTP_204_NO_CONTENT)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PATCH"])
def rename_conversation(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk)
        new_title = request.data.get("title", "").strip()
        if new_title:
            conv.title = new_title
            conv.save()
            return Response({"message": "Title updated."})
        return Response({"error": "No title provided."}, status=status.HTTP_400_BAD_REQUEST)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

