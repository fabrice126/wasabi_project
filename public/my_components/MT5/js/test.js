play = function(startTime) {
  buildGraph();

  sampleNodes.forEach(function(s) {
     // First parameter is the delay before playing the sample
     // second one is the offset in the song, in seconds, can be 2.3456
     // very high precision !
     s.start(0, startTime);
  });
  paused = false;
}
    
stop = function() {
  if(paused == true) return; // cannot stop more than once.
        
  sampleNodes.forEach(function(s) {
     // destroy the nodes
     s.stop(0);
     delete s; // mandatory otherwise not Garbage Collected
  });    
  paused = true;
}
    
pause = function() {
  if (!paused) {
    // if we were not paused, then we stop
    this.stop();
  } else {
    // else we start again from the previous position
    play(elapsedTimeSinceStart);
  }
}