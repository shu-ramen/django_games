from django.db import models

# Create your models here.
class TestData(models.Model):
    test_id = models.CharField(max_length=8)
    test_value = models.IntegerField()