//Wrapper for canvas, auto inits BS and adds useful utils
var Canv = function(init)
{
  var default_init =
  {
    width:640,
    height:320,
    fillStyle:"#000000",
    strokeStyle:"#000000",
    lineWidth:2,
    font:"12px vg_font",
    smoothing:false
  }

  var self = this;
  doMapInitDefaults(init,init,default_init);

  self.canvas = document.createElement('canvas');
  self.canvas.setAttribute('width', init.width);
  self.canvas.setAttribute('height',init.height);
  self.canvas.addEventListener('mousedown',function(evt){ evt.preventDefault(); },false);
  self.canvas.addEventListener('touchstart',function(evt){ evt.preventDefault(); },false);

  self.context = self.canvas.getContext('2d');

  self.context.fillStyle   = init.fillStyle;
  self.context.strokeStyle = init.strokeStyle;
  self.context.lineWidth   = init.lineWidth;
  self.context.font        = init.font;

  self.context.imageSmoothingEnabled = init.smoothing;
};
Canv.prototype.clear = function()
{
  var self = this;
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
};
Canv.prototype.blitTo = function(canv)
{
  var self = this;
  //drawImage(source, sourcex, sourcey, sourcew, sourceh, destx, desty, destw, desth);
  canv.context.drawImage(self.canvas, 0, 0, self.canvas.width, self.canvas.height, 0, 0, canv.canvas.width, canv.canvas.height);
};
Canv.prototype.drawLine = function(ax,ay,bx,by)
{
  var self = this;
  var ca = self.canvas;
  var cx = self.context;

  cx.beginPath();
  cx.moveTo(ax,ay);
  cx.lineTo(bx,by);
  cx.stroke();
}
Canv.prototype.drawGrid = function(x,y,w,h, center_x_t, center_y_t, unit_x_pix, unit_y_pix)
{
  var self = this;
  var ca = self.canvas;
  var cx = self.context;

  var t;
  var tx;
  var ty;

  t = center_x_t;
  tx = lerp(x,x+w,t);
  while(t <= 1)
  {
    self.drawLine(tx,y,tx,y+h);
    tx += unit_x_pix;
    t = invlerp(x,x+w,tx);
  }
  t = center_x_t;
  tx = lerp(x,x+w,t);
  while(t >= 0)
  {
    self.drawLine(tx,y,tx,y+h);
    tx -= unit_x_pix;
    t = invlerp(x,x+w,tx);
  }

  t = center_y_t;
  ty = lerp(y,y+h,t);
  while(t <= 1)
  {
    self.drawLine(x,ty,x+w,ty);
    ty += unit_y_pix;
    t = invlerp(y,y+h,ty);
  }
  t = center_y_t;
  ty = lerp(y,y+h,t);
  while(t >= 0)
  {
    self.drawLine(x,ty,x+w,ty);
    ty -= unit_y_pix;
    t = invlerp(y,y+h,ty);
  }
}
Canv.prototype.drawGraph = function(x,y,w,h, center_x_t, center_y_t, unit_x_pix, unit_y_pix, func)
{
  var self = this;
  var min_fx = -(w/unit_x_pix)*center_x_t;
  var max_fx = (w/unit_x_pix)*(1-center_x_t);
  var min_fy = -(h/unit_y_pix)*center_y_t;
  var max_fy = (h/unit_y_pix)*(1-center_y_t);

  var fx = 0;
  var fy = 0;
  self.context.beginPath();

  fx = mapRange(0,w-1,min_fx,max_fx,0);
  fy = func(fx);
  self.context.moveTo(x+p,mapRange(min_fy,max_fy,y+h,y-1,fy));
  for(var p = 1; p < w; p++)
  {
    fx = mapRange(0,w-1,min_fx,max_fx,p);
    fy = func(fx);
    self.context.lineTo(x+p,mapRange(min_fy,max_fy,y+h,y-1,fy));
  }
  self.context.stroke();
}

