if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var showStats = false;
var sensorTopLeft = 0; //initialise for Blockly
var sensorTopRight = 0;
var sensorBottomLeft = 0;
var sensorBottomRight = 0;
var max_sensor_voltage = 1.0;
var sensorSize = 1.0;
var sensorWallHeight = 0.30; //if too low, then it can have a wiggly time
var panelAzi = 0;
var panelAlt = -0.8;
var container, stats, controls;
var camera, scene, renderer, light;
var panel, bracket, bulb, sensor, sensorOrigin, shadowOrigin, cyanCorner, blueCorner, redCorner, greenCorner;
var raycaster, shadowLine;
var irradiance, sensor_irradiance; //surface irradiance in kWm^-2
var panel_power; // panel output power in W			
var frames = 0;
var sun; //holds the sun's alt and azi
var runClock = true;

var renderInitialHeight = 400; 
var renderInitialWidth = 400;

var p = new THREE.Vector3(0, 0, 0);
var ax = new THREE.Vector3(0, 1, 0);
var r = 0.5
var debug = false

var debugShadow = false;
var showShadowHelper = false; //draw shadow line from top of blind to the shadow point on sensor
var doRender = true; //set to false if inactivity timeout
var vectorHelpersOn = false

var sunVectorHelper, panelVectorHelper
var panel_rotation_y =0
var	panel_rotation_z =0
var moving_panel = true
var daytime
var shadow_dx;
var shadow_dy;
var max_panel_power = 1; //Watts
var actual_panel_power = 0;
var maxAziRate = 0.1;
var maxAltRate = 0.1;
var maxDayRate = 0.003;
var theoretical_max_panel_power = 0;

var simstart = new Date(Date.UTC(2019,7-1,1+1,0,0)); //force all dates to be UTC, note opposite offsets (?!) in month,day (1 July)
var simtime = new Date(simstart.getTime()); //getTime always in UTC. Note if changing location away from UK 
var lat = 55.9231   //Observatory in Edinburgh
var lon = -3.1879
var northern_hemisphere = true; //to do - calc from coords

var rotation_matrix = new THREE.Matrix4().makeRotationX(.01)

var effectController  = {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: 0.49, // elevation / inclination
		azimuth: 0.25, // Facing front,
		sun: ! true,
		distance: 400000,
		day: 0,
		x: 0,
		y: 1,
		z: 0
	};
	
function guiChanged() {
		
		var distance = effectController.distance
		
		var uniforms = sky.material.uniforms;
		uniforms.turbidity.value = effectController.turbidity;
		uniforms.rayleigh.value = effectController.rayleigh;
		uniforms.luminance.value = effectController.luminance;
		uniforms.mieCoefficient.value = effectController.mieCoefficient;
		uniforms.mieDirectionalG.value = effectController.mieDirectionalG;


		
		var phi =  effectController.sun.azimuth 
		var theta = effectController.sun.altitude / Math.sin(phi);
		
		if (debug) console.log(effectController.sun.altitude,phi,theta)

		

		sunSphere.position.x = effectController.x 
		sunSphere.position.y = effectController.y 
		sunSphere.position.z = effectController.z 

		
		sunSphere.visible = effectController.sun;
		
		uniforms.sunPosition.value.copy( sunSphere.position );

		renderer.render( scene, camera );

	}


$( document ).ready(function() {
	init();
	animate();
});

