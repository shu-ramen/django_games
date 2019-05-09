from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.http.response import JsonResponse
from django.template import loader
from VS_othello.backend.othello import BitBoard

from .models import Player, Taikyoku, Kifu

import json

from VS_othello.backend.othello import OthelloSystem
from othello.backend.othelloAI import RandomAI, SimpleEvalAI, DeepEvalAI

# Create your views here.
def index(request):
    template = loader.get_template('VS_othello/index.html')
    context = {}
    return HttpResponse(template.render(context, request))

def vs_page(request,player_id,taikyoku_id):
    template = loader.get_template('VS_othello/index.html')
    context = {"player":player_id,"taikyoku":taikyoku_id}
    return HttpResponse(template.render(context, request))

def get_board(request,play,taikyoku):
    if request.method == 'POST':
        body = request.body
        data = json.loads(body)
        player = data['player']
        squares = data['squares']
        put_pos = data['put_pos']
        new_squares, history = OthelloSystem.put(player, squares, put_pos)
        
        #-------------------------------D-----------------
        """
        if Kifu.objects.filter(taikyoku_id=taikyoku).count() % 2 == 1:
             kifu = Kifu(
                        taikyoku_id=Taikyoku.objects.get(id=taikyoku).id,
                        player_id=Taikyoku.objects.get(id=1).player_black_id.id,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=1)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard
                        )
        
        else :
            kifu = Kifu(
                        taikyoku_id=Taikyoku.objects.get(id=taikyoku),
                        player_id=Taikyoku.objects.get(id=1).player_white,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=1)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard
                        )
        """
        
        #--------------deka----------------------


        if (new_squares is not None):
            playerBoard, cpuBoard = BitBoard.squaresToBoard(new_squares)
            kifu = Kifu(
                        taikyoku_id=Taikyoku.objects.get(id=taikyoku).id,
                        player_id=play,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=taikyoku)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard
                        )
            kifu.save()
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
#---------------------D-------------------------------------------   
#  
    
    elif request.method == 'GET':  
        #player_id = request.GET.get('player_id')
        #taikyoku_id = request.GET.get('taikyoku_id')
        if Kifu.objects.filter(taikyoku_id=taikyoku).all().count()!=0:
            print("call board")
            kifu = Kifu.objects.filter(taikyoku_id=taikyoku).order_by('-id')[0]
            latest_player=kifu.player_id
            squares = BitBoard.boardToSquares(kifu.board_black, kifu.board_white)
        else:
            print("init board")
            latest_player=Taikyoku.objects.get(id=taikyoku).player_white_id.id
            kifu = Kifu(
                        taikyoku_id=Taikyoku.objects.get(id=taikyoku).id,
                        player_id=latest_player,
                        count=0,
                        position=-1,
                        board_black=0x0000001008000000,
                        board_white=0x0000000810000000,
                        )
            squares=BitBoard.boardToSquares(kifu.board_black, kifu.board_white)
            kifu.save()
        if not(play==latest_player):
            res_player=0
        else:
            res_player=1
        if play==Taikyoku.objects.get(id=taikyoku).player_white_id.id:
            color=1
        else:
            color=0
        response = {
            "success":True,
            "player": res_player,
            "squares": squares,
            "color" : color,
        }

        return JsonResponse(response)
        # return JsonResponse(response)
    else:
        return Http404     
    
#-----------------D--------------------------------------------------
"""
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
"""
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


def vs_bot(request,play,taikyoku_num):
    print("play:{}".format(play))
    if request.method == 'POST':
        #body = request.body
        #data = json.loads(body)
        #player = data['player']
        #squares = data['squares']
        latest_kifu = Kifu.objects.filter(taikyoku_id=taikyoku_num).order_by('-id')[0]
        taikyoku=Taikyoku.objects.get(id=taikyoku_num)
        white_player = taikyoku.player_white_id.id
        
        if not(play==white_player):
            player=1
            cpu_id=white_player
        else:
            player=0
            cpu_id=taikyoku.player_black_id.id

        squares = BitBoard.boardToSquares(latest_kifu.board_black, latest_kifu.board_white)

        AI = DeepEvalAI(player, squares)
        new_squares, history = AI.think()
        playerBoard, cpuBoard = BitBoard.squaresToBoard(new_squares)
        #AI.think()の挙動がわからんのでひとまずput_pos=-1
        put_pos=-1
        print("AI thought")
        print("board:{},,,,,{}".format(playerBoard,cpuBoard))

        if (new_squares is not None):
            kifu = Kifu(
                        #taikyoku=Taikyoku.objects.get(id=taikyoku_id).id,
                        taikyoku_id=taikyoku_num,
                        player_id=cpu_id,
                        count=Kifu.objects.filter(taikyoku_id=Taikyoku(id=taikyoku_num)).count()+1,
                        position=put_pos,
                        board_black=playerBoard,
                        board_white=cpuBoard,
                        )
            print("save")
            kifu.save()
            print("end save")
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