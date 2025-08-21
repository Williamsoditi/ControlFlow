from rest_framework import viewsets
from .models import Message
from .serializers import MessageSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
import os
from rest_framework.views import APIView
from rest_framework.response import Response
import google.generativeai as genai


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

        try:
            # Configure the Gemini client with your API key
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

            # Create the GenerativeModel instance
            model = genai.GenerativeModel('gemini-1.5-flash')

            # Generate content
            response = model.generate_content(prompt)
            generated_content = response.text

            return Response(
                {"generated_content": generated_content},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
   