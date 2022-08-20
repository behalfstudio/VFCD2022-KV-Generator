let hindwingMetaballShader,
    forewingMetaballShader,
    grainyGradientShader,
    grainyEdgeShader;

//-----------------------------------------------------------------//

function preload() {
    hindwingMetaballShader = loadShader(
        "shader/metaball/metaball.vert",
        "shader/metaball/metaball.frag"
    );

    forewingMetaballShader = loadShader(
        "shader/metaball/metaball.vert",
        "shader/metaball/metaball.frag"
    );

    grainyGradientShader = loadShader(
        "shader/grainyGradient/grainyGradient.vert",
        "shader/grainyGradient/grainyGradient.frag"
    );

    grainyEdgeShader = grainyGradientShader;
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

let butterfly;
let WIDTH, HEIGHT;

let bgColor;

let exportCanvas;

//-----------------------------------------------------------------//

function setup() {
    const canvasContainer = document.getElementById("canvas-container");
    let previewCanvas = createCanvas(
        min(canvasContainer.offsetWidth, canvasContainer.offsetHeight),
        min(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
    );
    previewCanvas.parent(canvasContainer);

    pixelDensity(1);

    bgColor = random(METABALL_COLORS);

    WIDTH =
        EXPORT_CANVAS_WIDTH == 0
            ? Math.floor(width * 0.8)
            : EXPORT_CANVAS_WIDTH;
    HEIGHT =
        EXPORT_CANVAS_HEIGHT == 0
            ? Math.floor(height * 0.8)
            : EXPORT_CANVAS_HEIGHT;

    butterfly = new Butterfly(SHADER_MODE);

    colorMode(RGB, 255, 255, 255, 255);

    // noLoop();
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

function draw() {
    butterfly.update();
    butterfly.display();
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

function exportImage() {
    butterfly.export();
}
