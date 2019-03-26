/**
 * @author Paul Scott
 * @version 26 March 2019
 *
 * code that starts and resets graham scan algorithm
 */

/**
 * start convex hull
 */
$(document).ready(function () {
  let ch = new ConvexHull();
  let canvas = document.getElementById("graham");
  canvas.width = 1200;
  canvas.height = 1200;
  canvas.getContext("2d").scale(2, 2);
  canvas.getContext("2d").font = "24px Arial";
  // noinspection JSIgnoredPromiseFromCall
  ch.grahamScan();
});

/**
 * reset convex hull
 */
function reset() {
  let ch = new ConvexHull();
  // noinspection JSIgnoredPromiseFromCall
  ch.grahamScan();
}