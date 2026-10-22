from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    credit_balance = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} ({self.email})"


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    plan = models.CharField(max_length=50)
    amount = models.FloatField()
    credits = models.IntegerField()
    payment = models.BooleanField(default=False)
    date = models.BigIntegerField()  # Timestamp in milliseconds (matches Date.now() from Node)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-id']

    def __str__(self):
        return f"Transaction #{self.id} - {self.plan} - User: {self.user.email}"