function initSky() {

	// Add Sky
	sky = new THREE.Sky();

	sky.scale.setScalar( 450000 );
	scene.add( sky );

	// Add Sun Helper
	sunSphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry( 20000, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	sunSphere.position.y = - 700000;
	sunSphere.visible = false;
	scene.add( sunSphere );
	
}

function init() {

	container = document.createElement( 'div' );
	
	$("#renderHere").append( container );
	camera = new THREE.PerspectiveCamera( 45, renderInitialWidth / renderInitialHeight, 0.25, 50 );
	camera.position.set( -1.5, 0.5, 1.1 );

	controls = new THREE.OrbitControls( camera, document.getElementById("renderHere") );
	controls.target.set( 0, -0.2, -0.2 );
	controls.update();

	// envmap so that the metal looks good
	var path = 'textures/cube/skybox/';
	var format = '.jpg';
	var envMap = new THREE.CubeTextureLoader().load( [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	] );

	scene = new THREE.Scene();

	// the sunlight falling on the scene
	light = new THREE.DirectionalLight( 0xbbbbff, 1.0, 100 );
	light.position.set( 0, 1, 0 );
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;  
	light.shadow.mapSize.height = 2048; 
	light.shadow.camera.near = -2;   
	light.shadow.camera.far = 50;     
	scene.add( light );
	
	// night light on the solar panel
	bulb = new THREE.PointLight( 0x0000ff, 1.0 );
	bulb.position.set( -0.02, 0.13, -0.037);
	bulb.angle = Math.PI/8.
	bulb.castShadow = true;
	bulb.shadow.mapSize.width = 1024;
	bulb.shadow.mapSize.height = 1024;
	bulb.shadow.camera.near = 0.1;
	bulb.shadow.camera.far = 10;
	bulb.shadow.camera.fov = 30;
	bulb.decay = 2;
	scene.add( bulb );
	
	if (debug) {//Create a helper for the shadow camera (optional)
		var helper = new THREE.CameraHelper( light.shadow.camera );
		scene.add( helper );
		var axesHelper = new THREE.AxesHelper( 5 );
		scene.add( axesHelper );
	}	

	
	
	var dir = new THREE.Vector3( 0, 1, 0 );

	//normalize the direction vector (convert to vector of length 1)
	dir.normalize();

	var origin = new THREE.Vector3( 0, 0.3, 0 );
	var length = 0.2;
	var hex = 0xff0000;

	sunVectorHelper = new THREE.ArrowHelper( dir, origin, length, hex );
	
	var hex = 0x0000ff;
	panelVectorHelper = new THREE.ArrowHelper( dir, origin, length, hex );

	var hex = 0x00ff00;
	shadowVectorHelper = new THREE.ArrowHelper( dir, origin, length, hex );

	
	if (vectorHelpersOn){	
		scene.add(sunVectorHelper.dir);
		scene.add(sunVectorHelper );		
		scene.add(panelVectorHelper );
		scene.add(shadowVectorHelper );

	}
	
	// add solar panel model
	var loader = new THREE.GLTFLoader();
	loader.load( 'models/panel.glb', function ( gltf ) {

		gltf.scene.traverse( function ( child ) {

			if ( child.isMesh ) {
				 //this makes the metal look shiny at daytime
				child.material.envMap = envMap;
				child.receiveShadow = true
				child.castShadow = true
				if (debug) console.log(child);
				//pop some meshes into variables for accessing later
				if (child.name=="panel"){
				  panel = child; //we'll rotate the panel later
				}
				if (child.name=="sensorOrigin"){
				  sensorOrigin = child; 
				}				
				if (child.name=="shadowOrigin"){
				  shadowOrigin = child; 
				}
				if (child.name=="blueCorner"){
				  blueCorner = child; 
				}
				if (child.name=="redCorner"){
				  redCorner = child; 
				}
				if (child.name=="cyanCorner"){
				  cyanCorner = child; 
				}
				if (child.name=="greenCorner"){
				  greenCorner = child; 
				}
				if (child.name=="sensor"){
				  sensor = child; 
				}				
			}

		} );

		scene.add( gltf.scene );

	}); //loader
 	
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( renderInitialWidth, renderInitialHeight);
	renderer.gammaOutput = true;
	container.appendChild( renderer.domElement );

	initSky();
	
	// set up a raycaster for finding shadow position on sensor
	raycaster = new THREE.Raycaster();
	
	if (showShadowHelper){
		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( -1, 0, 0 ),
			new THREE.Vector3( 0, 1, 0 ),
			new THREE.Vector3( 1, 0, 0 )
		);

		shadowLineHelper = new THREE.Line( geometry, material );
		scene.add( shadowLineHelper );
	}

	// stats
	if(showStats){
		stats = new Stats();
		container.appendChild( stats.dom );
	}
}


//  Solar equations accessed 21 August 2018 from https://www.pveducation.org/ko/pvcdrom/2-properties-sunlight/air-mass
	/* References are:
	1.F. Kasten 와/과 Young, A. T., “Revised optical air mass tables and approximation formula”, Applied Optics, vol 28, pp   4735–4738, 1989.
	2.A. B. Meinel 와/과 Meinel, M. P., Applied Solar Energy. Addison Wesley Publishing Co., 1976.
	3.E. G. Laue, “The measurement of solar spectral irradiance at different terrestrial elevations”, Solar Energy, vol 13, pp 43 - 50, IN1-IN4, 51-57, 1970.
	*/

