class Metaball {
    constructor(x, y, maxRadius, maxProgress, normProgress = 0) {
        this.pos = createVector(x, y);

        this.speed =
            Math.random() *
                (METABALL_SPEED_RANGE[1] - METABALL_SPEED_RANGE[0]) +
            METABALL_SPEED_RANGE[0];
        this.vel = p5.Vector.random2D().mult(this.speed);

        this.maxProgress = maxProgress;
        this.progress = Math.floor(normProgress * maxProgress);

        this.maxRadius = maxRadius;
        this.radius = Math.random() * maxRadius;

        this.colorLerpProgress = 0;

        this.toColorId = Math.floor(Math.random() * METABALL_COLORS.length);
        this.color = color(METABALL_COLORS[this.toColorId]);
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    update() {
        // this.updateColor();
        this.updateSize();
        this.updatePos();

        this.progress = (this.progress + 1) % this.maxProgress;
    }

    //--------------------------------------------------------------//

    updateColor() {
        if (this.colorLerpProgress == 0) {
            this.fromColorId = this.toColorId;

            this.toColorId =
                Math.random() >= 0.5
                    ? (this.fromColorId + 1) % METABALL_COLORS.length
                    : (this.fromColorId - 1 + METABALL_COLORS.length) %
                      METABALL_COLORS.length;

            this.colorLerpSpeed = Math.floor(
                METABALL_COLOR_LERP_SPEED[0] +
                    Math.random() *
                        Math.abs(
                            METABALL_COLOR_LERP_SPEED[1] -
                                METABALL_COLOR_LERP_SPEED[0]
                        )
            );
        }

        this.color = lerpColor(
            color(METABALL_COLORS[this.fromColorId]),
            color(METABALL_COLORS[this.toColorId]),

            Math.sin(
                map(
                    this.colorLerpProgress,
                    0,
                    this.colorLerpSpeed,
                    0,
                    Math.PI / 2
                )
            )
        );

        this.colorLerpProgress =
            (this.colorLerpProgress + 1) % this.colorLerpSpeed;
    }

    //--------------------------------------------------------------//

    updateSize() {
        this.radius = this.isDead()
            ? 0
            : map(
                  Math.sin(map(this.progress, 0, this.maxProgress, 0, Math.PI)),

                  0,
                  1,

                  this.maxRadius * 0.5,
                  this.maxRadius
              );
    }

    //--------------------------------------------------------------//

    updatePos() {
        this.pos.add(this.vel);

        if (this.pos.x < 0 || this.pos.x > WIDTH) this.vel.x *= -1;

        if (this.pos.y < 0 || this.pos.y > WIDTH) this.vel.y *= -1;
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    isDead() {
        return this.progress > this.maxProgress;
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    display() {
        fill(this.color);
        stroke(255);
        ellipseMode(CENTER);

        ellipse(
            this.pos.x,
            HEIGHT - this.pos.y,
            this.radius / 100,
            this.radius / 100
        );
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    getNormColor() {
        return this.color._array.slice(0, 3);
    }
}
