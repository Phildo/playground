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
  var cc = stage.drawCanv;
  var ca = cc.canvas;
  var cx = cc.context;

  var keyer = new Keyer({source:stage.dispCanv.canvas});
  var dragger = new Dragger({source:stage.dispCanv.canvas});
  var blurer = new Blurer({source:stage.dispCanv.canvas});
  var presser = new Presser({source:stage.dispCanv.canvas});

  self.a = new fv3(-2,2,0);  var a = self.a;
  self.b = new fv3(2,3,0);   var b = self.b;
  self.c = new fv3(-1,-2,0); var c = self.c;
  self.p = new fv3(1,2,0);   var p = self.p;
  self.v = new fv3(1,1,0);   var v = self.v;

  function propagatev()
  {
    p.x = ( ((b.y-c.y)*(v.x-c.x)) + ((c.x-b.x)*(v.y-c.y)) ) / ( ((b.y-c.y)*(a.x-c.x)) + ((c.x-b.x)*(a.y-c.y)) );
    p.y = ( ((c.y-a.y)*(v.x-c.x)) + ((a.x-c.x)*(v.y-c.y)) ) / ( ((b.y-c.y)*(a.x-c.x)) + ((c.x-b.x)*(a.y-c.y)) );
    p.z = 1-p.y-p.x;

    self.handle.x = v.x;
    self.handle.y = v.y;
    mapPt(world,screen,self.handle);
    self.handle.x -= self.handle.w/2;
    self.handle.y -= self.handle.h/2;

    mapToInputs();
  }
  function propagatep()
  {
    v.x = a.x*p.x + b.x*p.y + c.x*p.z;
    v.y = a.y*p.x + b.y*p.y + c.y*p.z;

    self.handle.x = v.x;
    self.handle.y = v.y;
    mapPt(world,screen,self.handle);
    self.handle.x -= self.handle.w/2;
    self.handle.y -= self.handle.h/2;

    mapToInputs();
  }
  function mapToInputs()
  {
    self.in_vec_cart_x.value = ""+(self.in_vec_cart_x.number = v.x);
    self.in_vec_cart_y.value = ""+(self.in_vec_cart_y.number = v.y);

    self.in_vec_bary_a.value = ""+(self.in_vec_bary_a.number = p.x);
    self.in_vec_bary_b.value = ""+(self.in_vec_bary_b.number = p.y);
    self.in_vec_bary_c.value = ""+(self.in_vec_bary_c.number = p.z);

    self.in_vec_def_a_x.value = ""+(self.in_vec_def_a_x.number = a.x);
    self.in_vec_def_a_y.value = ""+(self.in_vec_def_a_y.number = a.y);
    self.in_vec_def_b_x.value = ""+(self.in_vec_def_b_x.number = b.x);
    self.in_vec_def_b_y.value = ""+(self.in_vec_def_b_y.number = b.y);
    self.in_vec_def_c_x.value = ""+(self.in_vec_def_c_x.number = c.x);
    self.in_vec_def_c_y.value = ""+(self.in_vec_def_c_y.number = c.y);
  }

  self.in_vec_cart_x = new NumberBox(205,50,40,20,1,0.1,function(n){v.x = n; propagatev(); });
  self.in_vec_cart_y = new NumberBox(255,50,40,20,1,0.1,function(n){v.y = n; propagatev(); });

  self.in_vec_bary_a = new NumberBox(205,50,40,20,1,0.1,function(n){p.x = n; propagatep(); });
  self.in_vec_bary_b = new NumberBox(255,50,40,20,1,0.1,function(n){p.y = n; propagatep(); });
  self.in_vec_bary_c = new NumberBox(305,50,40,20,1,0.1,function(n){p.z = n; propagatep(); });

  self.in_vec_def_a_x = new NumberBox(205, 50,40,20,1,0.1,function(n){a.x = n; propagatev(); });
  self.in_vec_def_a_y = new NumberBox(255, 50,40,20,1,0.1,function(n){a.y = n; propagatev(); });
  self.in_vec_def_b_x = new NumberBox(205,100,40,20,1,0.1,function(n){b.x = n; propagatev(); });
  self.in_vec_def_b_y = new NumberBox(255,100,40,20,1,0.1,function(n){b.y = n; propagatev(); });
  self.in_vec_def_c_x = new NumberBox(205,150,40,20,1,0.1,function(n){c.x = n; propagatev(); });
  self.in_vec_def_c_y = new NumberBox(255,150,40,20,1,0.1,function(n){c.y = n; propagatev(); });

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

  var bary_t_select = function(o)
  {
    self.bary_t.on = o;
    if(o)
    {
      self.cart_t.set(false);
      self.def_t.set(false);

      regNB(self.in_vec_bary_a);
      regNB(self.in_vec_bary_b);
      regNB(self.in_vec_bary_c);
    }
    else
    {
      unregNB(self.in_vec_bary_a);
      unregNB(self.in_vec_bary_b);
      unregNB(self.in_vec_bary_c);
    }
  }
  var cart_t_select = function(o)
  {
    self.cart_t.on = o;
    if(o)
    {
      self.def_t.set(false);
      self.bary_t.set(false);

      regNB(self.in_vec_cart_x);
      regNB(self.in_vec_cart_y);
    }
    else
    {
      unregNB(self.in_vec_cart_x);
      unregNB(self.in_vec_cart_y);
    }
  }
  var def_t_select = function(o)
  {
    self.def_t.on = o;
    if(o)
    {
      self.bary_t.set(false);
      self.cart_t.set(false);

      regNB(self.in_vec_def_a_x);
      regNB(self.in_vec_def_a_y);
      regNB(self.in_vec_def_b_x);
      regNB(self.in_vec_def_b_y);
      regNB(self.in_vec_def_c_x);
      regNB(self.in_vec_def_c_y);
    }
    else
    {
      unregNB(self.in_vec_def_a_x);
      unregNB(self.in_vec_def_a_y);
      unregNB(self.in_vec_def_b_x);
      unregNB(self.in_vec_def_b_y);
      unregNB(self.in_vec_def_c_x);
      unregNB(self.in_vec_def_c_y);
    }
  }
  self.bary_t = new ToggleBox(205,5,20,20,1,bary_t_select);
  self.cart_t = new ToggleBox(230,5,20,20,0,cart_t_select);
  self.def_t  = new ToggleBox(255,5,20,20,0,def_t_select);

  presser.register(self.bary_t);
  presser.register(self.cart_t);
  presser.register(self.def_t);

  var grid_x = 10;
  var grid_y = 10;
  var world  = {x:-(grid_x/2),y:-(grid_y/2),w:grid_x,h:grid_y};
  var screen = {x:0,y:200,w:200,h:-200};
  var grid_x_w = 200/grid_x;
  var grid_y_h = 200/grid_y;

  var ss_a = mapPt(world,screen,new fv3(0,0));
  var ss_b = mapPt(world,screen,new fv3(0,0));
  var ss_c = mapPt(world,screen,new fv3(0,0));
  var ss_v = mapPt(world,screen,new fv3(0,0));
  var ss_o = mapPt(world,screen,new fv3(0,0));

  self.handle = new Draggable({x:1,y:1,w:10,h:10});
  mapPt(screen,world,self.handle);
  var tmp = self.handle.drag;
  self.handle.drag = function(evt)
  {
    tmp(evt);
    var vec = new fv3(self.handle.x+(self.handle.w/2), self.handle.y+(self.handle.h/2), 0);
    mapPt(screen,world,vec);
    self.v.x = vec.x;
    self.v.y = vec.y;
    self.v.z = vec.z;
    propagatev();
  }
  dragger.register(self.handle);

  propagatev();
  cart_t_select(true);

  self.ready = function()
  {
  };

  self.tick = function()
  {
    keyer.flush();
    dragger.flush();
    blurer.flush();
    presser.flush();

    ss_v.clone(v);
    ss_a.clone(a);
    ss_b.clone(b);
    ss_c.clone(c);
    mapPt(world,screen,ss_v);
    mapPt(world,screen,ss_a);
    mapPt(world,screen,ss_b);
    mapPt(world,screen,ss_c);
  };

  self.draw = function()
  {
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    cc.drawGrid(0,0,200,200,0.5,0.5,grid_x_w,grid_y_h);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;

    cc.drawLine(ss_a.x,ss_a.y,ss_b.x,ss_b.y);
    cc.drawLine(ss_b.x,ss_b.y,ss_c.x,ss_c.y);
    cc.drawLine(ss_c.x,ss_c.y,ss_a.x,ss_a.y);
    cc.drawLine(ss_o.x,ss_o.y,ss_v.x,ss_v.y);

    self.bary_t.draw(cc);
    self.cart_t.draw(cc);
    self.def_t.draw(cc);

    if(self.bary_t.on)
    {
      self.in_vec_bary_a.draw(cc);
      self.in_vec_bary_b.draw(cc);
      self.in_vec_bary_c.draw(cc);
    }
    else if(self.cart_t.on)
    {
      self.in_vec_cart_x.draw(cc);
      self.in_vec_cart_y.draw(cc);
    }
    else if(self.def_t.on)
    {
      self.in_vec_def_a_x.draw(cc);
      self.in_vec_def_a_y.draw(cc);
      self.in_vec_def_b_x.draw(cc);
      self.in_vec_def_b_y.draw(cc);
      self.in_vec_def_c_x.draw(cc);
      self.in_vec_def_c_y.draw(cc);
    }

    self.handle.draw(cc);

  };

  self.cleanup = function()
  {
  };

};

