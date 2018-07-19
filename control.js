"use strict";
(function() {
	
	function $(id) { return document.getElementById(id); }
	function qs(key) { return document.querySelector(key); }
	function qsa(key) { return document.querySelector(key); }
	function tag(tag) { return document.getElementsByTagName(tag); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	let data = undefined;
	let anthem = undefined;
	let timer = undefined;
	
	window.addEventListener("load", function() {
		ajaxGET("default_info.json", loadData);
		$("control").onclick = play;
		$("next").onclick = next;
		$("back").onclick = back;
		document.addEventListener("keydown", key);
	});
	
	function loadData(json) {
		data = JSON.parse(json);
		refresh();
		show($("control"));
	}
	
	function pause() {
		hide($("info"));
		hide($("next"));
		hide($("back"));
		clearInterval(timer);
		this.textContent = "Play";
		this.onclick = play;
	}
	
	function play() {
		show($("info"));
		show($("next"));
		show($("back"));
		timer = setInterval(updateTime, data.MEASURED_TIME_INTERVAL);
		this.textContent = "Pause";
		this.onclick = pause;
	}
	
	function refresh() {
		$("title").textContent = data.countries[data.current.index].name;
		$("flag").src = data.countries[data.current.index].flag;
		if (anthem) anthem.pause();
		anthem = new Audio(data.countries[data.current.index].anthem);
		anthem.loop = true;
		anthem.play();
		resetTime();
	}
	
	function next() {
		data.current.index = wrap(data.current.index + 1, 0, data.countries.length - 1);
		refresh();
 	}
	
	function back() {
		data.current.index = wrap(data.current.index - 1, 0, data.countries.length - 1);
		refresh();
 	}
	
	function key(event) {
		if (event.keyCode == 32) next();
		else if (event.keyCode == 13) back();
	}
	
	function resetTime() {
		data.current.time = 0;
		printTime();
	}
	
	function updateTime() {
		data.current.time += data.MEASURED_TIME_INTERVAL;
		data.countries[data.current.index].elapsed_time += data.MEASURED_TIME_INTERVAL;
		printTime();
	}
	
	function printTime() {
		$("currentTime").textContent = timeString(data.current.time);
		$("totalTime").textContent = timeString(data.countries[data.current.index].elapsed_time);
	}
	
	function timeString(time) {
		let result = "";
		time = Math.floor(time);
		let seconds = 	Math.floor(time / 1000) % 60;
		let minutes = 	Math.floor(time / 1000 / 60) % 60;
		let hours = 	Math.floor(time / 1000 / 60 / 60);
		if (hours) result += hours + ":";
		result += (minutes < 10 ? "0" : "") + minutes + ":";
		result += (seconds < 10 ? "0" : "") + seconds;
		return result;
	}
	
})();