/**
 * @author Paul Scott
 * @version 26 March 2019
 *
 * code that starts and resets convex hull algorithm
 */

class ConvexHull {

  /**
   * constructor
   */
  constructor() {
    this.points = []; // set of points
    this.stack = []; // stack
    this.delay = 1000; // animation delay
    this.finished = false;
    this.width = 600;
    this.currentPoint = null;
  }

  /**
   * compares point angles for sorting purposes
   * @param point1
   * @param point2
   * @returns {number}
   */
  static compare(point1, point2) {
    if (point1.angle < point2.angle) return -1;
    if (point1.angle > point2.angle) return 1;
    else return 0;
  }

  /**
   * run graham scan algorithm
   * @returns {Promise<void>}
   */
  async grahamScan() {
    document.getElementById("reset").style.display = "none";

    // creates random set of points
    this.generatePoints();

    // gets index of point with the smallest value
    // and sorts rest of points based on the cosine
    // angle between the smallest y value point
    this.getAngles(this.getMinY());

    // sorts points by angle
    this.points.sort(ConvexHull.compare);
    this.draw();
    await new Promise(resolve => setTimeout(resolve, this.delay));

    // pushes first three point indexes to stack
    this.stack.push(0);
    this.stack.push(1);
    this.draw();
    await new Promise(resolve => setTimeout(resolve, this.delay));
    this.stack.push(2);
    this.draw();
    await new Promise(resolve => setTimeout(resolve, this.delay));

    // loops through remaining points
    for (let i = 3; i < this.points.length; i++) {
      while (this.stack.length !== 0) {
        let p1 = this.stack[this.stack.length - 2];
        let p2 = this.stack[this.stack.length - 1];
        this.currentPoint = i;
        this.draw();
        await new Promise(resolve => setTimeout(resolve, this.delay));

        // calculates cross product of three points
        // pops stack if 'right turn'
        // pushes index to stack if 'left turn'
        if (ConvexHull.crossProduct(this.points[p1], this.points[p2], this.points[i]) < 0) {
          this.points[this.stack.pop()].inHull = false;
        } else {
          this.stack.push(i);
          break;
        }
      }
    }
    this.finished = true;
    this.draw();
    document.getElementById("reset").style.display = "block";
  }

  /**
   * calculates cross product of
   * vectors P1P2--> and P1P3-->
   * @param point1
   * @param point2
   * @param point3
   * @returns {number}
   */
  static crossProduct(point1, point2, point3) {

    // vector P1P2-->
    let vector1X = point2.x - point1.x;
    let vector1Y = point2.y - point1.y;

    // vector P1P3-->
    let vector2X = point3.x - point1.x;
    let vector2Y = point3.y - point1.y;

    // cross product
    return (vector1X * vector2Y) - (vector1Y * vector2X);
  }

  /**
   * creates random set of points
   */
  generatePoints() {
    let pointCount = Math.floor((Math.random() * 11)) + 10;
    for (let i = 0; i < pointCount; i++) {
      let x = Math.floor((Math.random() * (this.width - 99)));
      let y = Math.floor((Math.random() * (this.width - 99)));
      let point = new PointAngle(x, y, 0.0, true);
      this.points.push(point);
    }
  }

  /**
   * returns index of point with smallest y value
   * @returns number of point with lowest y value
   */
  getMinY() {
    let minIndex = null;
    for (let i = 0; i < this.points.length; i++) {
      if (minIndex == null || this.points[minIndex].y > this.points[i].y) {
        minIndex = i;
      }
    }
    return minIndex;
  }

  /**
   * calculates angles of all points based on
   * point with lowest y value
   * @param minIndex
   */
  getAngles(minIndex) {
    let scaleX = this.points[minIndex].x;
    let scaleY = this.points[minIndex].y;
    for (let i = 0; i < this.points.length; i++) {

      // adjusts x and y values so that minIndex point is (0,0)
      let adjustX = this.points[i].x - scaleX;
      let adjustY = this.points[i].y - scaleY;

      // calculates polar angle in radians
      let angle = Math.atan(adjustY / adjustX);
      if (!Number.isNaN(angle)) {
        if (angle < 0) angle += Math.PI;
        this.points[i].angle = angle;
      }
    }
  }

  /**
   * draw visualization
   */
  draw() {
    let canvas = document.getElementById("graham");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 600, 600);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // draw lines of convex hull
    for (let j = 1; j < this.stack.length; j++) {
      ctx.beginPath();
      ctx.strokeStyle = "#6483b7";
      if (this.currentPoint == null && j === this.stack.length - 1) ctx.strokeStyle = "#1058d1";
      let point1 = this.points[this.stack[j - 1]];
      let point2 = this.points[this.stack[j]];
      ctx.moveTo(point1.x + 50, (this.width - 50) - point1.y);
      ctx.lineTo(point2.x + 50, (this.width - 50) - point2.y);
      ctx.stroke();
    }

    // draws line connecting to current point being checked
    if (this.stack.length > 0 && this.currentPoint !== null && !this.finished) {
      ctx.beginPath();
      ctx.strokeStyle = "#1058d1";
      let point1 = this.points[this.stack[this.stack.length - 1]];
      let point2 = this.points[this.currentPoint];
      ctx.moveTo(point1.x + 50, (this.width - 50) - point1.y);
      ctx.lineTo(point2.x + 50, (this.width - 50) - point2.y);
      ctx.stroke();
    }

    // draw line that closes convex hull
    if (this.finished) {
      ctx.beginPath();
      let point1 = this.points[this.stack[0]];
      let point2 = this.points[this.stack[this.stack.length - 1]];
      ctx.moveTo(point1.x + 50, (this.width - 50) - point1.y);
      ctx.lineTo(point2.x + 50, (this.width - 50) - point2.y);
      ctx.stroke();
    }

    // draw points in set
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].inHull) ctx.fillStyle = "#FFF";
      else ctx.fillStyle = "#c5d2ea";
      ctx.beginPath();
      ctx.arc(this.points[i].x + 50, (this.width - 50) - this.points[i].y,
          5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(i.toString(), this.points[i].x + 60, (this.width - 50) - this.points[i].y);
    }
  }
}