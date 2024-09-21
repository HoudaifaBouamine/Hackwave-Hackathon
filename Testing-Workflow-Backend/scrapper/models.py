from django.db import models

# Create your models here.

class TestStep1(models.Model):
    # Step 1: Boolean variable for payment service logo
    payment_service_logo_exists = models.BooleanField(default=False)
    
    # Step 2: Boolean variable for CAPTCHA existence
    captcha_exists = models.BooleanField(default=False)
    
    # Step 3: Boolean variable for AgreeOnTerms button existence
    agree_on_terms_exists = models.BooleanField(default=False)
    
    # Step 4: Amount displayed on the start page (stored as Decimal)
    amount_displayed = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Step 1 - Test {self.id} - Passed : {(self.payment_service_logo_exists and self.captcha_exists and self.agree_on_terms_exists)} - Shown Amount at start : {self.amount_displayed}"

    # def isSuccess(self, test):
    #     return self.payment_service_logo_exists and self.captcha_exists and self.agree_on_terms_exists

class TestStep2(models.Model):
    
    card_number = models.CharField(max_length=30)
    card_cvv2 = models.CharField( max_length=3)
    card_expiration_date = models.CharField(max_length=7)
    card_password = models.CharField(max_length=30)
    card_status = models.CharField(max_length=300)
    def __str__(self):
        return f"Step 2 - Test {self.id} - Card number : {self.card_number} - Card Status {self.card_status}"

class TestStep3(models.Model):
    sent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"Step 3 - Test {self.id} - Sent amount : {self.sent_amount}"
    
    # def isAmountMatch(self):
    #     return self.sent_amount >= 100
    
class TestStep4(models.Model):
    shown_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shown_result = models.BooleanField(default=False)
    def __str__(self):
        return f"Step 4 - Test {self.id} - Shown amount at end : {self.shown_amount}"
    
class Test(models.Model):
    # Make the foreign keys optional
    step1 = models.ForeignKey(TestStep1, on_delete=models.CASCADE, null=True, blank=True)
    step2 = models.ForeignKey(TestStep2, on_delete=models.CASCADE, null=True, blank=True)
    step3 = models.ForeignKey(TestStep3, on_delete=models.CASCADE, null=True, blank=True)
    step4 = models.ForeignKey(TestStep4, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Test {self.id}, Shown AMount {self.step1.amount_displayed}"

    # def successFulTest():
    #     return 'Success'