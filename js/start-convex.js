/**
 * @author Paul Scott
 * @version 25 January 2019
 *
 * code that starts and resets graham scan algorithm
 */

/**
 * start convex hull
 */
$(document).ready(function () {
  let ch = new ConvexHull();
  let canvas = document.getElementById("convex");
  canvas.width = 1200;
  canvas.height = 1200;
  canvas.getContext("2d").scale(2, 2);
  canvas.getContext("2d").font = "24px Arial";
  ch.convexHull();
});

/**
 * reset convex hull
 */
function reset() {
  let ch = new ConvexHull();
  ch.convexHull();
}