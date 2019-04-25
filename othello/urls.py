from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='othello-index'),
    path('put_stone', views.putStone, name='othello-putStone'),
]