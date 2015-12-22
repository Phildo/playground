var WaveScene = function(space, stage)
{
  var self = this;
  var c = stage.drawCanv;
  var ca = c.canvas;
  var cx = c.context;

  var n_samples = 100;
  var pos;
  var vel;

  self.ready = function()
  {
    pos = [];
    vel = [];

    for(var i = 0; i < n_samples; i++)
    {
      pos[i] = Math.sin(i/10)*10;
      vel[i] = 0;
    }
  };

  self.tick = function()
  {
    for(var i = 0; i < n_samples; i++)
      vel[i] += (pos[(i-1+n_samples)%n_samples]+pos[(i+1)%n_samples])/2 - pos[i];
    for(var i = 0; i < n_samples; i++)
      pos[i] += vel[i];
  };

  self.draw = function()
  {
    cx.fillStyle = "#FFFFFF";
    cx.fillRect(0,0,ca.width,ca.height);

    cx.strokeStyle = "#555555";
    cx.lineWidth = 1;

    cx.beginPath();
    cx.moveTo(0,ca.height/2-pos[0]);
    for(var i = 1; i < n_samples; i++)
      cx.lineTo(i/(n_samples-1) * ca.width, ca.height/2-pos[i]);
    cx.stroke();
  };

  self.cleanup = function()
  {
  };

};

