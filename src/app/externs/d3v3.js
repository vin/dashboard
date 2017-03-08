/**
 * @fileoverview Missing externs for d3 v3.
 * @externs
 */


/** @const */
d3.layout = {};


/**
 * @constructor
 */
d3.ForceSimulation = function() {};


/**
 * @param {number} c
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.charge = function(c) {};


/**
 * @param {number} d
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.chargeDistance = function(d) {};


/**
 * @param {number} d
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.distance = function(d) {};


/**
 * @param {number} g
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.gravity = function(g) {};


/**
 * @param {Array} ls
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.links = function(ls) {};


/**
 * @param {number} ls
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.linkStrength = function(ls) {};


/**
 * @param {Array} ns
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.nodes = function(ns) {};


/**
 * @param {Array.<number>} s
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.size = function(s) {};


/**
 * @return {d3.ForceSimulation}
 */
d3.ForceSimulation.prototype.start = function() {};


d3.ForceSimulation.prototype.drag = function() {};
d3.ForceSimulation.prototype.on = function(e, f) {};


/**
 * @return {!d3.ForceSimulation}
 */
d3.layout.force = function() {};

