/*
var gridBig = gridpanel.createGrid(16, 9);
gridBig.setProperty('sizeRule','showAll');

gridBig.addPanel('renderPanel',0,0,8,7);
gridBig.addPanel('graphPanel',8,0,5,3);
gridBig.addPanel('blocklyPanel',8,3,8,6.5);
gridBig.addPanel('sensorPanel',13,0,3,3);
gridBig.addPanel('clockPanel',0,7,2,2);
gridBig.addPanel('scorePanel',2,7,2,2);
gridBig.addPanel('codePanel',6,7,2,2);
gridBig.addPanel('dataPanel',4,7,2,2);
*/


/*

//order from smallest to largest, else a larger then desired grid may be made active
var configuration = { grids:[
		{
			'id':'small',
			'cols':3,
			'rows':12,
			'minwidth':0,
			'sizeRule':'fullWidth'
		},
		{   'id':'big',
			'cols':16,
			'rows':9,
			'minwidth':600,
			'sizeRule':'showAll'
		}
	]
}

var grid = metagrid.createGrid(configuration);

grid.addPanel('renderPanel',  0, 0, 8, 7, 'big');
grid.addPanel('graphPanel',   8, 0, 5, 3, 'big');
grid.addPanel('blocklyPanel', 8, 3, 8, 6.5, 'big');
grid.addPanel('sensorPanel', 13, 0, 3, 3, 'big');
grid.addPanel('clockPanel',   0, 7, 2, 2, 'big');
grid.addPanel('scorePanel',   2, 7, 2, 2, 'big');
grid.addPanel('codePanel',    6, 7, 2, 2, 'big');
grid.addPanel('dataPanel',    4, 7, 2, 2, 'big');

grid.addPanel('renderPanel',  0,  0, 3, 3, 'small');
grid.addPanel('graphPanel',   0,  3, 3, 2, 'small');
grid.addPanel('sensorPanel',  0,  5, 1, 1, 'small');
grid.addPanel('clockPanel',   1,  5, 1, 1, 'small');
grid.addPanel('scorePanel',   2,  5, 1, 1, 'small');
grid.addPanel('blocklyPanel', 0,  6, 3, 3, 'small');
grid.addPanel('codePanel',    0,  7, 1.5, 1, 'small');
grid.addPanel('dataPanel',    1.5,  7, 1,5, 1, 'small');

*/
//
//function MetaGrid() {
//
//	this.createMetaGrid = function(configuration){
//		
//		// note we call setupGrids with configuration as a parameter
//		
//		var metagrid =  {
//			'_configuration': configuration,
//			'_grids': [],
//			'_properties':{
//				'pageHeight':512,
//				'pageWidth':1024,
//			},
//			
//			/*
//			 * return a reference to a grid with the given id
//			 */
//			'getGridById': function(id){
//				var grids = this._grids;
//				console.log("grids",grids)
//				var grid = grids.find(grids => grids.id === id); 
//				return grid
//			},
//			
//			/*
//			 * Choose a grid that suits the current page width (setPageSize first!)
//			 * Note that we force the user to choose _when_ to update the active grid
//			 * so that they can control what element they resize against, and when
//			 */
//			'setActiveGrid': function(id){
//				var grids = this._grids;
//				var properties = this._properties;
//				var activeGrid = this._activeGrid;
//				
//				if (id !== undefined) {
//					// in case we want to set to a specific id for debugging
//					activeGrid = getGridById(id);
//				}
//				else {
//					//choose grid based on the minwidth rule, want lowest acceptable width
//					// TODO - choose lowest acceptable width, not just first acceptable width found
//					activeGrid = grids.find(grids => grids.minwidth >= properties.pageWidth);
//					if (activeGrid === undefined) { // in case user does not specifiy a grid with 0 minwidth
//						activeGrid = grids[0]; //assuming we have at least one grid!
//					}//if
//				}//else
//				
//			},
//			
//			/*
//			 * Returns a reference to the grid that is currently active
//			 */ 
//			getActiveGrid(){
//				return this._activeGrid;
//			},
//			
//			/* 
//			 * Setup the grids we are going to use 
//			 * Note that only two are probalby reliably supported at present - see setActiveGrid
//			 * And one grid should have minpx = 0!
//			 */
//			'setupGrids': function(){
//				var grids = this._grids;
//				var configuration = this._configuration;
//				var getGridById = this.getGridById;
//				
//				console.log(configuration)
//				
//				configuration.grids.forEach(function(config){
//				
//					grids.push({
//								'id':config.id, 
//								'minwidth': config.minwidth,
//								'grid': gridpanel.createGrid(config.cols, config.rows)
//								}); //push
//					console.log(grids)
//					//now set additional properties that we can't set at configuration time
//					if (config.sizeRule !== undefined){
//						getGridById(config.id).setProperty('sizeRule', config.sizeRule);
//					}//if
//					
//				});
//				
//				
//			}, //setupGrids()
//				
//				
//			/*
//			 * Returns the value of a property of this bar graph.
//			 */
//			'getProperty': function(key) {
//				var properties = this._properties;
//				var value = properties[key];
//				return value;
//			},
//			
//			'setPageSize': function(width, height){
//				
//				var properties = this._properties;
//				
//				properties.pageHeight = height;
//				properties.pageWidth = width;
//				
//				this.setActiveGrid();
//				this._activeGrid.setPageSize(width, height);
//				
//			},
//			
//			/*
//			 * Sets the value of a property.
//			 */
//			'setProperty': function(key, value) {
//				this._properties[key] = value;
//			},
//
//			/* add a panel to a grid */
//			'addPanel': function(id, leftGrid, topGrid, width, height, gridId){
//				this.getGridById(gridId).addPanel(id,leftGrid,topGrid, width, height);
//			},
//			
//			/*
//			 * Returns the height, width and position string for a panel
//			 */
//			 
//			'getPanelDims': function(id){
//				return this._activeGrid.getPanelDims(id);
//			}
//		
//			
//		} //grid
//		
//		metagrid.setupGrids();
//		
//		return metagrid;
//	
//	}// createMetaGrid()
//}
//
//var metagrid = new MetaGrid();
//

