/*
 * grid-panel
 *
 * initial layout calculator for js-panel
 *
 * Copyright 2018 Tim Drysdale
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var jspanelHeightExtra = 20

var voff = 0; //temp var for testing offset with position for scroll-alike

function GridPanel() {

	this.createGrid = function(cols, rows){
	
		var grid = {
			
			'_properties':{
				'aspectRatio':16.0/9.0,
				'cols': cols,
				'rows': rows,
				'height':0,
				'width': 0,
				'hoff':0,//horizontal offset if we need to centre on a wider page
                                'voff':200, 
				'verticalPlacement':{ //in case we want a center float or some offset from the top
					'mode':'top', //['centre', 'top', 'bottom']
					'offset':0 //+ve results in downward shift
				},
				'panels':[],
				'pageHeight':512,
				'pageWidth':1024,
				'sizeRule':'fullWidth', //['showAll','fullWidth']
                                'useMasterPanel': false
			},

			/*
			 * Update the aspectRatio 
			 */
			'calcAspectRatio': function(){
			    var properties = this._properties;
                            properties.aspectRatio = properties.cols / properties.rows;
                        },
			
			/*
			 * Update the height and width that we use to calculate panel size and position
			 */
			'calcUsableArea': function(){
				var properties = this._properties;
				
				if (properties.sizeRule == 'fullWidth'){
					properties.width = Math.round(properties.pageWidth);
					properties.height = Math.round(properties.pageWidth / properties.aspectRatio);
   				}
				else if (properties.sizeRule == 'showAll'){
					
					var pageAspectRatio = properties.pageWidth / properties.pageHeight;
					
					if (properties.aspectRatio >= pageAspectRatio){ //screen is higher than we need, so limited by screen width
						properties.width = properties.pageWidth;
						properties.height = Math.round(properties.pageWidth / properties.aspectRatio);
					}
					else{ //screen is wider than we need, so limited by screen height
						properties.height = properties.pageHeight - jspanelHeightExtra;
						properties.width = Math.round(properties.height * properties.aspectRatio);
						properties.hoff = Math.round((properties.pageWidth - properties.width)/2); //to center panels
					} //if aspectRatio
					
				} //if sizeRule
				
				
			},
			
			/*
			 * Returns the value of a property of this bar graph.
			 */
			'getProperty': function(key) {
				var properties = this._properties;
				var value = properties[key];
				return value;
			},
			
			'setPageSize': function(width, height){
				var properties = this._properties;
				
				properties.pageHeight = height;
				properties.pageWidth = width;
				
				this.calcUsableArea();
			},
			
			/*
			 * Sets the value of a property of this bar graph.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
			},

			'addPanel': function(id, leftGrid, topGrid, width, height, noScroll){
                               				
				this._properties.panels.push({
					'id':id,
					't':topGrid,
					'l':leftGrid,
					'w':width,
					'h':height,
                                        'noScroll':noScroll
				});
                                if (id == "masterPanel"){
                                  this._properties.useMasterPanel = true;
                                }
			},
			
			/*
			 * Returns the height, width and position string for a panel
			 */
			 
			'getPanelDims': function(id){
				var properties = this._properties;
				var panels = properties.panels;
				
				let panel = panels.find(panels => panels.id === id);
				
				if (panel === undefined){
					return undefined
				}
			  else{
                            if (properties.useMasterPanel){
                            if (panel.id == "masterPanel"){
			      var h = properties.height;
			      var w = properties.width;
  			      var l = Math.round(panel.l / properties.cols * properties.width,0) + properties.hoff;
                              var t = voff;
                            }
                            else{ 
			      var h = Math.round(panel.h / properties.rows * properties.height,0);
			      var w = Math.round(panel.w / properties.cols * properties.width,0);
   		              var l = Math.round(panel.l / properties.cols * properties.width,0);                                     
                              var t = Math.round(panel.t / properties.rows * properties.height,0);
                            }
                          }
                            else{

			      var h = Math.round(panel.h / properties.rows * properties.height,0);
			      var w = Math.round(panel.w / properties.cols * properties.width,0);
   		              var l = Math.round(panel.l / properties.cols * properties.width,0) + properties.hoff; 
                              
                              if (panel.noScroll || properties.sizeRule == "showAll"){
                                var t = Math.round(panel.t / properties.rows * properties.height,0);
                              }
                              else{
                                var t = Math.round(panel.t / properties.rows * properties.height,0) + voff;
                              }
}

			  var p = 'left-top ' + l.toString() + ' ' + t.toString();
  
			  return {
			    'h': h,
			    'w': w,
			    'p': p,
                            't': t,
                            'l': l,
			    'page':{'h':properties.pageHeight, 
				    'w':properties.pageWidth
				   },
			    'size':{'height': h + 'px', 'width': w + 'px'}	
			    
			  }					
			}
		  
		}
		
			
		} //grid
		
                grid.calcAspectRatio();
		grid.calcUsableArea();
		
		return grid;
	
	}// createGrid()
}

var gridpanel = new GridPanel();
