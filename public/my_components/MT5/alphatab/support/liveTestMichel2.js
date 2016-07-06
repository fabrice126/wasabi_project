function ScoreRenderer(containerId) {
  // Id of the HTML element that will contain the score rendering canvas
  this.containerId = containerId;
  // The element that will contain the score rendering canvas
  this.container = $("#" + containerId);

  this.settings = alphatab.Settings.defaults();
  this.currentScore = null;

  // Michel Buffa
  this.startBar = 1;
  this.nbBarsToDisplay=10;
  this.currentScale = 0.8;
  // end michel buffa


  this.openFile = function(bytes) {
    try {
      this.currentScore = alphatab.importer.ScoreLoader.loadScoreFromBytes(haxe.io.Bytes.ofData(new Uint8Array(bytes)));
    
      console.log("Rendering opened file")
      this.container.alphaTab('renderer').render(this.currentScore.tracks[0]);
    } catch(e) {
        alert('Error opening the file');
        console.error(e);
    }
  }

  // Michel Buffa

  this.initSettings = function() {
    this.settings.engine = "html5";
    // hide song name, tuning etc.
    this.settings.layout.additionalSettings.set('hideInfo', true);
    // Only show 10 bars ar a time, start at bar 1
    this.startBar = 1;
    this.settings.scale = this.currentScale;

    // marche pas...
    this.settings.staves = new Array();
    this.settings.staves.push(new alphatab.StaveSettings('score'));
    //settings.staves.push(new alphatab.StaveSettings('rhythm-down'));
    this.settings.staves.push(new alphatab.StaveSettings('tab'));

    //settings.staves = ['tab', 'rhythm'];
    // We will not adjust automatically the width of the canvas
    this.settings.layout.additionalSettings.set('autoSize', false);
    this.settings.layout.additionalSettings.set('start', this.startBar);
    this.settings.layout.additionalSettings.set('count', this.nbBarsToDisplay);
    this.settings.layout.additionalSettings.set('barsPerRow', 4);
  }

  this.showBars = function(start, end, width, trackNumber) {
    this.settings.width = width;
    this.startBar = start;

    if(end === -1) {
      // show all bars
      this.nbBarsToDisplay = -1;
    } else {
      this.nbBarsToDisplay = end-start+1;
    }

    this.updateScoreDisplay(trackNumber);
  }

  // Try to open next bars
  this.showNextBars = function() {
    this.startBar+= this.nbBarsToDisplay;
    console.log("show next bars start = " + startBar);

    this.updateScoreDisplay();
  }

  // Michel Buffa
  // Try to open next bars
  this.showPreviousBars = function() {
    this.startBar-= this.nbBarsToDisplay;
    console.log("show previous bars start = " + this.startBar);

    this.updateScoreDisplay();
  }

  this.updateScoreDisplay = function(trackNumber) {
    this.settings.scale = this.currentScale;
    this.settings.layout.additionalSettings.set('start', this.startBar)
    this.settings.layout.additionalSettings.set('count', this.nbBarsToDisplay);
    if((trackNumber == undefined) || (trackNumber == NaN)) {
      this.container.alphaTab('renderer').invalidate();
    } else {
      var trackToRender = this.container.alphaTab('track').score.tracks[trackNumber];
      this.container.alphaTab('renderer').render(trackToRender);
    }
  }
  // end Michel Buffa

  this.initializeTrackChooser = function() {
    var currentTrack = this.container.alphaTab('track');
    var allTracks = currentTrack.score.tracks;

    var list = $('#trackList');
    list.empty();
    
    for(var i = 0; i < allTracks.length; i++) {
      var track = allTracks[i];
      var li = $('<li></li>');
      list.append(li);
      if(track == currentTrack) li.addClass('active');
      
      var a = $('<a></a>');
      li.append(a);
      a.attr('href', '#');
      a.text(track.name);
      a.data('track', track);
      a.click(function(e) {
         e.preventDefault();
         this.container.alphaTab('renderer').render($(this).data('track'));
         $('#trackChooser').fadeOut();
      });
    }
  }

  this.loadFileAndDisplayScore = function(filename, startBar, nbBarsToDisplay, width) {
    // Load and renders the file in the data-file attribute of 
    // DOM elem id="alphatab"
    this.container.data('file', filename); 

    $.alphaTab.restore('#' + this.containerId);

    this.settings.width = width;
    this.settings.layout.additionalSettings.set('start', this.startBar)
    this.settings.layout.additionalSettings.set('count', this.nbBarsToDisplay);
    this.container.alphaTab(this.settings);
    //showBars(1, 5, 600);
    this.container.data('file', null); 
    //a.dataset.file = null;
  }

  // Call this after the page is loaded
  this.init = function(currentScale) {
    this.currentScale = currentScale;
    // Michel Buffa
    this.initSettings();
    // end Michel Buffa

    this.container.on('loaded', function(e, score) {
      console.log("alphatab loaded event " + score)
      this.currentScore = score;
    });
    
    /* file reader */
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      $('#openFileData').change(function(e) {
        var file = e.target.files[0];
        if(endsWith(file.name, "gp3") || 
            endsWith(file.name, "gp4") || 
            endsWith(file.name, "gp5") || 
            endsWith(file.name, "gpx")) {  

          var reader = new FileReader();

          reader.onload = function(e) {
              openFile(e.target.result);
          };

          reader.readAsArrayBuffer(file)
        } else {
          alert('Please open a Guitar Pro 3-6 File');
        }
      });
    } else {
      $('#openFile').hide();
    }
    
    /* Track Chooser */
    $('#alphatabTracks').click(function(e) {
      console.log("tracks button clicked")
      e.preventDefault(); initializeTrackChooser(); $('#trackChooser').fadeIn();
    });

    $('#trackChooser .shadow').click(function() { 
      $('#trackChooser').fadeOut(); 
    });    
  };
};

var endsWith = function(s, suffix) {
  return s.indexOf(suffix, this.length - suffix.length) !== -1;
};