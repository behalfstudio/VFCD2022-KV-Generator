#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 u_Resolution;
uniform vec2 u_FocalPoint;
uniform float u_Scale;
uniform float u_Time;
uniform float u_TimeSpeed;

const int SAMPLES = 512;

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

float rand(vec2 uv, float t) {
    return fract(
        sin(
            dot(
                uv,
                vec2(1225.6548, 321.8942)
            )
        ) * 4251.4865 + t
    );
}

//--------------------------------------------------------------//

void main() {

    vec2 uv = vTexCoord;
    uv = vec2(uv.x, 1.0 - uv.y);
    
	vec2 dir = (gl_FragCoord.xy - u_FocalPoint.xy) / u_Resolution.xy * vec2(-1.0, 1.0);

    vec2 ps = vec2(1.0) / u_Resolution.xy;

    vec2 offset = (rand(uv, u_Time * u_TimeSpeed) - 0.5) * 2.0 * ps * u_Scale;
    vec3 color = texture2D(tex0, uv + offset * dir).rgb;

    gl_FragColor = vec4(color, 1.0);
}