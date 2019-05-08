from django.db import models

class Player(models.Model):
    player_name = models.CharField(max_length = 200)

class Taikyoku(models.Model):
    player_black_id = models.ForeignKey('Player', related_name='player_black', on_delete=models.CASCADE)
    player_white_id = models.ForeignKey('Player', related_name='player_white',on_delete=models.CASCADE)

class Kifu(models.Model):
    taikyoku =models.ForeignKey('Taikyoku', on_delete=models.CASCADE)
    player = models.ForeignKey('Player', on_delete=models.CASCADE)
    count = models.IntegerField(default = 0)
    position = models.IntegerField()
    board_black = models.BigIntegerField(default = 0x0000001008000000)
    board_white = models.BigIntegerField(default = 0x0000000810000000)
#誰がどこに何手目で打ったか

