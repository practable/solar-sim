import numpy as np
import matplotlib.pyplot as plt

#AY BY CY DY EY as a function of [T 1]
Y_ABCDE = np.array([[ 0.1787,-1.4630],
                    [-0.3554, 0.4275],
                    [-0.0227, 5.3251],
                    [ 0.1206,-2.5771],
                    [-0.0670, 0.3703]])

x_ABCDE = np.array([[-0.0193,-0.2592],
                    [-0.0665, 0.0008],
                    [-0.0004, 0.2125],
                    [-0.0641,-0.8989],
                    [-0.0033, 0.0452]])
                    
                    
y_ABCDE = np.array([[-0.0167,-0.2608],
                    [-0.0950, 0.0092],
                    [-0.0079, 0.2102],
                    [-0.0441,-1.6537],
                    [-0.0109, 0.0529]])
                    
x_coeff = np.array([ 
    [ 0.0017, -0.0037,  0.0021, 0.0000],
    [-0.0290,  0.0638, -0.0320, 0.0039],
    [0.1169,  -0.2120,  0.0605, 0.2589]])
    
y_coeff = np.array([
    [ 0.0028, -0.0061,  0.0032, 0.0000],
    [-0.0421,  0.0897, -0.0415, 0.0052],
    [ 0.1535, -0.2676,  0.0667, 0.2669]])
    

def skylight_distribution_coefficients(T):
    #Turbidity T is usually 2 on a clear morning, and 10 on a foggy day
    T1 = np.squeeze(np.array([[T],[1]]))
    
    Y = np.matmul(Y_ABCDE, T1)
    x = np.matmul(x_ABCDE, T1)
    y = np.matmul(y_ABCDE, T1)    
    
    return(Y,x,y)

def zenith_luminence(chi, T):
    # Returns absolute value of zenith luminance in K cd m**-2
    # use chi_from_solar_altitude() to calculate chi
    Yz = ((0.40453*T - 0.49710) * np.tan(chi) -
            0.2155*T + 2.4192)
    return Yz       

def chi_from_solar_altitude(theta_s, T):
    # the chi value needed to calculate zenith luminance from 
    # the solar altitude at zenith, in radians
    chi = ((4.0 / 9.0) - (T / 120.0)) * (np.pi - (2 * theta_s))
    return chi

def zenith_chromaticity(T, theta_s):
    #returns the chromaticity at zenith as a funtion of turbidity & solar altitude
    pre_matrix = np.squeeze(np.array([T**2, T, 1]))
    post_matrix = np.squeeze(np.array([[theta_s**3],[theta_s**2],[theta_s],[1]]))

    # check that this does not mutate pre and post matrix...    
    #checkl the transpose is ok!
    xz = np.matmul(np.matmul(pre_matrix, x_coeff), post_matrix)
    yz = np.matmul(np.matmul(pre_matrix, y_coeff), post_matrix)
     
    return xz, yz

def perez(coeff, theta, gamma):
    # coefficients from skylight_distribution_coefficients()
    A = coeff[0]
    B = coeff[1]
    C = coeff[2]
    D = coeff[3]
    E = coeff[4]
    
    F = ((1 + A * np.exp(B / np.cos(theta)))*
         (1 + C * np.exp(D * gamma) + E * (np.cos(gamma))**2))
    
    return F
    
def luminance(theta, gamma, Yz, T):
    # return luminance at any viewing angle gamma
    # as a function of solar altitude theta
    # and zenith luminance
    coeffs = skylight_distribution_coefficients(T)
    
    Y = Yz * perez(coeffs[0], theta, gamma) / perez(coeffs[0], 0, theta)
    return Y
    
def chromaticity(gamma, theta, theta_s, T):
    # returns the chromaticity based on the 
    # altitude of the viewing point (theta) and sun (theta_s)
    # angle between the sun and the point in sky of interest (gamma)
    # and the turbidity
    
    coeffs = skylight_distribution_coefficients(T)
    x_coeffs = coeffs[1]
    y_coeffs = coeffs[2]
    
    xz, yz = zenith_chromaticity(T, theta_s)
    x = xz * perez(x_coeffs, theta, gamma) / perez(x_coeffs, 0, theta_s)
    y = yz * perez(y_coeffs, theta, gamma) / perez(y_coeffs, 0, theta_s)
    
    return (x, y)
    
def rgb_from_xyz(x, Y, z): 
    #http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
    inv_M = np.array([[  1.4628067, -0.1840623, -0.2743606],
                      [ -0.5217933,  1.4472381,  0.0677227],
                      [  0.0349342, -0.0968930,  1.2884099]])
    
    RGB = np.matmul(inv_M, np.squeeze(np.array([x, Y, z])))
    
    return RGB
    
if __name__ == "__main__":
    
    import colour

    #plot zenith luminanace as a function of solar altitude and turbidity
    #NPL say that a clear day should have luminance of 4 K Cd m**-2
        
    T_list  = np.array([2,5,10])
    theta_s_list = np.linspace(0,np.pi/2.0,45)
    
    Yz = np.ones((np.size(T_list), np.size(theta_s_list)))
    i =0
    for T in T_list:
        j = 0
        for theta_s in theta_s_list:
            
            Yz[i,j] = zenith_luminence(chi_from_solar_altitude(theta_s, T), T)
            j = j + 1
        i = i + 1
       
    plt.figure()
    for i in np.arange(np.size(T_list)):
        plt.plot(theta_s_list, Yz[i], label='T={}'.format(T_list[i]))
    plt.legend()    
    plt.xlabel('Zenith angle above horizon')
    plt.ylabel('Luminence in K cd m**-2')
    
    #plot the chromaticity of the sun as a function of altitude
        
           
    T_list  = np.array([2,5,10])
    theta_s_list = np.linspace(0,np.pi/2.0,45)
    
    xz = np.ones((np.size(T_list), np.size(theta_s_list)))
    yz = np.ones((np.size(T_list), np.size(theta_s_list)))
    
    i =0
    for T in T_list:
        j = 0
        for theta_s in theta_s_list:
            print("{},{}".format(i,j))
            xz[i,j], yz[i,j] = chromaticity(0,theta_s, theta_s, T)
            j = j + 1
        i = i + 1
       
    plt.figure()
    for i in np.arange(np.size(T_list)):
        plt.plot(xz[i], yz[i], label='T={}'.format(T_list[i]))
    plt.legend()    
    plt.xlabel('x-coord (CIE)')
    plt.ylabel('y-coord (CIE)')
    
    plt.figure()
    
    RGB = rgb_from_xyz(xz[0,0], Yz[0,0], yz[0,0])
    
    colour.plotting.single_colour_swatch_plot(colour.plotting.ColourSwatch(RGB))
    