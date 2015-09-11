var fv2 = function(x,y)
{
  var self = this;
  self.x = x;
  self.y = y;
}
fv2.prototype.clone = function(v)
{
  var self = this;
  self.x = v.x;
  self.y = v.y;
}

var GamePlayScene = function(game, stage)
{
  var self = this;
  var c = stage.drawCanv;
  var ca = c.canvas;
  var cx = c.context;

  self.vec = new fv2(2,3);

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:ca.height,w:ca.width,h:-ca.height};
  var grid_x_w = screen.w/grid_x;
  var grid_y_h = -screen.h/grid_y;

  var ss_vec    = mapPt(world,screen,new fv2(0,0));
  var ss_origin = mapPt(world,screen,new fv2(0,0));

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
    c.drawGrid(0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;
    ss_vec.clone(self.vec);
    mapPt(world,screen,ss_vec);

    c.drawLine(ss_origin.x,ss_origin.y,ss_vec.x,ss_vec.y);
  };

  self.cleanup = function()
  {
  };

};

