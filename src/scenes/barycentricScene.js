var fv3 = function(x,y,z)
{
  var self = this;
  self.x = x;
  self.y = y;
  self.z = z;
}
fv3.prototype.clone = function(v)
{
  var self = this;
  self.x = v.x;
  self.y = v.y;
  self.z = v.z;
}

var BarycentricScene = function(space, stage)
{
  var self = this;
  var c = stage.drawCanv;
  var ca = c.canvas;
  var cx = c.context;

  var keyer = new Keyer({source:stage.dispCanv.canvas});
  var dragger = new Dragger({source:stage.dispCanv.canvas});
  var blurer = new Blurer({source:stage.dispCanv.canvas});
  var presser = new Presser({source:stage.dispCanv.canvas});

  self.a = new fv3(-2,2,0);
  self.b = new fv3(2,3,0);
  self.c = new fv3(-1,-2,0);
  self.p = new fv3(1,2,0);
  self.vec = new fv3(1,1);

  self.bary_t = new ToggleBox(205,5,20,20,1,function(o){console.log(o);});
  self.cart_t = new ToggleBox(230,5,20,20,0,function(o){console.log(o);});
  self.def_t  = new ToggleBox(255,5,20,20,0,function(o){console.log(o);});

  presser.register(self.bary_t);
  presser.register(self.cart_t);
  presser.register(self.def_t);

  self.in_x = new NumberBox(205,50,40,20,1,0.1,function(n){self.vec.x = n;});
  self.in_y = new NumberBox(255,50,40,20,1,0.1,function(n){self.vec.y = n;});

  keyer.register(self.in_x);
  keyer.register(self.in_y);
  dragger.register(self.in_x);
  dragger.register(self.in_y);
  blurer.register(self.in_x);
  blurer.register(self.in_y);

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:200,w:200,h:-200};
  var grid_x_w = 200/grid_x;
  var grid_y_h = 200/grid_y;

  var ss_a      = mapPt(world,screen,new fv3(0,0));
  var ss_b      = mapPt(world,screen,new fv3(0,0));
  var ss_c      = mapPt(world,screen,new fv3(0,0));
  var ss_vec    = mapPt(world,screen,new fv3(0,0));
  var ss_origin = mapPt(world,screen,new fv3(0,0));

  self.ready = function()
  {
  };

  self.tick = function()
  {
    keyer.flush();
    dragger.flush();
    blurer.flush();
    presser.flush();

    ss_vec.clone(self.vec);
    ss_a.clone(self.a);
    ss_b.clone(self.b);
    ss_c.clone(self.c);
    mapPt(world,screen,ss_a);
    mapPt(world,screen,ss_b);
    mapPt(world,screen,ss_c);
    mapPt(world,screen,ss_vec);
  };

  self.draw = function()
  {
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    c.drawGrid(0,0,200,200,0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;

    c.drawLine(ss_a.x,ss_a.y,ss_b.x,ss_b.y);
    c.drawLine(ss_b.x,ss_b.y,ss_c.x,ss_c.y);
    c.drawLine(ss_c.x,ss_c.y,ss_a.x,ss_a.y);
    c.drawLine(ss_origin.x,ss_origin.y,ss_vec.x,ss_vec.y);

    self.bary_t.draw(c);
    self.cart_t.draw(c);
    self.def_t.draw(c);
    self.in_x.draw(c);
    self.in_y.draw(c);
  };

  self.cleanup = function()
  {
  };

};

