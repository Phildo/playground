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

//rect = {x:input.x,y:input.y,w:input.w,h:input.h};
//pass in output rect because object creation/cleanup expensive!
//input CAN be output if you don't care about input being mutated
function rectMap(oldr, newr, inputr, outputr)
{
  outputr.x = (inputr.x/oldr.w)*newr.w;
  outputr.y = (inputr.y/oldr.h)*newr.h;
  outputr.w = (inputr.w/oldr.w)*newr.w;
  outputr.h = (inputr.h/oldr.h)*newr.h;
}

