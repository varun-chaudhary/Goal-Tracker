import json
from django.http import JsonResponse

from .models import User
from .models import Goal, Milestone
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def index(request):
    return HttpResponse("Hello, world. You're at the Goal index.")
@csrf_exempt
def goal(request, id):
    # Assuming you want to display all goals in the database
    user = User.objects.filter(id=id).first()  # Replace with actual user retrieval logic
    goals = Goal.objects.filter(user=user).prefetch_related('milestones')

    data = []
    for goal in goals:
        data.append({
            "id": goal.id,
            "title": goal.title,
            "description": goal.description,
            "category": goal.category,
            "priority": goal.priority,
            "targetDate": goal.target_date,
            "milestones": [
                {
                    "id": milestone.id,
                    "title": milestone.title,
                    "status": milestone.status,
                }
                for milestone in goal.milestones.all()
            ]
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
def create_goal(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            id = data.get("id")
            title = data.get("title")
            description = data.get("description")
            category = data.get("category")
            priority = data.get("priority")
            target_date = data.get("targetDate")

            user = User.objects.filter(id=id).first()
            if not title or not description or not category or not priority or not target_date:
                return JsonResponse({"error": "Please fill all the fields!"}, status=400)
        
            # Create a new Goal object and save it to the database
            goal = Goal(
                user = user,
                title=title,
                description=description,
                category=category,
                priority=priority,
                target_date=target_date
            )
            goal.save()

            return JsonResponse({"message": "Goal Created successfully"}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)
         
@csrf_exempt
def create_milestone(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            goal_id = data.get("goal_id")
            title = data.get("title")
            

            if not goal_id or not title:
                return JsonResponse({"error": "Please fill all the fields!"}, status=400)

            goal = Goal.objects.filter(id=goal_id).first()
            if not goal:
                return JsonResponse({"error": "Goal not found!"}, status=404)

            # Create a new Milestone object and save it to the database
            milestone = Milestone(
                goal=goal,
                title=title,
                status=False  # Default status is False
            )
            milestone.save()

            return JsonResponse({"message": "Milestone Created successfully"}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)
        

@csrf_exempt
def update_goal(request, goal_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            goal = Goal.objects.filter(id=goal_id).first()

            if not goal:
                return JsonResponse({"error": "Goal not found!"}, status=404)

            goal.title = data.get("title", goal.title)
            goal.description = data.get("description", goal.description)
            goal.category = data.get("category", goal.category)
            goal.priority = data.get("priority", goal.priority)
            goal.target_date = data.get("targetDate", goal.target_date)

            goal.save()
            return JsonResponse({"message": "Goal updated successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)


@csrf_exempt
def delete_goal(request, goal_id):
    if request.method == 'DELETE':
        goal = Goal.objects.filter(id=goal_id).first()

        if not goal:
            return JsonResponse({"error": "Goal not found!"}, status=404)

        goal.delete()
        return JsonResponse({"message": "Goal deleted successfully"}, status=200)

@csrf_exempt
def update_milestone(request, milestone_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            milestone = Milestone.objects.filter(id=milestone_id).first()

            if not milestone:
                return JsonResponse({"error": "Milestone not found!"}, status=404)

            # Optional updates, only update fields if provided
            milestone.title = data.get("title", milestone.title)
            milestone.status = data.get("status", milestone.status)

            milestone.save()
            return JsonResponse({"message": "Milestone updated successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)


@csrf_exempt
def delete_milestone(request, milestone_id):
    if request.method == 'DELETE':
        milestone = Milestone.objects.filter(id=milestone_id).first()

        if not milestone:
            return JsonResponse({"error": "Milestone not found!"}, status=404)

        milestone.delete()
        return JsonResponse({"message": "Milestone deleted successfully"}, status=200)
