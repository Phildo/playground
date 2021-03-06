/*
*
* DISCLAIMER: Javascript is terrible, and these utils are NOT intended for use in the general case
* for JS and all of its terribleness. These functions operate only on the most naively constructed of
* objects. If you're trying to do something fancy and these don't work for you, please take the
* rest of the day off to question your life choices. I wish you the best of luck.
*
*/

//maps attributes found in defaults from init onto obj, falling back to defaults value if not present in init
var doMapInitDefaults = function(obj, init, defaults)
{
  var attribs = Object.keys(defaults);
  for(var i = 0; i < attribs.length; i++)
  {
    var k = attribs[i];
    obj[k] = init.hasOwnProperty(k) ? init[k] : defaults[k];
  }
}

//sets doX and doY as x/y offset into the object listening for the event
function doSetPosOnEvent(evt)
{
  if(evt.offsetX != undefined)
  {
    evt.doX = evt.offsetX;
    evt.doY = evt.offsetY;
  }
  else if(evt.touches != undefined && evt.touches[0] != undefined)
  {
    evt.doX = evt.touches[0].pageX - evt.touches[0].target.offsetLeft;
    evt.doY = evt.touches[0].pageY - evt.touches[0].target.offsetTop;
  }
  else if(evt.layerX != undefined && evt.originalTarget != undefined)
  {
    evt.doX = evt.layerX - evt.originalTarget.offsetLeft;
    evt.doY = evt.layerY - evt.originalTarget.offsetTop;
  }
  else //give up because javascript is terrible
  {
    evt.doX = 0;
    evt.doY = 0;
  }
}

function feq(f1,f2,e)
{
  return (f1 < f2+e && f1 > f2-e);
}

function lerp(s,e,t)
{
  return s+((e-s)*t);
}

function invlerp(s,e,v)
{
  return (v-s)/(e-s);
}

function mapRange(from_min,from_max,to_min,to_max,from_v)
{
  return lerp(to_min,to_max,invlerp(from_min,from_max,from_v));
}
function mapPt(from_rect,to_rect,pt)
{
  pt.x = ((pt.x-from_rect.x)/from_rect.w)*to_rect.w+to_rect.x;
  pt.y = ((pt.y-from_rect.y)/from_rect.h)*to_rect.h+to_rect.y;
  return pt;
}
function mapRect(from_rect,to_rect,rect)
{
  rect.x = ((rect.x-from_rect.x)/from_rect.w)*to_rect.w+to_rect.x;
  rect.y = ((rect.y-from_rect.y)/from_rect.h)*to_rect.h+to_rect.y;
  rect.w = (rect.w/from_rect.w)*to_rect.w;
  rect.h = (rect.h/from_rect.h)*to_rect.h;
  return rect;
}

var ptWithin = function(ptx, pty, x, y, w, h)
{
  return (ptx >= x && ptx <= x+w && pty >= y && pty <= y+h);
}
var ptWithinObj = function(ptx, pty, obj)
{
  return ptWithin(ptx, pty, obj.x, obj.y, obj.w, obj.h);
}
var objWithinObj = function(obja, objb)
{
  console.log("not done!");
  return false;
}
var ptNear = function(ptx, pty, x, y, r)
{
  var w2 = (ptx-x)*(ptx-x);
  var h2 = (pty-y)*(pty-y);
  var d2 = r*r;
  return w2+h2 < d2;
}

