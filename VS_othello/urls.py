from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='othello-index'),
    path('put_stone', views.putStone, name='othello-putStone'),
    path('cpu0', views.cpu0, name='othello-cpu0'),
    path('cpu1', views.cpu1, name='othello-cpu1'),
    path('cpu2', views.cpu2, name='othello-cpu2'),
]