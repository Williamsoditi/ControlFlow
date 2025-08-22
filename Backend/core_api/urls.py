from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-content/', ContentGenerationView.as_view(), name='generate-content'),
    path('task-status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
]