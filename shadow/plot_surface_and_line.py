# -*- coding: utf-8 -*-
"""
Created on Mon Oct  1 16:01:04 2018

starting point is Q & A code from https://stackoverflow.com/questions/36060933/matplotlib-plot-a-plane-and-points-in-3d-simultaneously

@author: timot
"""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def line3(point, vector, t):
    #point P = <a,b,c>
    #direction vector V = <d,e,f>
    #the equation of the line is 
    # F(t) = <a + dt, b+ et, c + ft> 
    xs = point[0] + vector[0]*t
    ys = point[1] + vector[1]*t
    zs = point[2] + vector[2]*t
    
    return xs,ys,zs
    

point  = np.array([1, 2, 3])
normal = np.array([1, 1, 2])

point2 = np.array([10, 50, 50])
vector = np.array([0,-1,-1])

# a plane is a*x+b*y+c*z+d=0
# [a,b,c] is the normal. Thus, we have to calculate
# d and we're set
d = -point.dot(normal)

# create x,y
xx, yy = np.meshgrid(range(20), range(20))

# calculate corresponding z
z = (-normal[0] * xx - normal[1] * yy - d) * 1. /normal[2]

# Create the figure
fig = plt.figure()

# Add an axes
ax = fig.add_subplot(111,projection='3d')

# plot the surface
ax.plot_surface(xx, yy, z, alpha=0.2)

# and plot the point 
ax.scatter(point2[0] , point2[1] , point2[2],  color='green')

t = np.arange(0,60,1)
xs,ys,zs =line3(point2, vector, t)

ax.scatter(xs, ys, zs,  color='red')

plt.show()