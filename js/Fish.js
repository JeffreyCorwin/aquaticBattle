class Fish {
  constructor(x, y, width, height, fishePos, fishAnimation) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
      label: "fish"
    };
    this.animation = fishAnimation;
    this.speed = 0.05;
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;

    this.fishePosition = fishePos;
    this.isBroken = false;

    World.add(world, this.body);
  }
  animate() {
    this.speed += 0.05 % 1.1;
  }

  remove(index) {
    this.animation = brokenfishAnimation;
    this.speed = 0.05;
    this.width = 200;
    this.height = 200;
    this.isBroken = true;
    setTimeout(() => {
      Matter.World.remove(world, fishs[index].body);
      fishs.splice(index, 1);
    }, 2000);
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.fishePosition, this.width, this.height);
    noTint();
    pop();
  }
}
