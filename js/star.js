class star {
    constructor(x, y, width, height) {
      var options = {
        isStatic:true,
        };
      this.Image = loadImage("./assets/ball.png");
      this.width = width;
      this.height = height;
      this.body = Bodies.rectangle(x, y, this.width, this.height, options);
      World.add(world, this.body);
    }


    display() {
      var pos = this.body.position;
      var angle = this.body.angle;
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      //rectMode(CENTER);
      //rect(0, 0, this.width, this.height);
      image(this.Image, 0, 0, this.width, this.height);
      pop();
    }
  }
  