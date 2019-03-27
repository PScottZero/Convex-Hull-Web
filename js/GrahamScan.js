/**
 * @author Paul Scott
 * @version 27 March 2019
 *
 * code that starts and resets convex hull algorithm
 */

// constants
const X = 0; // x value
const Y = 1; // y value
const ANG = 2; // angle
const INC = 3; // in convex (boolean)

class ConvexHull {

  /**
   * constructor
   */
  constructor() {
    this.points = []; // set of points
    this.stack = []; // stack
    this.delay = 1000; // animation delay
    this.width = 600; // canvas width
    this.finished = false; // finished status
    this.currentPoint = null; // current point being checked
  }

  /**
   * run graham scan algorithm
   * @returns {Promise<void>}
   */
  async grahamScan() {

    // hide reset button
    document.getElementById("reset").style.display = "none";

    // creates random set of points
    this.generatePoints();

    // gets index of point with the smallest value
    // and sorts rest of points based on the cosine
    // angle between the smallest y value point
    this.getAngles(this.getMinY());

    // sorts points by angle
    this.points.sort(ConvexHull.compare);
    await this.drawAndWait();

    // pushes first three point indexes to stack
    this.stack.push(this.points[0]);
    this.stack.push(this.points[1]);
    await this.drawAndWait();
    this.stack.push(this.points[2]);
    await this.drawAndWait();

    // loops through remaining points
    for (let i = 3; i < this.points.length; i++) {
      while (this.stack.length !== 0) {
        let p1 = this.stack[this.stack.length - 2];
        let p2 = this.stack[this.stack.length - 1];
        this.currentPoint = this.points[i];
        await this.drawAndWait();

        // calculates cross product of three points
        // pops stack if 'right turn'
        // pushes index to stack if 'left turn'
        if (ConvexHull.crossProduct(p1, p2, this.currentPoint) < 0) {
          this.stack.pop()[INC] = false;
        } else {
          this.stack.push(this.points[i]);
          break;
        }
      }
    }
    this.finished = true;
    this.draw();

    // make reset button visible
    document.getElementById("reset").style.display = "block";
  }

  /**
   * creates random set of points
   */
  generatePoints() {
    let pointCount = Math.floor((Math.random() * 11)) + 10;
    for (let i = 0; i < pointCount; i++) {
      let x = Math.floor((Math.random() * (this.width - 99)));
      let y = Math.floor((Math.random() * (this.width - 99)));
      this.points.push([x, y, 0.0, true]);
    }
  }

  /**
   * calculates cross product of
   * vectors P1->P2 and P1->P3
   * @param p1 - point 1
   * @param p2 - point 2
   * @param p3 - point 3
   * @returns {number} - cross product
   */
  static crossProduct(p1, p2, p3) {

    // vector P1->P2 (A) and vector P1->P3 (B)
    let vectorA = [p2[0] - p1[0], p2[1] - p1[1]];
    let vectorB = [p3[0] - p1[0], p3[1] - p1[1]];

    // cross product
    return (vectorA[0] * vectorB[1]) - (vectorA[1] * vectorB[0]);
  }

  /**
   * compare angles of points p1 and p2
   * @param p1 - point 1
   * @param p2 - point 2
   * @returns {number}
   */
  static compare(p1, p2) {
    if (p1[ANG] < p2[ANG]) return -1;
    if (p1[ANG] > p2[ANG]) return 1;
    else return 0;
  }

  /**
   * returns index of point with smallest y value
   * @returns minimum point
   */
  getMinY() {
    let min = null;
    for (let i = 0; i < this.points.length; i++) {
      if (min == null || min[Y] > this.points[i][Y]) {
        min = this.points[i];
      }
    }
    return min.slice();
  }

  /**
   * calculates angles of all points based on
   * point with lowest y value
   * @param min - minimum point
   */
  getAngles(min) {
    for (let i = 0; i < this.points.length; i++) {

      if (this.points[i][X] !== min[X] || this.points[i][Y] !== min[Y]) {

        // adjusts x and y values so that minIndex point is (0,0)
        let adjustX = this.points[i][X] - min[X];
        let adjustY = this.points[i][Y] - min[Y];

        // calculates polar angle in radians
        let angle = Math.atan(adjustY / adjustX);

        // adjust angle calculation
        if (Number.isNaN(angle))
          angle = Math.PI / 2;
        else if (angle < 0)
          angle += Math.PI;

        // set angle
        this.points[i][ANG] = angle;
      }
    }
  }

  /**
   * update animation and wait
   * @returns {Promise<void>}
   */
  async drawAndWait() {
    this.draw();
    await new Promise(resolve => setTimeout(resolve, this.delay));
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
      ctx.strokeStyle = "#6483b7";
      if (this.currentPoint == null && j === this.stack.length - 1)
        ctx.strokeStyle = "#1058d1";
      let p1 = this.stack[j - 1];
      let p2 = this.stack[j];
      this.drawLine(ctx, p1, p2);
    }

    // draws line connecting to current point being checked
    if (this.stack.length > 0 && this.currentPoint !== null && !this.finished) {
      ctx.strokeStyle = "#1058d1";
      let p1 = this.stack[this.stack.length - 1];
      let p2 = this.currentPoint;
      this.drawLine(ctx, p1, p2);
    }

    // draw line that closes convex hull
    if (this.finished) {
      let p1 = this.stack[0];
      let p2 = this.stack[this.stack.length - 1];
      this.drawLine(ctx, p1, p2);
    }

    // draw points in set
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i][INC]) ctx.fillStyle = "#FFF";
      else ctx.fillStyle = "#c5d2ea";
      ctx.beginPath();
      ctx.arc(this.points[i][X] + 50, (this.width - 50) - this.points[i][Y],
          5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(i.toString(), this.points[i][X] + 60, (this.width - 50) - this.points[i][Y]);
    }
  }

  /**
   * draw line from point 1 to point 2
   * @param ctx - canvas context
   * @param p1 - point 1
   * @param p2 - point 2
   */
  drawLine(ctx, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1[X] + 50, (this.width - 50) - p1[Y]);
    ctx.lineTo(p2[X] + 50, (this.width - 50) - p2[Y]);
    ctx.stroke();
  }
}