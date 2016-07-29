# optimer.js

A lightweight and reliable library that allows you to do a whole lot more with timers

See the [Demo](http://htmlpreview.github.io/?https://github.com/chernj/optimer/blob/master/demo/demo.html) for an idea of what optimer can do

### Installation

Because the library is written following the UMD pattern it can be included both in the browser and on a server running NodeJS. To install using npm: 

`npm install optimer.js`

or download the dev or minified version from src and include it in your project

### Usage

Optimer requires at least one parameter to be passed in on initialization, either an `interval` or an `end` parameter. 

`var timer = new optimer({interval: 2000})`

By default the optimer object won't start the timer unless you specify it to, either by passing in `running: true` in the initialization or running `timer.play()`.

Here are the optional initialization parameters: 
  * callback - the callback function that will run when the timer reaches 0
  * args - arguments to pass in to the callback function
  * obj - lets you specify the specific context the callback function will be bound to when running
  * repeat - the amount of times to repeat the timer. Note that negative values run the timer indefinitely and that a repeat of 0 still runs the timer once
  * delay - will automatically start the timer after the amount specified

Once initialized, there are several optimer methods you can run:
  + `optimer.play()` - runs the timer if it is not currently running
  + `optimer.pause()` - pauses the timer if it is running
  + `optimer.reset(required:[ {}, bool ])` - completely stops the timer and sets parameters to the values specified in the first object parameter. The second value tells the timer to immediately begin playing again if `true`
  + `optimer.fire(optional:[ {}, bool ])` - the function that is called when the timer reaches 0, will fire the callback. This function can be called anytime to fire the callback immediately (Note: if `repeat` is more than 0, fire *will* consume a repeat). You may alter any optimer parameter before the callback fires by passing them into the first object parameter. The second parameter is used internally: when `true`, the calculation for determining when is the next time to fire will be based off of the current time, while `false` will base it off of the current *expected* interval end
  + `optimer.alter(either string || number or object)` - change any parameter at any point, even while the timer is running. If parameter is a string or number, then alter will modify the current interval based on the passed in value (For example: passing in `"50"` will add 50 milliseconds to the interval). If a string with a preceding 'n' is passed in then the numerical value after the character is the new interval value (For example: passing in `"n1000"` will set the interval to 1 second). As with the above, if you pass in an object with parameters matching those of the optimer object, alter will set the parameters to the new passed in values
  + `optimer.finish(optional:[ {} ])` - stops the timer and fires the callback one last time. The passed in object lets you set parameters before the callback fires

Note that even when stopping the timer using `reset()` and `finish()` you can always use `play()` to start the timer again *using whatever parameter values were present when the timer stopped*. If you would like to change them before playing use `alter()`.

Optimer also provides some simple utility functions:
  + `optimer.remaining()` - returns the time in milliseconds left of the current loop
  + `optimer.elapsed()` - returns the time in milliseconds since the timer was started. `finish()` sets the start value to null, so calling this function after the timer has stopped will return null

### Implementation

Trying to create a simple timer using `setTimeout()` or `setInterval()` [is often not a good idea](http://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout)
as they cannot be relied upon to accurately keep track of time. In order to work around this, a [proposed solution](https://www.sitepoint.com/creating-accurate-timers-in-javascript/) involves calculating
the error difference and re-adjusting the timer every set interval, usually around 100 or 1000 milliseconds.

While this solution is certainly effective, it is also inefficient. If we need an event to fire several seconds later, we would
end up re-calculating errors that occur many times over. Instead, optimer runs the timer for a majority of the way through and
lets error pile up. At the end of this majority-run optimer does the usual re-adjusting and checks to see if time remaining
has reached a small threshold. If not, optimer once again lets the timer run most of the way on the remainder, and so on until
the timer has hit the threshold, at which point it is safe to run the timer normally.

The end result is that optimer gets the same millisecond accuracy for a *fraction* of the calculation overhead.

