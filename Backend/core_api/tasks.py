import os
from celery import shared_task
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables for the Celery worker
load_dotenv()

@shared_task
def generate_content_task(prompt):
    try:
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        generated_content = response.text

        # In a real app, you would save this result to a database
        # or send a notification to the user. For now, we'll just return it.
        return generated_content

    except Exception as e:
        # Celery will retry on a task failure, but we'll return the error for now.
        return {"error": str(e)}