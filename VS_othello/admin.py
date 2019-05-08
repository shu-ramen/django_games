from django.contrib import admin

# Register your models here.
from .models import Kifu,Player,Taikyoku

admin.site.register(Kifu)

admin.site.register(Taikyoku)

admin.site.register(Player)