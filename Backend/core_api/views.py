from rest_framework import viewsets
from .models import Message
from .serializers import MessageSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
import os
from rest_framework.views import APIView
from rest_framework.response import Response
import google.generativeai as genai
from .tasks import generate_content_task
from celery.result import AsyncResult

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class ContentGenerationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        prompt = request.data.get("prompt", None)
        if not prompt:
            return Response(
                {"error": "Prompt is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call the Celery task asynchronously
        # We'll use apply_async for more control in a later step
        task = generate_content_task.delay(prompt)

        return Response(
            {"task_id": task.id, "message": "Content generation task has been queued."},
            status=status.HTTP_202_ACCEPTED
        )

class TaskStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, task_id, *args, **kwargs):
        task = AsyncResult(task_id)

        response_data = {
            "task_id": task.id,
            "status": task.status,
            "result": task.result if task.ready() else None
        }

        return Response(response_data, status=status.HTTP_200_OK)
   