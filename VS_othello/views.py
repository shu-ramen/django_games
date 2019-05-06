from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.http.response import JsonResponse
from django.template import loader

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

        new_squares, history = OthelloSystem.put(player, squares, put_pos)

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