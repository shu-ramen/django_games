from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.http.response import JsonResponse
from django.template import loader
from othello.backend.othello import BitBoard

from .models import Player, Taikyoku, Kifu

import json

from othello.backend.othello import OthelloSystem
from othello.backend.othelloAI import RandomAI, SimpleEvalAI, DeepEvalAI

# Create your views here.
def index(request):
    template = loader.get_template('othello/index.html')
    context = {}
    return HttpResponse(template.render(context, request))

def putStone(request):
    if request.method == 'POST':
        body = request.body
        data = json.loads(body)
        player = data['player']
        squares = data['squares']
        put_pos = data['put_pos']

        playerBoard, cpuBoard = BitBoard.squaresToBoard(squares)

        #-------------------------------D-----------------
        if Kifu.objects.filter(taikyoku_id=Taikyoku(id=1)).count() % 2 == 1:
             kifu = Kifu(
                        taikyoku=Taikyoku(id=1),
                        player=Taikyoku.objects.get(id=1).player_black_id,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=1)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard
                        )
        else :
            kifu = Kifu(
                        taikyoku=Taikyoku(id=1),
                        player=Taikyoku.objects.get(id=1).player_white_id,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=1)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard
                        )
        kifu.save()
        
        #--------------deka----------------------

        new_squares, history = OthelloSystem.put(player, squares, put_pos)

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
                "isEnd": OthelloSystem.isEnd(new_squares)
            }
        else:
            response = {
                "success": False,
            }
        return JsonResponse(response)
    else:
        return Http404
#---------------------D-------------------------------------------    
    if request.method == 'GET':  
        
        player_id = request.GET.get('player_id')
        taikyoku_id = request.GET.get('taikyoku_id')

        kifu = Kifu.objects.get(taikyoku=taikyoku_id).latest()
        squares = BitBoard.boardToSquares(kifu.board_black, kifu.board_white)
        response = {
            "player": kifu.player,
            "squares": squares,
        }

        return JsonResponse(response)
        # return JsonResponse(response)
    else:
        return Http404        
#-----------------D--------------------------------------------------

def checkBlack(request):
    if request.method == 'GET':  
        
        player_id = request.GET.get('player_id')
        taikyoku_id = request.GET.get('taikyoku_id')

        kifu = Kifu.objects.get(taikyoku=taikyoku_id).latest()

        flag= (Taikyoku.objects.get(id=taikyoku_id).player_black_id == kifu.player)

        response = {
            "flag" : flag
        }

        return JsonResponse(response)
    else:
        return Http404   

def cpu0(request):
    if request.method == 'POST':
        body = request.body
        data = json.loads(body)
        player = data['player']
        squares = data['squares']


        AI = RandomAI(player, squares)
        new_squares, history = AI.think()

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
                "isEnd": OthelloSystem.isEnd(new_squares),
            }
        else:
            response = {
                "success": False,
                "isEnd": OthelloSystem.isEnd(squares),
            }
        return JsonResponse(response)
    else:
        return Http404

def cpu1(request):
    if request.method == 'POST':
        body = request.body
        data = json.loads(body)
        player = data['player']
        squares = data['squares']

        AI = SimpleEvalAI(player, squares)
        new_squares, history = AI.think()

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
                "isEnd": OthelloSystem.isEnd(new_squares),
            }
        else:
            response = {
                "success": False,
            }
        return JsonResponse(response)
    else:
        return Http404
        
def cpu2(request):
    if request.method == 'POST':
        body = request.body
        data = json.loads(body)
        player = data['player']
        squares = data['squares']

        AI = DeepEvalAI(player, squares)
        new_squares, history = AI.think()

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
                "isEnd": OthelloSystem.isEnd(new_squares),
            }
        else:
            response = {
                "success": False,
            }
        return JsonResponse(response)
    else:
        return Http404