from django.contrib import admin

# Register your models here.
from .models import Goal, Milestone

admin.site.register(Goal)
admin.site.register(Milestone)

