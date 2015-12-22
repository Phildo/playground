var GraphScene = function(space, stage)
{
  var self = this;
  var c = stage.drawCanv;
  var ca = c.canvas;
  var cx = c.context;

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:100,w:100,h:-100};
  var grid_x_w = 100/grid_x;
  var grid_y_h = 100/grid_y;

  self.ready = function()
  {
  };

  self.tick = function()
  {
  };

  self.draw = function()
  {
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    c.drawGrid(0,0,100,100,0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;

    c.drawGraph(0,0,100,100,0.5,0.5,grid_x_w,grid_y_h,
      function(x){
        //return x;
        return Math.pow(Math.cos(x/3),5)*3;
        //return Math.pow(x/5,2);
        //return 1-Math.pow(x/5,2);
      }
    );
  };

  self.cleanup = function()
  {
  };

};

