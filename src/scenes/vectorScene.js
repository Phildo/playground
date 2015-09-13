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

var VectorScene = function(space, stage)
{
  var self = this;
  var c = stage.drawCanv;
  var ca = c.canvas;
  var cx = c.context;

  var keyer = new Keyer({source:stage.dispCanv.canvas});
  var dragger = new Dragger({source:stage.dispCanv.canvas});
  var blurer = new Blurer({source:stage.dispCanv.canvas});

  self.vec = new fv2(2,3);

  self.in_x = new NumberBox(105,20,40,20,2,0.1,function(n){self.vec.x = n;});
  self.in_y = new NumberBox(155,20,40,20,3,0.1,function(n){self.vec.y = n;});
  keyer.register(self.in_x);
  keyer.register(self.in_y);
  dragger.register(self.in_x);
  dragger.register(self.in_y);
  blurer.register(self.in_x);
  blurer.register(self.in_y);

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:100,w:100,h:-100};
  var grid_x_w = 100/grid_x;
  var grid_y_h = 100/grid_y;

  var ss_vec    = mapPt(world,screen,new fv2(0,0));
  var ss_origin = mapPt(world,screen,new fv2(0,0));

  self.ready = function()
  {
  };

  self.tick = function()
  {
    keyer.flush();
    dragger.flush();
    blurer.flush();
  };

  self.draw = function()
  {
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    c.drawGrid(0,0,100,100,0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;
    ss_vec.clone(self.vec);
    mapPt(world,screen,ss_vec);

    c.drawLine(ss_origin.x,ss_origin.y,ss_vec.x,ss_vec.y);

    self.in_x.draw(c);
    self.in_y.draw(c);
  };

  self.cleanup = function()
  {
  };

};