function airmass_curvature(sun_altitude){
	// but airmass model theta is radians from vertical
	// so convert:
	theta = Math.PI/2.0 - sun_altitude
	var a = 0.50572
	var b = 96.07995
	var c = -1.6364
	return 1.0/(Math.cos(theta) + a * Math.pow((b - theta),c))
}

function noNaN( n ) { return isNaN( n ) ? 0 : n; } //also used by blockly.js

function surface_irradiance(sun_altitude, height_km = 0){
	// in kWm**-2
	airmass = airmass_curvature(sun_altitude)
	ah = 0.14 * height_km
	direct_irradiance = 1.353 * ( (1 - ah) * Math.pow(0.7, Math.pow(airmass, 0.678)) + ah)
	global_irradiance = direct_irradiance * 1.1 //approx 10% indirect light
					
	return noNaN(global_irradiance)

}

function light_intensity_from_irradiance(irradiance){
	return 1.0 * irradiance
}

function get_sensor_irradiance(irradiance, panel_power, sun, panel){
	if (daytime) return irradiance
	else return 0;
}

function calc_theoretical_max_panel_power(irradiance){
	return max_panel_power * irradiance // Assuming a 2W solar panel, ignoring load, temperature, shading etc
}

function calc_actual_panel_power(irradiance, sun, panel){
	// dot product of sun angle and panel angle
	//assume no x-rotation in this panel
	py = Math.cos(panel.rotation.z);
	pr = Math.sin(panel.rotation.z);
	px = pr * Math.cos(panel.rotation.y);
	pz = pr * Math.sin(panel.rotation.y);
	
	var pv = get_panel_vector(panel)
	var sv = get_sun_vector(sun)

	return Math.max(pv.dot(sv) * irradiance, 0)
}

function get_sun_vector(light){
	var sv = light.position.clone()
	return sv.normalize()
}

function get_reverse_sun_vector(light){
	var sv = get_sun_vector(light)
    return new THREE.Vector3(- sv.x, -sv.y, -sv.z)	
	
}

function get_shadow_vector(light, panel){

	/* we obtain the rotation matrix needed to rotate the panel from it's current position
	to the flat, starting position, aligned with the world coordinate system, by normalising
	the panel vector, and making a quaternion from that and the unit vector of the positive y axis
	which was the starting point of the panel.
	Then we apply that quaternion to make a rotation matrix
	then apply that rotation matrix to the sun vector, thus translating the sun vector into 
	coordinates that are relative to the panel vector, with positive Y being straight up
	We can then extract these coordinates and use them to calculate the shadow on the panel,
	now that we know the relative position of the sun
	*/
	
	var axisVector = new THREE.Vector3(0,1,0).normalize(); 
	var sunVector = get_sun_vector(light).normalize();
	var panelVector = get_panel_vector(panel).normalize();
	var q = new THREE.Quaternion();
	var m = new THREE.Matrix4();
	
	q.setFromUnitVectors(panelVector, axisVector);
	m.makeRotationFromQuaternion(q);
	sunVector.applyMatrix4(m)
	
					
	return sunVector  // now the relative sun vector, so we can use it to get shadow

}

function get_shadow_coord(light, panel, height, size){
	
	var direction = get_shadow_vector(light, panel)
	var shadow = new THREE.Vector3(direction.x, 0, direction.z).multiplyScalar(height / direction.y);
	var sx = direction.x * height / direction.y; 
	var sz = direction.z * height / direction.y;
	var r = Math.pow(Math.pow(sx,2) + Math.pow(sz,2), 0.5)
	var angle = Math.atan(sz/sx) - panelAzi;
	
	sx = r * Math.cos(angle);
    sz = -r * Math.sin(angle);

	return {x: sx, y:sz, theta:angle}
}

function get_panel_vector(panel){
	
	var matrix = new THREE.Matrix4();
	var direction = new THREE.Vector3( 0, -1, 0 );
	matrix.extractRotation( panel.matrix );
	direction.applyMatrix4(matrix);
	
	return direction.normalize()
}

function sensor_value(relative_area){
	return relative_area * actual_panel_power ; 
}


