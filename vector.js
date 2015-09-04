window.addEventListener("load", function() { var vec = new Vector(); }, false);

var Vector = function()
{
  var self = this;

  var c = new Canv();
  var ca = c.canvas;
  var cx = c.context;
  self.canv = c;
  document.getElementById("vector").appendChild(c.canvas);

  cx.strokeRect(10,10,10,10);
}

