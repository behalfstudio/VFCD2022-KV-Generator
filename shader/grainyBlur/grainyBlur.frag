#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 u_Resolution;
uniform float u_Dist;

const int LOOPS = 100;

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

float rand(vec2 uv){
    return fract(
        sin(
            dot(
                uv,
                vec2(12.9898, 78.233)
            )
        ) * 43578.5453
    );   
}

//--------------------------------------------------------------//

void main() {
    vec2 uv = vTexCoord;
    uv = vec2(uv.x, 1.0 - uv.y);

    vec4 t = vec4(0.0);
    
    vec2 texel = 1.0 / u_Resolution.xy;
    vec2 d = texel * u_Dist;

    for (int i = 0; i < LOOPS; i++) {
    	
		float r1 = clamp(
            rand(
                uv * float(i)
            ) * 2.0 - 1.0,

            -d.x,
            d.x
        );

    	float r2 = clamp(
            rand(
                uv * float(i + LOOPS)
            ) * 2.0 - 1.0,
            
            -d.y,
            d.y
        );
    
    	t += texture2D(
            tex0,
            uv + vec2(r1 , r2)
        );
    }
    
    t /= float(LOOPS);

    gl_FragColor = t;
}

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//

const int ITERATIONS = 32;
const float SIZE = 5.0;

//--------------------------------------------------------------//

float srand(vec2 a) {
	return sin(dot(a, vec2(1233.224, 1743.335)));
}

//--------------------------------------------------------------//

float rand(float a) {
	float r = fract(3712.65 * a + 0.61432);
	return (r - 0.5) * 2.0;
}

//--------------------------------------------------------------//

void grain() {
	vec2 uv = vTexCoord;
    uv = vec2(uv.x, 1.0 - uv.y);

	float p = SIZE / u_Resolution.y;

	vec4 c = vec4(0.0);

	float r = srand(uv);
	vec2 rv;
	
	for(int i = 0; i < ITERATIONS; i++) {
		rv.x = rand(r);
		rv.y = rand(r);

		c += texture2D(tex0, -uv + rv * p) / float(ITERATIONS);
	}

	gl_FragColor = c;
}