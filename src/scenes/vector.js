window.addEventListener("load", function() { var vec = new VectorPlayground(); }, false);

var VectorPlayground = function()
{
  var Vector = function(x,y)
  {
    var self = this;
    self.x = x;
    self.y = y;
  }
  Vector.prototype.clone = function(v)
  {
    var self = this;
    self.x = v.x;
    self.y = v.y;
  }

  var self = this;
  self.playground = document.getElementById("vector_playground");
  self.playground.style.width = "500px";
  self.playground.style.height = "200px";
  self.playground.style.padding = "10px";
  self.playground.style.border = "1px solid black";

  var c = new Canv();
  var ca = c.canvas;
  var cx = c.context;
  self.canv = c;
  ca.style.border = "1px solid black";
  self.playground.appendChild(c.canvas)

  var x_box = GenNumberBox(0,function(n){ self.vector.x = n; self.draw();});
  x_box.style.width = "30px";
  var y_box = GenNumberBox(0,function(n){ self.vector.y = n; self.draw();});
  y_box.style.width = "30px";

  self.playground.appendChild(x_box);
  self.playground.appendChild(y_box);

  self.vector = new Vector(2,3);

  var world  = {x:-5,y:-5,w:10,h:10};
  var screen = {x:0,y:ca.height,w:ca.width,h:-ca.height};

  var ss_vec    = mapPt(world,screen,new Vector(0,0));
  var ss_origin = mapPt(world,screen,new Vector(0,0));

  self.draw = function()
  {
    c.clear();
    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;
    c.drawGrid(0.5,0.5,20,20);

    cx.strokeStyle = "#FF0000";
    cx.lineWidth = 2;
    ss_vec.clone(self.vector);
    mapPt(world,screen,ss_vec);

    c.drawLine(ss_origin.x,ss_origin.y,ss_vec.x,ss_vec.y);
  }

  x_box.set(self.vector.x);
  y_box.set(self.vector.y);
}

