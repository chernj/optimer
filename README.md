# optimer

A lightweight and reliable library that allows you to do a whole lot more with timers

See the [Demo](http://htmlpreview.github.io/?https://github.com/chernj/optimer/blob/master/demo/demo.html) for an idea of what optimer can do

### Implementation

Trying to create a simple timer using `setTimeout()` or `setInterval()` [is often not a good idea](http://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout)
as they cannot be relied upon to accurately keep track of time. In order to work around this, a [proposed solution](https://www.sitepoint.com/creating-accurate-timers-in-javascript/) involves adjusting
for the error difference and re-adjusting the timer every set interval, usually around 100 or 1000 milliseconds.

While this solution is certainly effective, it can also be inefficient. If we need an event to fire several seconds later, we would
end up re-calculating errors that occur many times over. Instead, optimer runs the timer for a majority of the way through and
lets error pile up. At the end of this majority-run optimer does the usual re-adjusting and checks to see if time remaining
has reached a small threshold. If not, optimer once again lets the timer run most of the way on the remainder, and so on until
the timer has hit the threshold, at which point it is safe to run the timer normally.

The end result is that optimer gets the same millisecond accuracy for a *fraction* of the calculation overhead.

