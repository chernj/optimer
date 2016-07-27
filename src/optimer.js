// A performant, lightweight, accurate timer
/*
	-- Takes in: 
		- running (optional defaults to false, if set to true runs timer immediately)
		- delay (optional, if included the timer automatically starts when delay is done)
		- interval (required if 'end' isn't present)
		- end (requred if 'interval' isn't present)
		- repeat (optional, defaults to 0, which means it only runs once)
		- args (optional, arguments for the callback)
		- callback (optional, function that fires when timer hits 0)
		- obj (only required if callback requires the object context)
*/
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else if (typeof exports === 'object') {
		module.exports = factory();
	}
	else {
		root.optimer = factory();
	}
}(this, function() {
	'use strict'
	
	function optimer(params) {
		var now = new Date().getTime();
		
		this.__ = {
			start: now,
			params: null,
			threshold: 10,
			remain: null
		}
		this.clearTime;
		for (var property in params) {
			if (params.hasOwnProperty(property)) {
				this[property] = params[property];
			}
		}
		if (!("repeat" in this)) {
			this.repeat = 0;
		}
		if (!("interval" in this)) {
			this.interval = this.end - now;
		}
		if (!("end" in this)) {
			this.end = now + this.interval;
		}
		if (!("callback" in this)) {
			this.callback = function() {this.elapsed();};
		}
		this.__.start = now;
		if ("delay" in this) {
			if (this.delay > 0) {
				setTimeout(function() {
					this.running = true;
					this.delay = undefined;
					run.call(this);
				}, this.delay);
			}
			else {
				this.running = true;
				run.call(this);
			}
		}
		else {
			if (!("running" in this)) {
				this.running = false;
			}
			else {
				if (this.running) {
					run.call(this);
				}
			}
		}
	}
	optimer.prototype.play = function() {
		if (this.running) return this;
		if (this.__.remain) {
			this.end = new Date().getTime() + this.__.remain;
			this.__.remain = null;
		}
		else {
			this.end = new Date().getTime() + this.interval;
		}
		this.running = true;
		run.call(this);
	}
	optimer.prototype.pause = function() {
		if (!this.running) return this;
		clearTimeout(this.clearTime);
		this.__.remain = this.end - new Date().getTime();
		this.running = false;
	}
	optimer.prototype.reset = function(params, go) {
		this.running = false;
		if (params.length > 0) {
			this.__.params = params;
		}
		else {
			this.__.params = null;
		}
		init.call(this);
		if (go) {
			this.running = true;
			run.call(this);
		}
	}
	optimer.prototype.fire = function(params, verified) {
		for (var prop in params) {
			if (params.hasOwnProperty(prop)) {
				this[prop] = params[prop];
			}
		}
		if (this.repeat == 1 || this.repeat == 0) {
			this.finish(params);
		}
		else {
			if (verified) {
				this.end += this.interval;
			}
			else {
				this.end = new Date().getTime() + this.interval;
			}
			if (this.repeat > 0) {
				this.repeat -= 1;
			}
			if ("obj" in this) {
				if (this.args.length > 1) {
					this.callback.apply(this.obj, this.args);
				}
				else {
					this.callback.call(this.obj, this.args);
				}
			}
			else {
				this.callback(this.args);
			}
			clearTimeout(this.clearTime);
			if (this.running) {
				run.call(this);
			}
		}
		return this;
	}
	optimer.prototype.alter = function(params) {
		if (params === null) return this;
		var amount = null;
		if (typeof params === 'object') {
			for (var prop in params) {
				if (params.hasOwnProperty(prop)) {
					if (prop === 'interval') {
						amount = 'n' + params.interval.toString();
					}
					else if (prop === 'amount') {
						amount = params.amount;
					}
					else {
						this[prop] = params[prop];
					}
				}
			}
		}
		else if (typeof params === 'string' || typeof params === 'number') {
			amount = params;
		}
		if (amount) {
			if (typeof amount === 'string') {
				if (amount.startsWith('n')) {
					amount = amount.substring(1);
					amount -= this.interval;
				}
			}
			amount = + amount;
			if (amount == 0) return this;
			this.end += amount;
			this.interval += amount;
			if (this.running) {
				if (amount < 0) {
					clearTimeout(this.clearTime);
					run.call(this);
				}
			}
		}
		return this;
	}
	optimer.prototype.finish = function(params) {
		if (!this.running && !this.__.remain) return;
		this.running = false;
		this.__.remain = null;
		clearTimeout(this.clearTime);
		if (this.repeat > 0) {
			this.repeat -= 1;
		}
		if (arguments.length > 0) {
			for (var prop in params) {
				if (params.hasOwnProperty(prop)) {
					this[prop] = params[prop];
				}
			}
		}
		if ("obj" in this) {
			if (this.args.length > 1) {
				this.callback.apply(this.obj, this.args);
			}
			else {
				this.callback.call(this.obj, this.args);
			}
		}
		else {
			this.callback(this.args);
		}
		this.__.start = null;
	}
	optimer.prototype.remaining = function() {
		if (this.__.remain) {
			return this.__.remain;
		}
		return this.end - new Date().getTime();
	}
	optimer.prototype.elapsed = function() {
		if (!this.__.start) {
			return null;
		}
		return new Date().getTime() - this.__.start;
	}
	
	function init() {
		var now = new Date().getTime();
		if (this.__.params) {
			let params = this.__.params;
			for (var property in params) {
				if (params.hasOwnProperty(property)) {
					this[property] = params[property];
				}
			}
			if (!("end" in params)) {
				this.end = now + this.interval;
			}
			this.__.params = null;
		}
		else {
			this.end = now + this.interval;
		}
		clearTimeout(this.clearTime);
		this.__.start = null;
	}
	
	function run() {
		var self = this;
		if (!this.__.start) {
			this.__.start = new Date().getTime();
		}
		var setOffset = function() {
			let diff = self.end - new Date().getTime();
			if (diff > self.__.threshold) {
				diff *= 0.9;
			}
			return diff;
		}
		var loop = function(near) {
			if (near <= 0) {
				self.fire({}, true);
			}
			else {
				self.clearTime = setTimeout(function() {
					if (new Date().getTime() >= self.end) {
						self.clearTime = undefined;
						self.fire({}, true);
					}
					else {
						loop(setOffset());
					}
				}, near);
			}
		}
		loop(setOffset());
	}
	
	return optimer;
}));