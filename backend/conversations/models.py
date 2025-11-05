import uuid
from django.db import models
from django.contrib.auth.models import User  # 👈 Import the default Django User model


from django.db import models
from django.contrib.auth.models import User
import uuid

class Conversation(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("ended", "Ended"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations")
    title = models.CharField(max_length=255, blank=True)
    participants = models.JSONField(default=list, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    summary = models.TextField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.title or 'Conversation'} ({self.id})"



class Message(models.Model):
    ROLE_CHOICES = [
        ("user", "User"),
        ("ai", "AI"),
        ("system", "System"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )
    sender = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("timestamp",)

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"


class Embedding(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, related_name="embeddings", on_delete=models.CASCADE
    )
    message = models.ForeignKey(
        Message, related_name="embeddings", on_delete=models.SET_NULL, null=True, blank=True
    )
    vector = models.JSONField()
    excerpt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding {self.id} for convo {self.conversation_id}"
