from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductListView, ProductDetailView,
    CategoryListView, CategoryDetailView,
    AdminProductViewSet, AdminCategoryViewSet
)

router = DefaultRouter()
router.register(r'admin/products', AdminProductViewSet, basename='admin-product')
router.register(r'admin/categories', AdminCategoryViewSet, basename='admin-category')

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
] + router.urls