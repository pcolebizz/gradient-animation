
	
		var updateGradient;
	
		/*  Gradient Animation  */
		function gradient(targetDiv, CurrStartColor, CurrStopColor, startColor, stopColor, isInterval)
		{
			
			// shim layer with setTimeout fallback
			window.requestAnimFrame = (function(){
			  return  window.requestAnimationFrame       ||
			          window.webkitRequestAnimationFrame ||
			          window.mozRequestAnimationFrame    ||
			          function( callback ){
			            window.setTimeout(callback, 1000 / 60);
			          };
			})();
			
			// target to give background to
			var $div = document.getElementById(targetDiv);
			// rgb vals of the gradients
			var gradients = [];
			var change = 0;
			var intervalCount = 0;
			var maxIntervals = 10;
			var isStopped = false;
			// how long for each transition
			var transition_time = 2;
			// how many frames per second
			var fps = 60;
			// interal type vars
			var timer; // for the setInterval
			var interval_time = Math.round(1000/fps); // how often to interval
			var currentIndex = 0; // where we are in the gradients array
			var nextIndex = 1; // what index of the gradients array is next
			var steps_count = 0; // steps counter
			var steps_total = Math.round(transition_time*fps); // total amount of steps
			var rgb_steps = {
			  start: [0,0,0,0],
			  stop: [0,0,0,0]
			}; 
			// how much to alter each rgb value
			var rgb_values = {
			  start: [0,0,0,0],
			  stop: [0,0,0,0]
			}; // the current rgb values, gets altered by rgb steps on each interval
			var prefixes = ["-webkit-","-moz-","-o-","-ms-",""]; // for looping through adding styles
			var div_style = $div.style; // short cut to actually adding styles
			var gradients_tested = false;
			var color1, color2;
			var animationTime = 120 * maxIntervals;
					
			
			gradients = [
				{ start: CurrStartColor, stop: CurrStopColor },
				{ start: startColor, stop: stopColor },
				{ start: stopColor, stop: startColor },
				{ start: CurrStopColor, stop: CurrStartColor }
			];
			
			setNewColors = function(startColor, stopColor){
				transStartColor = startColor;
				transStopColor = stopColor;			
				change = 1;				
				console.log("change: " + change);
				
				if(isStopped == true){
					intervalCount = 0;
					timer = requestAnimFrame(updateGradient);
					isStopped = false;
				}
			}
			


			// sets next current and next index of gradients array
			function set_next(num) {
			  return (num + 1 < gradients.length) ? num + 1 : 0;
			}
			
			// sets next current and next index of gradients array
			function set_transfer_index(num, i) {
			  return (num + i < gradients.length) ? num + 1 : 0;
			}

			// work out how big each rgb step is
			function calc_step_size(a,b) {
			  return (a - b) / steps_total;
			}

			// populate the rgb_values and rgb_steps objects
			function calc_steps() {
			  for (var key in rgb_values) {
			    if (rgb_values.hasOwnProperty(key)) {
			      for(var i = 0; i < 4; i++) {
			        rgb_values[key][i] = gradients[currentIndex][key][i];
			        rgb_steps[key][i] = calc_step_size(gradients[nextIndex][key][i],rgb_values[key][i]);
			      }
			    }
			  }
			}

			// update current rgb vals, update DOM element with new CSS background
			updateGradient = function(direction, isScrolling)
			{
				
				console.log("step count: " +  steps_count);
				console.log("currentIndex: " + currentIndex);

				timer = requestAnimFrame(updateGradient);
				
				  // update the current rgb vals
				  for (var key in rgb_values) {
				    if (rgb_values.hasOwnProperty(key)) {
				      for(var i = 0; i < 4; i++) {
				        rgb_values[key][i] += rgb_steps[key][i];
				      }
				    }
				  }

				  // generate CSS rgb values
				  var t_color1 = "rgba("+(rgb_values.start[0] | 0)+","+(rgb_values.start[1] | 0)+","+(rgb_values.start[2] | 0)+","+(rgb_values.start[3].toFixed(2))+")";
				  var t_color2 = "rgba("+(rgb_values.stop[0] | 0)+","+(rgb_values.stop[1] | 0)+","+(rgb_values.stop[2] | 0)+","+(rgb_values.stop[3].toFixed(2))+")";

				  // has anything changed on this interation
				  if (t_color1 != color1 || t_color2 != color2) {

				    // update cols strings
				    color1 = t_color1;
				    color2 = t_color2;

				    // update DOM element style attribute
				    div_style.backgroundImage = "-webkit-gradient(linear, left bottom, right top, from("+color1+"), to("+color2+"))";
				    for (var i = 0; i < 3; i++) {
				      div_style.backgroundImage = prefixes[i]+"linear-gradient(45deg, "+color1+", "+color2+")";
				    }
				  }

				  // test if the browser can do CSS gradients
				  if (div_style.backgroundImage.indexOf("gradient") == -1 && !gradients_tested) {
				    // if not, kill the timer
				    //clearTimeout(timer);
					cancelAnimationFrame(timer);
				  }
				  gradients_tested = true;

		  		  steps_count++;
				  intervalCount++;
			    
				  // did we do too many steps?
				  if (steps_count > steps_total) {
				    // reset steps count
				    steps_count = 0;

					//clearTimeout(timer);
					currentIndex = set_next(currentIndex);
					nextIndex = set_next(nextIndex);
					
					if(intervalCount >= animationTime){
						cancelAnimationFrame(timer);
						isStopped = true;
					}
					
				
					if(change == 1){
						//console.log("++++++++++ New Color 1 +++++++++++++");
						gradients[set_transfer_index(currentIndex,1)] = { start: transStartColor, stop: transStopColor };
						gradients[set_transfer_index(currentIndex,2)] = { start: transStartColor, stop: transStopColor };
						gradients[set_transfer_index(currentIndex,3)] = { start: transStopColor, stop: transStartColor };
						gradients[set_transfer_index(currentIndex,4)] = { start: transStopColor, stop: transStartColor };
	
					}

				    // calc steps
				    calc_steps();
				  }		  
			}

			// initial step calc
			calc_steps();
			requestAnimFrame(updateGradient);
		}
	
		/*  End Gradient Animation  */