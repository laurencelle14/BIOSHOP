import resend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, OTPVerifySerializer, UserSerializer

def send_email(to, subject, body):
    resend.api_key = settings.RESEND_API_KEY
    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [to],
            "subject": subject,
            "text": body,
        })
    except Exception as e:
        print(f"Erreur Resend: {e}")


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
            send_email(
                to=user.email,
                subject="Votre code de vérification — Body's Caprice",
                body=f"Bonjour {user.first_name or user.email},\n\nVotre code de connexion est : {otp_code}\n\nCe code expire dans 5 minutes."
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
            return Response({"message": "Si cet email existe, un code vous a été envoyé."})

        otp_code = user.generate_otp()
        send_email(
            to=user.email,
            subject="Réinitialisation de mot de passe — Body's Caprice",
            body=f"Bonjour {user.first_name or user.email},\n\nVotre code de vérification est : {otp_code}\n\nCe code expire dans 5 minutes."
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