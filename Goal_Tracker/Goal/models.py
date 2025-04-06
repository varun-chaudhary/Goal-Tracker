from django.db import models

from User.models import User

# Create your models here.
class Goal(models.Model):

    CATEGORY_CHOICES = [
        ('Health', 'Health'),
        ('Career', 'Career'),
        ('Finance', 'Finance'),
        ('Personal', 'Personal'),
        ('Education', 'Education'),
        ('Wellness', 'Wellness'),
    ]

    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=200, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=200, choices=PRIORITY_CHOICES)
    target_date = models.DateField()

    def __str__(self):
        return self.title

class Milestone(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title