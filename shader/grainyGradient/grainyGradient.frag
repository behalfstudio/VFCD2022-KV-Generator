#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 u_Resolution;
uniform vec2 u_FocalPoint;
uniform float u_Strength;
uniform float u_Scale;
uniform float u_Time;
uniform float u_TimeSpeed;
uniform float u_Amount;

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

    vec2 offset = (rand(uv, u_Time * u_TimeSpeed) - 0.5) * 2.0 * ps * u_Scale;
    vec3 noise = texture2D(tex0, uv + offset * dir).rgb;
    
    color = color / float(SAMPLES);
    color.rgb = mix(color.rgb, noise, u_Amount);

    gl_FragColor = color;
}