function update_sensors(shadow_dx, shadow_dy){
	/* X is positive to the right, and y is positive to the bottom 
	We want to figure out the area of light that is shone onto each sensor
	which is defined as being square from 0,0 to 1,1.
	So lit area is for top, right: (1 - shadow_dx)*(1-shadow_dy),
	assuming shadow_dx, shadow_dy are in the range {0,1}, where
	0 is sensor origin, and 1 is sensor edge
	*/
	
	//bottom_right
	var pmin = 0.00; //TODO make this a UI controllable parameter
	var pmax = 1.0;
	var sensorArea = Math.pow((pmax - pmin),2);
	var sx = Math.min(Math.max(pmin, shadow_dx),pmax);
	var sy = Math.min(Math.max(pmin, shadow_dy),pmax);
	var lit_area = (pmax - sx) * (pmax-sy) / sensorArea;
	sensorBottomRight = sensor_value(lit_area);
	
	//top_right
	var sx = Math.min(Math.max(pmin, shadow_dx),pmax);
	var sy = Math.min(Math.max(pmin, -1 * shadow_dy),pmax);
	var lit_area = (pmax - sx) * (pmax - sy) / sensorArea;
	sensorTopRight = sensor_value(lit_area);

	//bottom_left
	var sx = Math.min(Math.max(pmin, -1 * shadow_dx),pmax);
	var sy = Math.min(Math.max(pmin, shadow_dy),pmax);
	var lit_area = (pmax - sx) * (pmax-sy) / sensorArea;
	sensorBottomLeft = sensor_value(lit_area);
	
	//bottom_right
	var sx = Math.min(Math.max(pmin, -1 * shadow_dx),pmax);
	var sy = Math.min(Math.max(pmin, -1 * shadow_dy),pmax);
	var lit_area = (pmax - sx) * (pmax - sy) / sensorArea;
	sensorTopLeft = sensor_value(lit_area);	
	
}


