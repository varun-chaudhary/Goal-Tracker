
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password, make_password
from .models import User
from django.http import JsonResponse
from django.core.signing import Signer
import json
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def createuser(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            password = data.get("password")

            # Check if any field is empty
            if not name or not email or not password:
                return JsonResponse({"error": "Please fill all the fields!"}, status=400)

            # Email validation
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"error": "Invalid email format!"}, status=400)

            # Password validation
            if len(password) < 8:
                return JsonResponse({"error": "Password must be at least 8 characters long!"}, status=400)

            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists!"}, status=400)

            # Hash the password
            hashed_password = make_password(password)

            # Create the user
            user = User.objects.create(name=name, email=email, password=hashed_password)

            return JsonResponse({"message": "User created successfully!"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method!"}, status=405)


signer = Signer()

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Check if any field is empty
            if not email or not password:
                return JsonResponse({"error": "Please fill all the fields!"}, status=400)
            
            # Email validation
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"error": "Invalid email format!"}, status=400)
            # Check if user exists
            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"error": "User not found!"}, status=404)
            # Check password
            if not check_password(password, user.password):
                return JsonResponse({"error": "Invalid password!"}, status=401)
            # Return success response
            
            response = JsonResponse({"message": "Login successful!", "user" : {"id" : user.id, "name" : user.name, "email" : user.email}}, status=200)
            signed_email = signer.sign(user.email)
            # Set a secure cookie with the user ID
            # Use this in development
            response.set_cookie("user_auth", signed_email, httponly=True, samesite='Lax')
            response.set_cookie("user_id", user.id, httponly=True, samesite='Lax')

            return response

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data!"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method!"}, status=405)



