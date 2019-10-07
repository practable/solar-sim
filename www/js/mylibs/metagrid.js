/*

metagrid

combines gridpanel objects to make responsive design across mobile (small) and desktop (big) screens

*/



class MetaGrid {

  constructor(name){
    this.name = name;
    this._grids = [];
    this._properties = {
      'pageHeight': 512,
      'pageWidth': 1024,
    }
  }

  createGrid(configuration){
    this._configuration = configuration;
    this.setupGrids()
  }
  /*
   * when called by another method, this is undefined
   * so we pass grids object as well
   */
  getGridById(grids, id){
    var grid = grids.find(grids => grids.id === id); 
    return grid
  }
  
  /*
   * Choose a grid that suits the current page width (setPageSize first!)
   * Note that we force the user to choose _when_ to update the active grid
   * so that they can control what element they resize against, and when
   */
  setActiveGrid(id){
    var grids = this._grids;
    var properties = this._properties;
    var activeGrid = this._activeGrid;
    
    if (id !== undefined) {
      // in case we want to set to a specific id for debugging
      activeGrid = getGridById(grids, id);
    }
    else {

      function compareWidth(a,b){
        return a.minwidth - b.minwidth;
      }      
      
      var sortedGrids = grids.sort(compareWidth)
      
      sortedGrids.forEach(function(grid){
        if (properties.pageWidth >= grid.minwidth){
          activeGrid = grid
        }
      })
      
      if (activeGrid === undefined) { // in case user does not specifiy a grid with 0 minwidth
	activeGrid = grids[0]; //assuming we have at least one grid!
      }//if
    }//else
   this._activeGrid = activeGrid;

  }
  
  /*
   * Returns a reference to the grid that is currently active
   */ 
  getActiveGrid(){
    return this._activeGrid;
  }
  
  /* 
   * Setup the grids we are going to use 
   * Note that only two are probalby reliably supported at present - see setActiveGrid
   * And one grid should have minpx = 0!
   */
  setupGrids(){
    var grids = this._grids;

    var getGridById = this.getGridById;
    
    this._configuration.grids.forEach(function(config){
      
      grids.push({
	'id':config.id, 
	'minwidth': config.minwidth,
	'grid': gridpanel.createGrid(config.cols, config.rows)
      }); //push

      //now set additional properties that we can't set at configuration time
      if (config.sizeRule !== undefined){
        var thisGrid = 	getGridById(grids, config.id);
	thisGrid.grid.setProperty('sizeRule', config.sizeRule);
      }//if
      
    });
    
    
  } //setupGrids()
  
  
  /*
   * Returns the value of a property of this bar graph.
   */
  getProperty(key) {
    var properties = this._properties;
    var value = properties[key];
    return value;
  }
  
  setPageSize(width, height){
    var properties = this._properties;
    
    properties.pageHeight = height;
    properties.pageWidth = width;
    
    this.setActiveGrid();
    this._activeGrid.grid.setPageSize(width, height);
    
  }
  
  /*
   * Sets the value of a property.
   */
  setProperty(key, value) {
    this._properties[key] = value;
  }

  /* add a panel to a grid */
  addPanel(id, leftGrid, topGrid, width, height, gridId, noScroll){
    var thisGrid = this.getGridById(this._grids, gridId)
    if (thisGrid !== undefined) 
        if (thisGrid.grid !== undefined) {
          thisGrid.grid.addPanel(id,leftGrid,topGrid, width, height, noScroll);
        }
        else{
          console.log('WARNING: ' + thisGrid.id + ' has no grid so cannot add panel ' + id)
        }
     else{
       console.log('WARNING: cannot find ' + gridId + ' so cannot add panel ' + id)
     }
       
  }
  
  /*
   * Returns the height, width and position string for a panel
   */
  
  getPanelDims(id){
    return this._activeGrid.grid.getPanelDims(id);
  }
  
  
} //metagrid




	
