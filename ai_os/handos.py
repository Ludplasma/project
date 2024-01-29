import mediapipe as mp
import cv2
import numpy as np
import uuid
import os
import json
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
import pygame as pg
from random import randint as ran
pg.init()
infos = pg.display.Info()
win=pg.display.set_mode((infos.current_w, infos.current_h))

pg.display.set_caption("handos")

camWidth=infos.current_w
camHeight=infos.current_h
cam = cv2.VideoCapture(0,cv2.CAP_DSHOW)
cam.set(cv2.CAP_PROP_FRAME_WIDTH,camWidth)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT,camHeight)
cam.set(cv2.CAP_PROP_FPS,60)

vars={
    "hand_landmarks":{},
    "mousex":0,
    "mousey":0,
    "mouseActive":False,
    "landmarks":{},
    "handmarks":[
        [0,2,3,4],
        [0,5,6,7,8],
        [0,9,10,11,12],
        [0,13,14,15,16],
        [0,17,18,19,20]
    ],
    "colors":{
        0:(255,255,0),
        2:(0,255,0),
        17:(255,94,5),
        9:(0,0,255),
        13:(255,0,0),
        5:(255,0,255)
    }
    }

def update(vars):
    return vars
def draw(image):
    win.fill((95,197,222))
    img=pg.image.frombuffer(image.tostring(),image.shape[1::-1],"RGB")
    img=pg.transform.scale(img,(camWidth,camHeight))
    win.blit(img,(0,0))
    pg.draw.circle(win, (0,0,255), (vars['mousex'], vars['mousey']), 20, 2) #(r, g, b) is color, (x, y) is center, R 
    for a in vars["handmarks"]:
        try:
            pos=(vars["landmarks"][0][0]['x'], vars["landmarks"][0][0]['y'])
        except:
            pass
        for b in a:
            try:
                pg.draw.line(win,(212,175,55),pos,(vars["landmarks"][0][b]['x'], vars["landmarks"][0][b]['y']),width=4)
                pos=(vars["landmarks"][0][b]['x'], vars["landmarks"][0][b]['y'])
            except:
                pass
    for a in vars["handmarks"]:
        for b in a:
            try:
                try:
                    pg.draw.circle(win, vars["colors"][b], (vars["landmarks"][0][b]['x'], vars["landmarks"][0][b]['y']), 15,0)
                except:
                    pg.draw.circle(win, (212,175,55), (vars["landmarks"][0][b]['x'], vars["landmarks"][0][b]['y']), 7,0)
            except:
                pass
    pg.display.update()

seehands=False
with mp_hands.Hands(min_detection_confidence=0.8, min_tracking_confidence=0.5) as hands: 
    while cam.isOpened():
        for event in pg.event.get():
            if event.type == pg.QUIT:
                break
        mousepos=(pg.mouse.get_pos())
        mousebut=(pg.mouse.get_pressed())
        keys=pg.key.get_pressed()
        if keys[pg.K_ESCAPE]:
            break
        ret, frame = cam.read()
        
        # BGR 2 RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Flip on horizontal
        image = cv2.flip(image, 1)
        
        # Set flag
        image.flags.writeable = False
        
        #Detections
        results = hands.process(image)
        
        if results.multi_hand_landmarks:
            dic={}
            i=0
            for datapoints in results.multi_hand_landmarks:
                dic[i]={}
                for ids,landmrk in enumerate(datapoints.landmark):
                    dic[i][ids]=dict(x=landmrk.x*camWidth,
                                  y=landmrk.y*camHeight)
                i+=1
            vars['mousex']=(dic[0][0]['x']+dic[0][9]['x'])/2
            vars['mousey']=(dic[0][0]['y']+dic[0][9]['y'])/2
            dic[0][0]['x']=vars['mousex']
            dic[0][0]['y']=vars['mousey']
            vars["landmarks"]=dic

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

        vars=update(vars)
        draw(image)

cam.release()
cv2.destroyAllWindows()
pg.quit()
print(vars['x'])