#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 u_Resolution;
uniform vec2 u_FocalPoint;
uniform float u_Strength;

const int SAMPLES = 512;

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

void main() {

    vec2 uv = vTexCoord;
    uv = vec2(uv.x, 1.0 - uv.y);
    
	vec2 dir = (gl_FragCoord.xy - u_FocalPoint.xy) / u_Resolution.xy * vec2(-1.0, 1.0);
  
    vec4 color = vec4(0.0);
    
    for (int i = 0; i < SAMPLES; i += 2) {
        color += texture2D(
            tex0,
            uv + float(i) / float(SAMPLES) * dir * u_Strength
        );

        color += texture2D(
            tex0,
            uv + float(i + 1) / float(SAMPLES) * dir * u_Strength
        );
    }

    vec2 ps = vec2(1.0) / u_Resolution.xy;
    
    color = color / float(SAMPLES);

    gl_FragColor = color;
}