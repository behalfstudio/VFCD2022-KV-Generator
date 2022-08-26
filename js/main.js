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

    // grainyEdgeShader = grainyGradientShader;
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

let butterfly;
let WIDTH, HEIGHT;

let exportCanvas;

let BACKGROUND_COLOR, METABALL_COLORS;
let EXPORT_WIDTH, EXPORT_HEIGHT, EXPORT_RESOLUTION;
let EXPORT_TYPE;

//-----------------------------------------------------------------//

function setup() {
    const canvasContainer = document.getElementById("canvas-container");
    let previewCanvas = createCanvas(
        canvasContainer.offsetWidth,
        canvasContainer.offsetHeight
    );
    previewCanvas.parent(canvasContainer);

    pixelDensity(1);

    updateParameters();
    butterfly = new Butterfly();

    colorMode(RGB, 255, 255, 255, 255);

    imageMode(CENTER);
    // noLoop();
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

function draw() {
    updateParameters();

    butterfly.update();
    butterfly.display();
}

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

function exportImage() {
    butterfly.export();
}
