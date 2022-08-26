precision mediump float;

#define NOISE_SEED 429496.7295

varying vec2 vTexCoord;

const int BALL_COUNT = 6;

uniform vec2 u_Positions[BALL_COUNT];
uniform float u_Sizes[BALL_COUNT];
uniform vec3 u_Colors[BALL_COUNT];
uniform float u_Strength;
uniform vec2 u_Resolution;

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

float distance2(vec2 a, vec2 b) {
    vec2 v = a - b;
    return dot(v, v);
}

//--------------------------------------------------------------//

vec4 calcColor(vec2 pos, float r, vec3 color, vec2 uv) {
    float dist = r / distance2(uv, pos);
    dist = pow(dist, u_Strength);

    return vec4(color * dist, dist);
}

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

void main() {
    vec2 st = gl_FragCoord.xy / u_Resolution.xy;

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