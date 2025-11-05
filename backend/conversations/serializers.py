from rest_framework import serializers
from .models import Conversation, Message, Embedding


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "content", "timestamp", "metadata"]
        read_only_fields = ["id", "timestamp"]


class ConversationListSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "title",
            "start_time",
            "end_time",
            "status",
            "summary",
            "last_message",
            "message_count",
            "created_at",
            "last_activity"
        ]

    def get_last_message(self, obj):
        last = obj.messages.order_by("-timestamp").first()
        if last:
            return {
                "sender": last.sender,
                "content": last.content[:200],
                "timestamp": last.timestamp,
            }
        return None

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_created_at(self, obj):
        """Return start_time as the creation timestamp."""
        return obj.start_time

    def get_last_activity(self, obj):
        last_msg = obj.messages.order_by("-timestamp").first()
        return last_msg.timestamp if last_msg else obj.start_time




class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "title",
            "participants",
            "start_time",
            "end_time",
            "status",
            "summary",
            "metadata",
            "messages",
        ]
        read_only_fields = ["id", "start_time", "end_time", "status", "summary"]


class EmbeddingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Embedding
        fields = ["id", "conversation", "message", "vector", "excerpt", "created_at"]
        read_only_fields = ["id", "created_at"]

