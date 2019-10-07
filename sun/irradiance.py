# -*- coding: utf-8 -*-
"""
Created on Tue Aug 21 15:01:16 2018

@author: timot
"""
import numpy as np
    
def airmass_curvature(theta):
    a = 0.50572
    b = 96.07995
    c = -1.6364
    return 1/(np.cos(theta) + a * (b - theta)**c)

def irradiance_basic(airmass):
    # kWm**-2
    return 1.353 * ( 0.7 ** (airmass ** 0.678))

    
def irradiance_height(airmass, height_km = 0):
    # kWm**-2
    ah = 0.14 * height_km
    return 1.353 * ( (1 - ah) * 0.7 ** (airmass ** 0.678) + ah)

def global_irradiance(direct_irradiance):
    return 1.1 * direct_irradiance    


if __name__ == "__main__":

    import matplotlib.pyplot as plt        
    
    theta_list = np.linspace(0,np.pi/2,90)
    
    airmass = []
    irradiance = []
    
    for theta in theta_list:
        am = airmass_curvature(theta)
        ir = global_irradiance(irradiance_height(am, 0))
        irradiance.append(ir)
        airmass.append(am)
        
    plt.figure()
    plt.plot(theta_list, irradiance)    
    
    plt.figure()
    plt.plot(theta_list, airmass)