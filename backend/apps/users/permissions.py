from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    message = "Vous n'avez pas la permission d'accéder à cet objet."

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False