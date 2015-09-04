//Wrapper for canvas, auto inits BS and adds useful utils
var Canv = function(init)
{
  var self = this;
  if(!init) init = {};

  if(!init.width)       init.width  = 200;
  if(!init.height)      init.height = 200;
  if(!init.fillStyle)   init.fillStyle   = "#000000";
  if(!init.strokeStyle) init.strokeStyle = "#000000";
  if(!init.lineWidth)   init.lineWidth = 2;
  if(!init.smoothing)   init.smoothing = true;

  self.canvas = document.createElement('canvas');
  self.canvas.setAttribute('width', init.width);
  self.canvas.setAttribute('height',init.height);

  self.context = self.canvas.getContext('2d');

  self.context.fillStyle   = init.fillStyle;
  self.context.strokeStyle = init.strokeStyle;
  self.context.lineWidth   = init.lineWidth;

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
Canv.prototype.drawGrid = function(center_x, center_y, unit_x, unit_y)
{
  var self = this;
  var ca = self.canvas;
  var cx = self.context;

  var t;
  var x;
  var y;

  t = center_x;
  x = lerp(0,ca.width,t);
  while(t < 1)
  {
    self.drawLine(x,0,x,ca.height);
    x += unit_x;
    t = invlerp(0,ca.width,x);
  }
  t = center_x;
  x = lerp(0,ca.width,t);
  while(t > 0)
  {
    self.drawLine(x,0,x,ca.height);
    x -= unit_x;
    t = invlerp(0,ca.width,x);
  }

  t = center_y;
  y = lerp(0,ca.height,t);
  while(t < 1)
  {
    self.drawLine(0,y,ca.width,y);
    y += unit_y;
    t = invlerp(0,ca.height,y);
  }
  t = center_y;
  y = lerp(0,ca.height,t);
  while(t > 0)
  {
    self.drawLine(0,y,ca.width,y);
    y -= unit_y;
    t = invlerp(0,ca.height,y);
  }
}

//sets offsetX/offsetY into the object listening for the event
function enableOffset(evt)
{
  if(evt.offsetX != undefined) return 1;
  else if(evt.touches != undefined && evt.touches[0] != undefined)
  {
    evt.offsetX = evt.touches[0].pageX - evt.touches[0].target.offsetLeft;
    evt.offsetY = evt.touches[0].pageY - evt.touches[0].target.offsetTop;
    return 1;
  }
  else if(evt.layerX != undefined && evt.originalTarget != undefined)
  {
    evt.offsetX = evt.layerX-evt.originalTarget.offsetLeft;
    evt.offsetY = evt.layerY-evt.originalTarget.offsetTop;
    return 1;
  }
  else //give up because javascript is terrible
  {
    evt.offsetX = 0;
    evt.offsetY = 0;
    return 0;
  }
}

function lerp(s,e,t)
{
  return s+((e-s)*t);
}

function invlerp(s,e,v)
{
  return (v-s)/(e-s);
}

function mapPt(from,to,pt)
{
  pt.x = ((pt.x-from.x)/from.w)*to.w+to.x;
  pt.y = ((pt.y-from.y)/from.h)*to.h+to.y;
  return pt;
}
function mapRect(from,to,rect)
{
  rect.x = ((rect.x-from.x)/from.w)*to.w+to.x;
  rect.y = ((rect.y-from.y)/from.h)*to.h+to.y;
  rect.w = (rect.w/from.w)*to.w;
  rect.h = (rect.h/from.h)*to.h;
  return rect;
}

function NumberBox(val,callback)
{
  var self = this;
  var el = document.createElement("input");
  el.type = "text";
  el.number = val;
  el.value = val;
  var processInput = function(n)
  {
    if(!isNaN(parseFloat(n)) && isFinite(n))
    {
      el.number = parseFloat(n);
      callback(el.number);
    }
  }
  el.addEventListener("keyup",
    function(evt)
    {
      processInput(el.value);
      if(evt.keyCode == 13) el.blur();
    },
    false
  );
  el.addEventListener("blur",
    function(evt)
    {
      el.value = el.number;
    },
    false
  );
  el.set = function(n)
  {
    processInput(n);
    el.value = el.number;
  }
  return el;
}

