from rest_framework.permissions import BasePermission

class IsOrderOwner(BasePermission):
    message = "Vous n'avez pas accès à cette commande."

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'order'):
            return obj.order.user == request.user
        if hasattr(obj, 'cart'):
            return obj.cart.user == request.user
        return False