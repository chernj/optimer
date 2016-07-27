(function() {
	window.onload = function() {
		var txt = document.getElementById('run');
		var more = document.getElementById('more');
		var editrun = document.getElementById('editrun');
		var slide = document.getElementById('increment');
		var slidelabel = document.getElementById('slideval');
		var format = function(val) {
			if (val < 0 || (!val && val != 0)) {
				more.textContent = " Running forever";
				editrun.textContent = "_";
			}
			else {
				let runs = more.textContent.split(" ");
				runs[1] = "more";
				runs[2] = "runs";
				if (val == 1) {
					runs[2] = "run";
				}
				more.textContent = runs.join(" ");
				editrun.textContent = val;
			}
			
		}
		var timer = new optimer({
			running: true,
			repeat: 10,
			interval: 500,
			callback: function() {
				let num = timer.elapsed();
				if (!num) {
					num = "-";
				}
				txt.innerText = num / 1000;
				format(timer.repeat);
			}
		});
		slide.addEventListener("input", function() {
			timer.alter({interval: slide.value});
			slidelabel.innerText = slide.value;
		});
		editrun.addEventListener("input", function(event, target) {
			let evtext = event.target.textContent.replace(/\_/g, '');
			format(+ evtext);
			timer.alter({repeat: + evtext});
		});
		document.getElementById('play').addEventListener('click', function() {
			timer.play();
		});
		document.getElementById('pause').addEventListener('click', function() {
			timer.pause();
		});
		document.getElementById('fire').addEventListener('click', function() {
			timer.fire();
		});
		document.getElementById('finish').addEventListener('click', function() {
			timer.finish();
		});
		document.getElementById('stop').addEventListener('click', function() {
			timer.reset({}, false);
		});
		document.getElementById('reset').addEventListener('click', function() {
			timer.reset({}, true);
		});
	}
})();