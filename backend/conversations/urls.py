from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    ConversationListCreateView,
    ConversationDetailView,
    ConversationMessageCreateView,
    ConversationEndView,
    ai_query,
    delete_conversation,
    rename_conversation,
)

urlpatterns = [
    # Core CRUD
    path("conversations/", ConversationListCreateView.as_view(), name="conversation-list"),
    path("conversations/<uuid:id>/", ConversationDetailView.as_view(), name="conversation-detail"),

    # Messaging
    path("conversations/<uuid:id>/messages/", ConversationMessageCreateView.as_view(), name="conversation-message-create"),
    path("conversations/<uuid:id>/end/", ConversationEndView.as_view(), name="conversation-end"),

    # AI tools
    path("ai/query/", ai_query, name="ai-query"),

    # Rename / Delete
    path("conversations/<uuid:pk>/rename/", rename_conversation, name="rename-conversation"),
    path("conversations/<uuid:pk>/delete/", delete_conversation, name="delete-conversation"),
path("api/login/", obtain_auth_token, name="api-login"),
]
