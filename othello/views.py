from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.http.response import JsonResponse
from django.template import loader

import json

from othello.backend.othello import OthelloSystem, OthelloAI

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

        new_squares, history = OthelloAI.think(OthelloAI.METHOD_RANDOM, player, squares)

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
            }
        else:
            response = {
                "success": False,
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

        new_squares, history = OthelloAI.think(OthelloAI.METHOD_EVALFUNC, player, squares)

        if (new_squares is not None):
            response = {
                "success": True,
                "squares": new_squares,
                "history": history,
            }
        else:
            response = {
                "success": False,
            }
        return JsonResponse(response)
    else:
        return Http404