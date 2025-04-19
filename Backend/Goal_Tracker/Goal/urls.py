from django.urls import path
from . import views

urlpatterns = [
    path("index/", views.index, name="index"),
    path("goal/<id>/", views.goal, name="goal"),
    path("create_goal/", views.create_goal, name="create_goal"),
    path('update_goal/<int:goal_id>/', views.update_goal, name='update_goal'),
    path('delete_goal/<int:goal_id>/', views.delete_goal, name='delete_goal'),


    path("create_milestone/", views.create_milestone, name="create_milestone"),
    path('update_milestone/<int:milestone_id>/', views.update_milestone, name='update_milestone'),
    path('delete_milestone/<int:milestone_id>/', views.delete_milestone, name='delete_milestone'),

]
