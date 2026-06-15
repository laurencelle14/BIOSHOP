from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, OTPVerifySerializer, UserSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Compte créé avec succès. Connectez-vous."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            otp_code = user.generate_otp()
            try:
                send_mail(
                    subject="Votre code de vérification — Body's Caprice",
                    message=f"Bonjour {user.first_name or user.email},\n\nVotre code de connexion est : {otp_code}\n\nCe code expire dans 5 minutes.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {"error": f"Erreur d'envoi email : {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(
                {"message": "Code OTP envoyé à votre email."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = CustomUser.objects.get(email=serializer.validated_data['email'])
            except CustomUser.DoesNotExist:
                return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

            if user.verify_otp(serializer.validated_data['otp_code']):
                user.is_otp_verified = True
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data
                })
            return Response({"error": "Code OTP invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # On répond OK même si l'email n'existe pas (sécurité)
            return Response({"message": "Si cet email existe, un code vous a été envoyé."})

        otp_code = user.generate_otp()
        send_mail(
            subject="Réinitialisation de mot de passe — Body's Caprice",
            message=f"""Bonjour {user.first_name or user.email},

Vous avez demandé à réinitialiser votre mot de passe.

Votre code de vérification est : {otp_code}

Ce code expire dans 5 minutes.

Si vous n'avez pas fait cette demande, ignorez cet email.

— L'équipe Body's Caprice by E.M.A""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return Response({"message": "Si cet email existe, un code vous a été envoyé."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')
        new_password = request.data.get('new_password')

        if not all([email, otp_code, new_password]):
            return Response({"error": "Email, code OTP et nouveau mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "Le mot de passe doit contenir au moins 8 caractères"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

        if not user.verify_otp(otp_code):
            return Response({"error": "Code OTP invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.is_otp_verified = False
        user.otp_secret = ''
        user.save()

        return Response({"message": "Mot de passe réinitialisé avec succès. Connectez-vous."})