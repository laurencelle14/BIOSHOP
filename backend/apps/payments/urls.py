from django.urls import path
from .views import InitiatePaymentView, CinetPayNotifyView

urlpatterns = [
    path('initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('notify/', CinetPayNotifyView.as_view(), name='cinetpay-notify'),
]