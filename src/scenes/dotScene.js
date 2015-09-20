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

var DotScene = function(space, stage)
{
  var self = this;
  var cc = stage.drawCanv;
  var ca = cc.canvas;
  var cx = cc.context;

  var keyer = new Keyer({source:stage.dispCanv.canvas});
  var dragger = new Dragger({source:stage.dispCanv.canvas});
  var blurer = new Blurer({source:stage.dispCanv.canvas});

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:ca.height,w:ca.height,h:-ca.height};
  var grid_x_w = ca.height/grid_x;
  var grid_y_h = ca.height/grid_y;

  self.a = new fv2(-2, 2); var a = self.a;
  self.b = new fv2( 2, 3); var b = self.b;
  self.o = new fv2( 0, 0); var o = self.o;
  self.d = 0;

  var ss_a = mapPt(world,screen,new fv2(a.x,a.y));
  var ss_b = mapPt(world,screen,new fv2(b.x,b.y));
  var ss_o = mapPt(world,screen,new fv2(o.x,o.y));

  function propagate()
  {
    self.d = a.x*b.x + a.y*b.y;

    self.ahandle.x = a.x;
    self.ahandle.y = a.y;

    self.bhandle.x = b.x;
    self.bhandle.y = b.y;

    mapPt(world,screen,self.ahandle);
    mapPt(world,screen,self.bhandle);

    self.ahandle.x -= self.ahandle.w/2;
    self.ahandle.y -= self.ahandle.h/2;

    self.bhandle.x -= self.bhandle.w/2;
    self.bhandle.y -= self.bhandle.h/2;

    mapToInputs();
  }
  function mapToInputs()
  {
    self.in_a_x.value = ""+(self.in_a_x.number = a.x);
    self.in_a_y.value = ""+(self.in_a_y.number = a.y);

    self.in_b_x.value = ""+(self.in_b_x.number = b.x);
    self.in_b_y.value = ""+(self.in_b_y.number = b.y);
  }

  function regNB(nb)
  {
    keyer.register(nb);
    dragger.register(nb);
    blurer.register(nb);
  }
  function unregNB(nb)
  {
    keyer.unregister(nb);
    dragger.unregister(nb);
    blurer.unregister(nb);
  }

  self.in_a_x = new NumberBox(ca.height+10,  10,40,20,1,0.1,function(n){ a.x = n; propagate(); });
  self.in_a_y = new NumberBox(ca.height+50, 10,40,20,1,0.1,function(n){ a.y = n; propagate(); });

  self.in_b_x = new NumberBox(ca.height+10,  40,40,20,1,0.1,function(n){ b.x = n; propagate(); });
  self.in_b_y = new NumberBox(ca.height+50, 40,40,20,1,0.1,function(n){ b.y = n; propagate(); });

  regNB(self.in_a_x);
  regNB(self.in_a_y);
  regNB(self.in_b_x);
  regNB(self.in_b_y);

  self.ahandle = new Draggable({x:a.x,y:a.y,w:10,h:10});
  mapPt(screen,world,self.ahandle);
  var tmpa = self.ahandle.drag;
  self.ahandle.drag = function(evt)
  {
    tmpa(evt);
    a.x = self.ahandle.x+(self.ahandle.w/2);
    a.y = self.ahandle.y+(self.ahandle.h/2);
    mapPt(screen,world,a);
    propagate();
  }
  dragger.register(self.ahandle);

  self.bhandle = new Draggable({x:b.x,y:b.y,w:10,h:10});
  mapPt(screen,world,self.bhandle);
  var tmpb = self.bhandle.drag;
  self.bhandle.drag = function(evt)
  {
    tmpb(evt);
    b.x = self.bhandle.x+(self.bhandle.w/2);
    b.y = self.bhandle.y+(self.bhandle.h/2);
    mapPt(screen,world,b);
    propagate();
  }
  dragger.register(self.bhandle);

  propagate();

  self.ready = function()
  {
  };

  self.tick = function()
  {
    keyer.flush();
    dragger.flush();
    blurer.flush();

    ss_a.clone(a);
    ss_b.clone(b);
    mapPt(world,screen,ss_a);
    mapPt(world,screen,ss_b);
  };

  self.draw = function()
  {
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    cc.drawGrid(0,0,ca.height,ca.height,0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;

    cc.drawLine(ss_o.x,ss_o.y,ss_a.x,ss_a.y);
    cc.drawLine(ss_o.x,ss_o.y,ss_b.x,ss_b.y);

    self.in_a_x.draw(cc);
    self.in_a_y.draw(cc);
    self.in_b_x.draw(cc);
    self.in_b_y.draw(cc);

    self.ahandle.draw(cc);
    self.bhandle.draw(cc);

    cx.fillText(self.d, ca.height+10, ca.height-20);
  };

  self.cleanup = function()
  {
  };

};

