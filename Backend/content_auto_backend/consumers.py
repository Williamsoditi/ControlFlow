import json
from channels.generic.websocket import AsyncWebsocketConsumer
import google.generativeai as genai
import os

class ContentGenerationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        prompt = data.get('prompt')

        if not prompt:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Prompt is required.'
            }))
            return

        try:
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Use the streaming method of the API
            for chunk in model.generate_content(prompt, stream=True):
                await self.send(text_data=json.dumps({
                    'status': 'streaming',
                    'content': chunk.text
                }))

            await self.send(text_data=json.dumps({
                'status': 'complete'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': str(e)
            }))