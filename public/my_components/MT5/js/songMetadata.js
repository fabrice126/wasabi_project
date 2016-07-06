function SongMetadata() {
	// list of sections, a section is intro, verse, etc. and is defined
	// by a name, a starting and a stopping time, and starting and stopping
	// bars in the guitar pro music sheet
	this.sections = [];
	this.videoSections = [];
	this.tabFileName = null;

	this.makeTestSongMetadata = function() {
		// name, startTime, stopTime, StartBar, StopBar
		this.sections.push(new SongSection("Intro", 3.8, 11, 1, 4));
		this.sections.push(new SongSection("Mini Solo",11, 18.2, 5, 8));
		this.sections.push(new SongSection("Verse2",18.2, 33, 9, 16));
		this.sections.push(new SongSection("Chorus1",33, 47, 17, 24));

		this.videoSections.push(new SongSection("Intro", 15, 50, 1, 4, 0));
		this.videoSections.push(new SongSection("Intro D chord", 50, 66, 1, 1, 0));
		this.videoSections.push(new SongSection("Intro E barre chord", 66, 89, 2, 2, 0));

		// last optional parameter is "preferred track to render"
		// Here we render the solo track of the test track SameOldSongAndDance
		this.videoSections.push(new SongSection("Mini Solo",89, 191, 5, 8, 1));
		this.videoSections.push(new SongSection("Verse2",191, 254, 9, 16, 0));
		this.videoSections.push(new SongSection("Chorus1",254, 345, 17, 24, 0));

	}

	this.setMetadata = function(data) {
		if(data !== undefined) {
			// Puts score sections in this.sections
			this.setSections(data.sections, this.sections);
			// Puts video sections in this.videoSections
			this.setSections(data.videoSections, this.videoSections);

			this.tabFileName = data.tabFileName;
		}
	}

	// generic functions to set score sections or video sections to the right
	// property
	this.setSections = function(sections, container) {
		for(var i=0; i < sections.length; i++) {
			var s = sections[i]
			var section = new SongSection(s.name, s.startTime, s.endTime, s.startBar, s.endBar, s.preferredTrack);
			container.push(section);
		}

	}

	// Gets the currentTime and returns the index of the section
	this.findSection = function(sections, currentTime) {
		// currentTime in ms

		// find the bars to display and current section
		var i;
		for(i=0; i < sections.length; i++) {
			var s = sections[i];
			if((currentTime >= s.startTime) && (currentTime < s.endTime)) {
				/*console.log("currentTime : " + currentTime + "section no " + i + " nom: " +
					s.name + " s.st : " + s.startTime + " s.et : " + s.endTime
					+ " sb : " + s.startBar + " s.eb : " + s.endBar);*/
				return sections[i];
			}
		}
	}

	// Returns the score section of the song that corresponds to the song time
	this.findScoreSection = function(currentTime) {
		return this.findSection(this.sections, currentTime);
	}

	// Returns the video section of the song that corresponds to the video time
	this.findVideoSection = function(currentTime) {
		return this.findSection(this.videoSections, currentTime);
	}

	this.checkIfEnteredNextSection = function(currentTime, indexOfCurrentSection) {
		var next = indexOfCurrentSection++;
		var nextS = this.sections[next];

		if(currentTime >= this.sections[indexOfCurrentSection]) {
			indexOfCurrentSection++;
			var s = this.sections[indexOfCurrentSection];
			/*
			console.log("Reached next section during play");
			console.log("currentTime : " + currentTime + "section " +
				s.name + " s.st : " + s.startTime + " s.et : " + s.endTime
				+ " sb : " + s.startBar + " s.eb : " + s.endBar);
*/
			return i;
		}
	}
	
}