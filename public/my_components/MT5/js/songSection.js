function SongSection(n, st, et, sb, eb, t) {
	this.name = n;
	this.startTime = st;
	this.endTime = et;
	this.startBar = sb;
	this.endBar = eb;
	this.duration = et - st;
	this.numberOfBars = eb - sb + 1;
	this.preferredTrack = t;

	this.findCurrentBar = function(currentTime) {
		var barDuration = this.duration / this.numberOfBars;
		var currentBar = this.startBar;

		for(var i = this.startTime; i < (this.startTime + this.duration); i+= barDuration) {
			if((currentTime > i) && (currentTime < i+barDuration)) {
				return currentBar;
			}
			currentBar++;
		}
	}
}