function animate() {
	
	requestAnimationFrame( animate );
	
	if(doRender){
		drawClock()
		
		
		renderer.render( scene, camera );
		if (showStats) stats.update();
		
		if (typeof(code) !== 'undefined' && runClock) eval(code);
                logBlockly(); //only sends if code has changed

                panelAzi = panelAzi % (Math.PI * 2.0);
                panelAlt = panelAlt % (Math.PI * 2.0);
		
		frames = frames + 1
		
		if (panel !== undefined){
			if(panel.rotation !== undefined){
				panel.rotation.y = panelAzi;
				panel.rotation.z = Math.PI - panelAlt;
			}
		
		/*shadow_offset = get_shadow_coord(light, panel, sensorWallHeight, sensorSize);
		shadow_dx = shadow_offset.x
		shadow_dy = shadow_offset.y
		*/
		update_sensors(shadow_dx/sensorSize, shadow_dy/sensorSize);
		
		simtime = new Date(simstart.getTime() + effectController.day * 24*3600*1000)
		sun  = SunCalc.getPosition(simtime, lat, lon)
						
		var ly = Math.sin(sun.altitude)
		var lr = Math.cos(sun.altitude)
		var lx = lr * Math.sin(sun.azimuth)
		var lz = lr * Math.cos(sun.azimuth)
		
		
		sunVectorHelper.setDirection(get_sun_vector(light))
		shadowVectorHelper.setDirection(get_shadow_vector(light, panel))
		panelVectorHelper.setDirection(get_panel_vector(panel).normalize())
		
		
		light.position.set(lx,ly,lz)
		
		irradiance = surface_irradiance(sun.altitude)
		
		theoretical_max_panel_power = calc_theoretical_max_panel_power(irradiance)
		
		actual_panel_power = calc_actual_panel_power(irradiance, light, panel)
		
		updateScore(actual_panel_power, theoretical_max_panel_power);
			
		
		
		light.intensity = light_intensity_from_irradiance(irradiance)
		sensor_irradiance = get_sensor_irradiance(irradiance, actual_panel_power, light, panel); //need this for sensor graphics
					
		daytime = sun.altitude > -Math.PI/32.0
		bulb.intensity = daytime? 0.0 : 1.0
		
                /*
                  if (debugShadow) {
			effectController.day = 0.4; //effectController.day + 0.0003
			if (effectController.day >= 0.8) effectController.day = 0.3;	
			if (effectController.day < 0.3 ) effectController.day = 0.3;
			
		}
		else
		{
			
			if (runClock) effectController.day = effectController.day + 0.001
                */  
			if (effectController.day >= 1.0) {
				effectController.day = 0.0;
				resetScore();
			}
				
		//}
		
		var uniforms = sky.material.uniforms;
		uniforms.turbidity.value = effectController.turbidity;
		uniforms.rayleigh.value = effectController.rayleigh;
		uniforms.luminance.value = effectController.luminance;
		uniforms.mieCoefficient.value = effectController.mieCoefficient;
		uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
		
		sunSphere.visible = effectController.sun;
		distance = effectController.distance
		sunSphere.position.x = distance * lx; 
		sunSphere.position.y = distance * ly; 
		sunSphere.position.z = distance * lz;
		uniforms.sunPosition.value.copy( sunSphere.position );
		
		

		
		/* Now do our own shadow calculation 
		so that we can handle long shadows without needing 
		a large ghost sensor to catch a raycast intersection */
		
		var lineOriginPoint = new THREE.Vector3(0,0,0); //origin of shadow
		var planeOriginPoint = new THREE.Vector3(0,0,0); // centre of the plane holding the four sensors 
		var planeNormal = new THREE.Vector3(0,0,0);
		var shadowLine = new THREE.Vector3(0,0,0);
		var negativeW = lineOriginPoint.clone().sub(planeOriginPoint); 
		
		shadowOrigin.getWorldPosition(lineOriginPoint); 
		sensorOrigin.getWorldPosition(planeOriginPoint);
		shadowOrigin.getWorldPosition(planeNormal);
		
		planeNormal.sub(planeOriginPoint);
		
		var lineVector = get_reverse_sun_vector(light).normalize();
		
		//calculate the intersection of the shadow line and the plane representing the sensors
		//as a function of position along the shadow line
		//from http://geomalgorithms.com/a05-_intersect-1.html
		s = - planeNormal.clone().normalize().dot(planeNormal) / planeNormal.clone().normalize().dot(lineVector); 

		var shadowIntersectionPoint = new THREE.Vector3(0,0,0);
		
		shadowIntersectionPoint = lineOriginPoint.clone().add(lineVector.clone().multiplyScalar(s)); 
		//console.log(shadowIntersectionPoint)
		
		
		
		/*
		if (showShadowHelper){//draw a helper
			var geometry = new THREE.Geometry();
			geometry.vertices.push(
				lineOriginPoint,
				shadowIntersectionPoint//get_reverse_sun_vector(light).normalize()
			);
			shadowLineHelper.geometry = geometry;
		}
		*/
		
		// Now work out the shadow intersection point in local coordinates
		var sensorX = new THREE.Vector3(0,0,0);
		var sensorY = new THREE.Vector3(0,0,0);
		var sensorCorner = new THREE.Vector3(0,0,0);
		var shadowRelativePoint = shadowIntersectionPoint.clone()
		
		greenCorner.getWorldPosition(sensorX);
		cyanCorner.getWorldPosition(sensorCorner);
		redCorner.getWorldPosition(sensorY);
		
		sensorX.sub(sensorCorner)
		sensorY.sub(sensorCorner)

		axesLengthX = sensorX.length()
		axesLengthY = sensorY.length() 	
		
		sensorX.normalize()
		sensorY.normalize()
		
		shadowRelativePoint.sub(sensorCorner)
		
		var srx =  (shadowRelativePoint.dot(sensorX) / axesLengthX) - 0.5;
		var sry = (shadowRelativePoint.dot(sensorY) / axesLengthY) - 0.5;
		
		shadow_dx = srx
		shadow_dy = sry
		
		if (showShadowHelper){//draw a helper
			var geometry = new THREE.Geometry();
			geometry.vertices.push(
				lineOriginPoint,
				shadowIntersectionPoint
			);
			shadowLineHelper.geometry = geometry;
		}
			
		
                solarDataValue = {
                  "panel":{
                    "azimuth": panelAzi.toFixed(2),
                    "altitude":panelAlt.toFixed(2),
                    "power":{
                      "theory":theoretical_max_panel_power.toFixed(1),
                      "actual":actual_panel_power.toFixed(1),
                      "score": score.toFixed(1),
                    }
                  },
                  "sun":{
                    "altitude":sun.altitude.toFixed(2),
                    "azimuth":sun.azimuth.toFixed(2),
                    "irradiance":irradiance.toFixed(2)
                  },
                  "time":{
                    "actual": new Date().getTime(),
                    "virtual":simtime
                  },
                  "sensors":{
                    "top":{
                      "left": sensorTopLeft.toFixed(2),
                      "right":sensorTopRight.toFixed(2)
                    },
                    "bottom":{
                      "left":sensorBottomLeft.toFixed(2),
                      "right":sensorBottomRight.toFixed(2)
                    },
                    "shadow":{
                      "dx":shadow_dx.toFixed(2),
                      "dy":shadow_dy.toFixed(2)
                    }
                  }
                }

		updateSolarLoggingData();
                

                

		}//panel !== undefined
	}//if doRender
	
}


