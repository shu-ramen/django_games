import numpy as np

def put(player, map, put_pos):
    if (map[put_pos] != -1):
        return False
    map[put_pos] = player
    return map