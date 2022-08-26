class Butterfly {
    constructor() {
        this.lerpProgress = 0;

        this.fromShapeVariety;
        this.toShapeVariety = Math.floor(Math.random() * SHAPE_VARIETY_COUNT);

        const LEFT = 0;
        const RIGHT = 1;

        BACKGROUND_COLOR = BACKGROUND_COLOR;

        this.metaballs = [];

        this.hindwingVertices = [];
        this.hindwingTexture = createGraphics(WIDTH, HEIGHT, WEBGL);
        this.hindwingTexture.noStroke();
        this.hindwingTexture.shader(hindwingMetaballShader);
        this.hindwingMask = createGraphics(WIDTH, HEIGHT);
        this.hindwingImg = createImage(WIDTH, HEIGHT);

        this.forewingVertices = [];
        this.forewingTexture = createGraphics(WIDTH, HEIGHT, WEBGL);
        this.forewingTexture.noStroke();
        this.forewingTexture.shader(forewingMetaballShader);
        this.forewingMask = createGraphics(WIDTH, HEIGHT);
        this.forewing = createImage(WIDTH, HEIGHT);

        this.wings = createGraphics(WIDTH, HEIGHT);

        this.canvas = createGraphics(WIDTH, HEIGHT, WEBGL);
        this.canvas.shader(grainyGradientShader);
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    update() {
        this.updateMetaballs();

        if (this.lerpProgress == 0) {
            this.updateShapeVarietyLerp();
        }

        this.lerpWing(this.forewingVertices, FOREWING_VERTEX_COUNT, 0);
        this.lerpWing(this.hindwingVertices, HINDWING_VERTEX_COUNT, 1);

        this.lerpProgress = (this.lerpProgress + 1) % LERP_MAX_PROGRESS;

        //----------------------------------------------------------//

        this.wings.clear();
        this.wings.background(BACKGROUND_COLOR);

        this.drawWings(
            hindwingMetaballShader,
            {
                u_Positions: this.metaballPositions.slice(
                    0,
                    Math.floor((METABALL_MAX_COUNT * 2) / 2)
                ),
                u_Sizes: this.metaballSizes.slice(
                    0,
                    Math.floor(METABALL_MAX_COUNT / 2)
                ),
                u_Colors: this.metaballColors.slice(
                    0,
                    Math.floor((METABALL_MAX_COUNT * 3) / 2)
                ),
                u_Strength: 2.4,
            },

            this.hindwingVertices,
            HINDWING_VERTEX_COUNT,

            this.hindwingTexture,
            this.hindwingMask,

            this.hindwingImg
        );

        this.drawWings(
            forewingMetaballShader,
            {
                u_Positions: this.metaballPositions.slice(
                    Math.floor((METABALL_MAX_COUNT * 2) / 2)
                ),
                u_Sizes: this.metaballSizes.slice(
                    Math.floor(METABALL_MAX_COUNT / 2)
                ),
                u_Colors: this.metaballColors.slice(
                    Math.floor((METABALL_MAX_COUNT * 3) / 2)
                ),
                u_Strength: 2.4,
            },

            this.forewingVertices,
            FOREWING_VERTEX_COUNT,

            this.forewingTexture,
            this.forewingMask,

            this.forewing
        );

        this.updateFocalPoint();
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    lerpWing(vertices, vertexCount, wingIndex) {
        for (let i = 0; i < vertexCount; i++) {
            let wiggle = this.wiggleVertex(i, i == 0 || i == vertexCount - 1);

            vertices[i] = createVector(
                // x
                map(
                    VERTEX_SCALE_RATIO,

                    1,
                    0,

                    map(
                        this.lerpProgress,

                        0,
                        LERP_MAX_PROGRESS,

                        WING_VERTICES[this.fromShapeVariety][wingIndex][i].x,
                        WING_VERTICES[this.toShapeVariety][wingIndex][i].x
                    ),
                    0.5
                ),

                // y
                map(
                    VERTEX_SCALE_RATIO,

                    1,
                    0,

                    map(
                        this.lerpProgress,

                        0,
                        LERP_MAX_PROGRESS,

                        WING_VERTICES[this.fromShapeVariety][wingIndex][i].y,
                        WING_VERTICES[this.toShapeVariety][wingIndex][i].y
                    ),
                    0.5
                )
            );

            // vertices[i].mult(wiggle);
        }
    }

    //--------------------------------------------------------------//

    wiggleVertex(index, doesNotWiggle) {
        if (doesNotWiggle) return createVector(1, 1);

        noiseSeed(index);
        let x = map(
            Math.sin(map(this.lerpProgress, 0, LERP_MAX_PROGRESS, 0, Math.PI)),
            0,
            1,
            1,
            map(
                noise(this.lerpProgress * VERTEX_WIGGLE_SCALE),
                0,
                1,
                1 - VERTEX_WIGGLE_FACTOR,
                1 + VERTEX_WIGGLE_FACTOR
            )
        );

        noiseSeed(-index);
        let y = map(
            Math.sin(map(this.lerpProgress, 0, LERP_MAX_PROGRESS, 0, Math.PI)),
            0,
            1,
            1,
            map(
                noise(this.lerpProgress * VERTEX_WIGGLE_SCALE),
                0,
                1,
                1 - VERTEX_WIGGLE_FACTOR,
                1 + VERTEX_WIGGLE_FACTOR
            )
        );

        return createVector(x, y);
    }

    //--------------------------------------------------------------//

    updateShapeVarietyLerp() {
        this.fromShapeVariety = this.toShapeVariety;

        while (this.toShapeVariety == this.fromShapeVariety) {
            this.toShapeVariety = Math.floor(
                Math.random() * SHAPE_VARIETY_COUNT
            );
        }
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    updateMetaballs() {
        while (this.metaballs.length < METABALL_MAX_COUNT) {
            this.metaballs.push(
                new Metaball(
                    // x
                    Math.random() * WIDTH,

                    // y
                    Math.random() * HEIGHT,

                    // maxRadius
                    map(
                        Math.random(),
                        0,
                        1,
                        METABALL_MAX_RADIUS_RANGE[0],
                        METABALL_MAX_RADIUS_RANGE[1]
                    ) * WIDTH,

                    // maxProgress
                    Math.floor(
                        map(
                            Math.random(),
                            0,
                            1,
                            METABALL_MAX_PROGRESS_RANGE[0],
                            METABALL_MAX_PROGRESS_RANGE[1]
                        )
                    )
                )
            );
        }

        for (let i = this.metaballs.length - 1; i >= 0; i--) {
            if (this.metaballs[i].isDead()) this.metaballs.splice(i, 1);
        }

        for (let i = 0; i < this.metaballs.length; i++) {
            this.metaballs[i].update();
        }

        this.metaballPositions = [];
        this.metaballSizes = [];
        this.metaballColors = [];

        for (const mb of this.metaballs) {
            this.metaballPositions.push(mb.pos.x, mb.pos.y);
            this.metaballSizes.push(mb.radius);
            this.metaballColors.push(...mb.getNormColor());
        }
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    updateFocalPoint() {
        this.focalPoint = createVector(WIDTH / 2, HEIGHT / 2);
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    display() {
        this.applyGrains(GRAIN_STRENGTH * WIDTH, GRAIN_TIME_SPEED);

        this.canvas.clear();
        this.canvas.rect(0, 0, WIDTH, HEIGHT);

        image(
            this.canvas,

            width / 2,
            height / 2,

            min(width, height),
            min(width, height)
        );

        // this.drawMetaballs();
    }

    //--------------------------------------------------------------//

    applyGrains(scale, timeSpeed) {
        grainyGradientShader.setUniform("tex0", this.wings);
        grainyGradientShader.setUniform("u_Resolution", [WIDTH, HEIGHT]);
        grainyGradientShader.setUniform("u_FocalPoint", [
            this.focalPoint.x,
            this.focalPoint.y,
        ]);
        grainyGradientShader.setUniform("u_Scale", scale);
        grainyGradientShader.setUniform("u_Time", millis() / 1000.0);
        grainyGradientShader.setUniform("u_TimeSpeed", timeSpeed);
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    drawMetaballs() {
        for (let mb of this.metaballs) {
            mb.display();
        }
    }

    //--------------------------------------------------------------//

    drawVertices(vertices, vertexCount) {
        fill(1);
        stroke(0);

        for (let i = 0; i < vertexCount; i++) {
            rectMode(CENTER);
            rect(vertices[i].x * WIDTH, vertices[i].y * HEIGHT, 10, 10);
        }
    }

    //--------------------------------------------------------------//

    drawWingSilhouette(mask, vertices, vertexCount, orientation) {
        mask.fill(0);
        mask.noStroke();

        mask.beginShape();

        switch (orientation) {
            case LEFT:
                mask.curveVertex(vertices[0].x * WIDTH, vertices[0].y * HEIGHT);

                for (let i = 0; i < vertexCount; i++) {
                    mask.curveVertex(
                        vertices[i].x * WIDTH,
                        vertices[i].y * HEIGHT
                    );
                }

                break;

            case RIGHT:
                mask.curveVertex(
                    (1 - vertices[0].x) * WIDTH,
                    vertices[0].y * HEIGHT
                );

                for (let i = 0; i < vertexCount; i++) {
                    mask.curveVertex(
                        (1 - vertices[i].x) * WIDTH,
                        vertices[i].y * HEIGHT
                    );
                }

                // mask.curveVertex(
                //     (1 - vertices[vertexCount - 1].x) * WIDTH,
                //     vertices[vertexCount - 1].y * HEIGHT
                // );
                break;
        }

        mask.endShape(CLOSE);

        switch (EXPORT_TYPE) {
            case PATTERNED_BUTTERFLY_WITH_BLUR:
                // image(
                //     this.canvas,

                //     width / 2,
                //     height / 2,

                //     min(width, height),
                //     min(width, height)
                // );
                break;

            case PATTERN_ONLY:
                mask.background(0);
                break;
        }
    }

    //--------------------------------------------------------------//

    drawWings(shader, uniforms, vertices, vertexCount, texture, mask, img) {
        shader.setUniform("u_Positions", uniforms.u_Positions);
        shader.setUniform("u_Sizes", uniforms.u_Sizes);
        shader.setUniform("u_Colors", uniforms.u_Colors);
        shader.setUniform("u_Strength", uniforms.u_Strength);
        shader.setUniform("u_Resolution", [WIDTH, HEIGHT]);

        texture.noStroke();
        texture.rect(0, 0, WIDTH, HEIGHT);

        mask.clear();

        this.drawWingSilhouette(mask, vertices, vertexCount, LEFT);
        this.drawWingSilhouette(mask, vertices, vertexCount, RIGHT);

        // image(mask, 0, 0);
        // this.drawVertices(vertices, vertexCount);

        img.copy(
            texture,

            -WIDTH / 2,
            -HEIGHT / 2,
            WIDTH,
            HEIGHT,

            0,
            0,
            WIDTH,
            HEIGHT
        );

        img.mask(mask);
        this.wings.image(img, 0, 0);
    }

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//

    export() {
        let folderName = this.formatDate(Date.now(), DATE),
            fileName =
                this.formatDate(Date.now(), TIMESTAMP) +
                "_" +
                Math.floor(WIDTH) +
                "x" +
                Math.floor(HEIGHT);

        save(
            this.canvas,
            EXPORT_DIRECTORY +
                folderName +
                "/" +
                fileName +
                "_img" +
                EXPORT_FILE_EXT
        );

        // save(
        //     this.wings,
        //     EXPORT_DIRECTORY +
        //         folderName +
        //         "/" +
        //         fileName +
        //         "_img" +
        //         EXPORT_FILE_EXT
        // );

        // save(
        //     this.canvasMask(),
        //     EXPORT_DIRECTORY +
        //         folderName +
        //         "/" +
        //         fileName +
        //         "_mask" +
        //         EXPORT_FILE_EXT
        // );

        // save(
        //     this.hindwingTexture,
        //     EXPORT_DIRECTORY +
        //         folderName +
        //         "/" +
        //         fileName +
        //         "_texture" +
        //         EXPORT_FILE_EXT
        // );
    }

    //--------------------------------------------------------------//

    canvasMask() {
        let silhouetteGraphics = createGraphics(WIDTH, HEIGHT);

        silhouetteGraphics.background(255);

        silhouetteGraphics.image(this.hindwingMask, 0, 0, WIDTH, HEIGHT);
        silhouetteGraphics.image(this.forewingMask, 0, 0, WIDTH, HEIGHT);

        silhouetteGraphics.filter(INVERT);

        let silhouetteImg = createImage(WIDTH, HEIGHT);

        silhouetteImg.copy(
            silhouetteGraphics,

            0,
            0,
            WIDTH,
            HEIGHT,

            0,
            0,
            WIDTH,
            HEIGHT
        );

        let mask = createGraphics(WIDTH, HEIGHT, WEBGL);

        switch (this.shaderMode) {
            case RADIAL_BLUR:
                mask.shader(grainyGradientShader2);

                grainyGradientShader2.setUniform("tex0", silhouetteImg);
                grainyGradientShader2.setUniform("u_Resolution", [
                    WIDTH,
                    HEIGHT,
                ]);
                grainyGradientShader2.setUniform("u_FocalPoint", [
                    this.focalPoint.x,
                    this.focalPoint.y,
                ]);
                grainyGradientShader2.setUniform("u_Strength", BLUR_STRENGTH);

                break;

            case GRAINY_BLUR:
                mask.shader(grainyBlurShader2);

                grainyBlurShader2.setUniform("tex0", silhouetteImg);
                grainyBlurShader2.setUniform("u_Dist", 2.0);
                grainyBlurShader2.setUniform("u_Resolution", [WIDTH, HEIGHT]);

                break;
        }

        mask.rect(0, 0, WIDTH, HEIGHT);

        return mask;
    }

    //--------------------------------------------------------------//

    formatDate(date, mode) {
        // Date
        const dd = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getDate());

            return a < 10 ? `0${a}` : a;
        };

        // Month
        const mm = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getMonth() + 1);

            return a < 10 ? `0${a}` : a;
        };

        // Year
        const yy = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getFullYear()).substring(2, 4);

            return a < 10 ? `0${a}` : a;
        };

        // Hour
        const h = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getHours());

            return a < 10 ? `0${a}` : a;
        };

        // Minute
        const m = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getMinutes());

            return a < 10 ? `0${a}` : a;
        };

        // Second
        const s = (date) => {
            let a;
            a = JSON.stringify(new Date(date).getSeconds());

            return a < 10 ? `0${a}` : a;
        };

        switch (mode) {
            case DATE:
                return yy(date) + mm(date) + dd(date);

            case TIMESTAMP:
                return h(date) + m(date) + s(date);
        }
    }
}
