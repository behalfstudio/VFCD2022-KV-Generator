precision mediump float;

#define NOISE_SEED 429496.7295

varying vec2 vTexCoord;

const int BALL_COUNT = 8;

uniform vec2 u_Positions[BALL_COUNT];
uniform float u_Sizes[BALL_COUNT];
uniform vec3 u_Colors[BALL_COUNT];
uniform vec2 u_Resolution;

// float res = 10.0;

//--------------------------------------------------------------//

// const vec3 BACKGROUND_COLOR = vec3(169, 217, 24) / 255.0;

// const vec3 OLIVE = vec3(20, 125, 66) / 255.0;
// const vec3 RED = vec3(255, 89, 89) / 255.0;
// const vec3 YELLOW = vec3(240, 203, 48) / 255.0;
// const vec3 BLUE = vec3(47, 86, 191) / 255.0;
// const vec3 PURPLE = vec3(138, 32, 214) / 255.0;
// const vec3 LIME = vec3(175, 230, 76) / 255.0;

// const int COLOR_COUNT = 4;
// vec3 COLORS[COLOR_COUNT];

//--------------------------------------------------------------//

// float pixelSize = 0.0;
// float time = 0.0;

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

// float random (vec2 st) {
//     return fract(
//         sin( 
//             dot(
//                 st.xy,
//                 vec2(12.9898,78.233)
//             )
//         )
//         * NOISE_SEED + NOISE_SEED
//     );
// }

//--------------------------------------------------------------//

// float lerp(float f1, float f2, float t) {
// 	return (f1 + t * (f2 - f1));
// }

//--------------------------------------------------------------//

// vec2 lerp(vec2 v1, vec2 v2, float t) {
// 	return (v1 + t * (v2 - v1));
// }

//--------------------------------------------------------------//

// vec2 initPos(int id) {
//     return vec2(
//         random(vec2(id)),
//         random(vec2(id + 313))
//     ) * res * 2.0 - res;
// }

//--------------------------------------------------------------//
  
// int modInt(int i, int j) {
//     return int(mod(float(i), float(j)));
// }

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

// vec2 pos(int id) {
//     //float time = u_Time / 10.;
//     int first = id + int(time) * 3;
//     int second = first + 1;
//     int third = first + 2;
//     int forth = first + 3;
    
//     vec2 pos1 = initPos(first);
//     vec2 pos2 = initPos(second);
//     vec2 pos3 = initPos(third);
//     vec2 pos4 = initPos(forth);
    
//     float t = fract(time);
    
//     vec2 lerp1 = lerp(pos1, pos2, t);
//     vec2 lerp2 = lerp(pos3, pos4, t);
    
//     return lerp(lerp1, lerp2, t);
// }

//--------------------------------------------------------------//

// int modInt(float a, float b) {
//     float m = a - floor((a + 0.5) / b) * b;
//     return int(floor(m + 0.5));
// }

//--------------------------------------------------------------//

// vec3 getColor(int id) {
//     for (int i = 0; i < COLOR_COUNT; i++) {
//         if (i == id) return COLORS[i];
//     }
// }

//--------------------------------------------------------------//

// vec3 randomColor(int id) {
//     return getColor(modInt(id, COLOR_COUNT));
// }

//--------------------------------------------------------------//

// float circle(vec2 uv, vec2 pos, float size) {
//     float dist = length(uv - pos);
//     float m = smoothstep(size, 0.01, dist);
    
//     return m;
// }

//--------------------------------------------------------------//

float distance2(vec2 a, vec2 b) {
    vec2 v = a - b;
    return dot(v, v);
}

//--------------------------------------------------------------//

vec4 calcColor(vec2 pos, float r, vec3 color, vec2 uv) {
    float dist = r / distance2(uv, pos);
    dist = pow(dist, 3.0);

    return vec4(color * dist, dist);
}

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

// void main() {
//     COLORS[0] = OLIVE;
//     COLORS[1] = YELLOW;
//     COLORS[2] = RED;
//     COLORS[3] = YELLOW;

//     time = u_Time * u_TimeSpeed;

//     vec2 st = gl_FragCoord.xy / u_Resolution.xy;
//     vec2 uv = (st - 0.5)  * res;

//     vec3 color = vec3(0.0);
//     float d = 0.0;
    
//     for (int i = 0; i < BALL_COUNT; i++) {
//         vec4 ballColor = calcColor(pos(i * 500), u_BallSize, randomColor(i), uv);

//         color += ballColor.rgb;
//         d += ballColor.a;
//     }
    
//     color = clamp(color / d, 0.0, 1.0);
    
//     gl_FragColor = vec4(color, 1.0);
// }

//--------------------------------------------------------------/

// void main() {
//     vec2 st = gl_FragCoord.xy/u_Resolution.xy;

//     float x = vTexCoord.x * u_Resolution.x;
//     float y = vTexCoord.y * u_Resolution.y;

//     float v = 0.0;

//     vec3 colorTotal = vec3(0.0);
//     for (int i = 0; i < METABALL_COUNT; i++) {
//         vec3 ball = uMetaballs[i];

//         float dx = ball.x - x;
//         float dy = ball.y - y;
//         float r = ball.z;

//         v += r * r / (dx * dx + dy * dy);

//         colorTotal += uColors[i] * v * 4.0;
//     }

//     gl_FragColor = vec4(colorTotal, 1.0);
// }

//--------------------------------------------------------------//

void main() {
    vec2 st = gl_FragCoord.xy / u_Resolution.xy;
    // vec2 uv = st  * res;

    vec3 color = vec3(0.0);
    float d = 0.0;

    for (int i = 0; i < BALL_COUNT; i++) {
        vec2 position = u_Positions[i] / u_Resolution.x;
        float r = u_Sizes[i];
        vec3 ballColor = u_Colors[i];

        vec4 c = calcColor(position, r, ballColor, st);

        color += c.rgb;
        d += c.a;
    }

    color = clamp(color / d, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}