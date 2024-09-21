from django.contrib import admin
from .models import Test, TestStep1, TestStep2, TestStep3, TestStep4

# Register your models here.
admin.site.register(Test)

admin.site.register(TestStep1)
admin.site.register(TestStep2)
admin.site.register(TestStep3)
admin.site.register(TestStep4)
