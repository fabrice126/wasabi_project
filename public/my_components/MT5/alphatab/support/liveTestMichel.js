var settings = alphatab.Settings.defaults();
var currentScore = null;

// Michel Buffa
var startBar = 1;
var nbBarsToDisplay=10;
var currentScale = 0.8;
// end michel buffa


function openFile(bytes) {
    try {


        currentScore = alphatab.importer.ScoreLoader.loadScoreFromBytes(haxe.io.Bytes.ofData(new Uint8Array(bytes)));
    
      console.log("Rendering opened file")
      $('#alphaTab').alphaTab('renderer').render(currentScore.tracks[0]);
    }
    catch(e) {
        alert('Error opening the file');
        console.error(e);
    }
}

// Michel Buffa

function initSettings() {
      settings.engine = "html5";
      // hide song name, tuning etc.
      settings.layout.additionalSettings.set('hideInfo', true);
      // Only show 10 bars ar a time, start at bar 1
      startBar = 1;
      settings.scale = currentScale;

      // marche pas...
      settings.staves = new Array();
      settings.staves.push(new alphatab.StaveSettings('score'));
      //settings.staves.push(new alphatab.StaveSettings('rhythm-down'));
      settings.staves.push(new alphatab.StaveSettings('tab'));


      //settings.staves = ['tab', 'rhythm'];
      // We will not adjust automatically the width of the canvas
      settings.layout.additionalSettings.set('autoSize', false);
      settings.layout.additionalSettings.set('start', startBar);
      settings.layout.additionalSettings.set('count', nbBarsToDisplay);
      settings.layout.additionalSettings.set('barsPerRow', 4);
     
 }

function showBars(start, end, width, trackNumber) {
  settings.width = width;
  startBar = start;

  if(end === -1) {
    // show all bars
    nbBarsToDisplay = -1;
  } else {
    nbBarsToDisplay = end-start+1;
  }

   updateScoreDisplay(trackNumber);
}

// Try to open next bars
function showNextBars() {
  startBar+= nbBarsToDisplay;
  console.log("show next bars start = " + startBar);

  updateScoreDisplay();
}

// Michel Buffa
// Try to open next bars
function showPreviousBars() {
  startBar-= nbBarsToDisplay;
  console.log("show previous bars start = " + startBar);

  updateScoreDisplay();
}

function updateScoreDisplay(trackNumber) {
        settings.scale = currentScale;
        settings.layout.additionalSettings.set('start', startBar)
        settings.layout.additionalSettings.set('count', nbBarsToDisplay);
        if((trackNumber == undefined) || (trackNumber == NaN)) {
          $('#alphaTab').alphaTab('renderer').invalidate();
        } else {
          var trackToRender = $('#alphaTab').alphaTab('track').score.tracks[trackNumber];
          $('#alphaTab').alphaTab('renderer').render(trackToRender);
        }
}

// end Michel Buffa



function initializeTrackChooser() {
    var currentTrack = $('#alphaTab').alphaTab('track');
    var allTracks = currentTrack.score.tracks;

    var list = $('#trackList');
    list.empty();
    
    for(var i = 0; i < allTracks.length; i++) 
    {
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
           $('#alphaTab').alphaTab('renderer').render($(this).data('track'));
           $('#trackChooser').fadeOut();
        });
    }
}

 function loadFileAndDisplayScore(filename, startBar, nbBarsToDisplay, width) {
     // Load and renders the file in the data-file attribute of 
     // DOM elem id="alphatab"
     $('#alphaTab').data('file', filename); 

     //var a = document.querySelector("#alphaTab");
     //a.dataset.file = filename;
    $.alphaTab.restore('#alphaTab');

  /*    $('#alphaTab').alphaTab({
                staves: ['rhythm-down', 'tab'],
                layout: {
                  mode: 'page',
                  additionalSettings: {
                      barsPerRow: 5,
                      hideInfo: true
                  }
                }
            });
*/
      settings.width = width;
      settings.layout.additionalSettings.set('start', startBar)
        settings.layout.additionalSettings.set('count', nbBarsToDisplay);
      $('#alphaTab').alphaTab(settings);
      //showBars(1, 5, 600);
      $('#alphaTab').data('file', null); 
      //a.dataset.file = null;
    }


$(document).ready(function() {
 
   

         // Michel Buffa
      initSettings();
      // end Michel Buffa

    $('#alphaTab').on('loaded', function(e, score) {
      console.log("alphatab loaded event " + score)
        currentScore = score;
    });
   
   // Load and renders the file in the data-file attribute of 
   // DOM elem id="alphatab"
   // $('#alphaTab').alphaTab(settings);
   // $('#alphaTab').data('file', null); 

  var endsWith = function(s, suffix) {
        return s.indexOf(suffix, this.length - suffix.length) !== -1;
    };
   
    /* file reader */
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $('#openFileData').change(function(e) {
            var file = e.target.files[0];
            if(endsWith(file.name, "gp3") || endsWith(file.name, "gp4") || endsWith(file.name, "gp5") || endsWith(file.name, "gpx")) {
               
                var reader = new FileReader();
                reader.onload = function(e) {
                    openFile(e.target.result);
                };
                reader.readAsArrayBuffer(file)
           }
           else {
               alert('Please open a Guitar Pro 3-6 File');
           }
        });
    } 
    else {
      $('#openFile').hide();
    }
    


    /* Track Chooser */
    $('#alphatabTracks').click(function(e) {
      console.log("tracks button clicked")
     e.preventDefault(); initializeTrackChooser(); $('#trackChooser').fadeIn();
      });
    $('#trackChooser .shadow').click(function() { $('#trackChooser').fadeOut(); } );
    
});