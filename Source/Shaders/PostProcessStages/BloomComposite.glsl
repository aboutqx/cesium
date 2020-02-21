uniform sampler2D colorTexture;
uniform sampler2D bloomTexture;
uniform bool glowOnly;

varying vec2 v_textureCoordinates;

void main(void)
{
    vec4 color = texture2D(colorTexture, v_textureCoordinates);

// #ifdef CZM_SELECTED_FEATURE
//     if (czm_selected()) {
//         gl_FragColor = vec4(.,0.3,0.3,1.);
//         return;
//     }
// #endif

    vec4 bloom = texture2D(bloomTexture, v_textureCoordinates);
    vec3 result = glowOnly ? bloom.rgb : bloom.rgb + color.rgb;
    //result = vec3(1.0) - exp(-result * 1.);
    // also gamma correct while we're at it
    //result = pow(result, vec3(1.0 / 2.2));
    gl_FragColor = vec4(result, 1.);
}
