let BACKGROUND_COLOR, METABALL_COLORS;
let EXPORT_WIDTH, EXPORT_HEIGHT, EXPORT_RESOLUTION;
let EXPORT_TYPE;

const updateParameters = () => {
    BACKGROUND_COLOR = (function (BACKGROUND_COLOR) {
        let temp = "#" + document.getElementById("background-color").value;

        if (BACKGROUND_COLOR !== temp) return temp;
        else return BACKGROUND_COLOR;
    })(BACKGROUND_COLOR);

    let temp = document
        .getElementById("pattern-color-palette")
        .value.split(" ");
    for (let i = 0; i < temp.length; i++) temp[i] = "#" + temp[i];

    let equals;

    if (METABALL_COLORS === undefined) {
        METABALL_COLORS = temp;
        equals = false;
    } else {
        equals = METABALL_COLORS.length == temp.length;

        if (equals)
            for (let i = 0; i < METABALL_COLORS.length; i++) {
                if (METABALL_COLORS[i] !== temp[i]) {
                    equals = false;
                    break;
                }
            }

        METABALL_COLORS = temp;
    }

    if (butterfly !== undefined && !equals) {
        for (let mb of butterfly.metaballs) {
            mb.updateColor();
        }
    }

    EXPORT_WIDTH = parseInt(document.getElementById("export-width").value);
    EXPORT_HEIGHT = parseInt(document.getElementById("export-height").value);
    EXPORT_RESOLUTION = parseInt(
        document.getElementById("export-resolution").value
    );
    WIDTH = Math.floor((EXPORT_WIDTH * EXPORT_RESOLUTION) / 72);
    HEIGHT = Math.floor((EXPORT_HEIGHT * EXPORT_RESOLUTION) / 72);

    EXPORT_TYPE = parseInt(document.getElementById("output-type-select").value);
};
