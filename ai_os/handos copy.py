import mediapipe as mp
import cv2
import numpy as np
import uuid
import os
import json
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
import pygame as pg
from random import randint as ran
pg.init()
infos = pg.display.Info()

camWidth=infos.current_w
camHeight=infos.current_h
cam = cv2.VideoCapture(0,cv2.CAP_DSHOW)
cam.set(cv2.CAP_PROP_FRAME_WIDTH,camWidth)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT,camHeight)
cam.set(cv2.CAP_PROP_FPS,60)

#3443
#se18pb
#43
#1963
#more
#
#6.B
#7.C
#8.C
#9.B
#10.C
#
#11.C
#12.B
#13.B
#14.B
#15.C
with mp_pose.Pose(min_detection_confidence=0.8, min_tracking_confidence=0.5) as pose: 
    while cam.isOpened():
        ret, frame = cam.read()
        
        # BGR 2 RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Flip on horizontal
        image = cv2.flip(image, 1)
        
        # Set flag
        image.flags.writeable = False
        
        #Detections
        results = pose.process(image)

        image.flags.writeable = True

        image=cv2.cvtColor(image,cv2.COLOR_RGB2BGR)
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, 
                                            mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
                                            mp_drawing.DrawingSpec(color=(250, 44, 250), thickness=2, circle_radius=2),
                                             )
        

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

        cv2.imshow("pose detection",image)

cam.release()
cv2.destroyAllWindows()
pg.quit()