from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('sendHtml', views.sendHtml, name="sendHtml"),
    path('rapport', views.getStartPageDataAndStatus, name="getRapport"),
    path('test', views.createNewTest, name="createTest"),
    path('test/checkAmount', views.checkAmount, name='get_test_by_id'),
    path('test/testCard', views.testCard, name='testCard'),
    path('test/step4Test', views.step4Test, name='step4Test')
]