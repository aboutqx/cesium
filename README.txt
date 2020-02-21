Render pipeline:

https://cesium.com/blog/2015/05/14/graphics-tech-in-cesium/

Custom webgl sample: 

Scene/EllipsoidPrimitive.js

postprocess£º

Scene -> PostProcessStage #define each stage
      
      -> PostProcessComposite #define composite 

      -> PostProcessStageCollection #create post-process stage instaces

      -> PostProcessStageLibrary #functions creating common post-process stages

shaders -> Shaders/PostProcessStages

renderer:

Renderer -> ShaderProgram

	 -> ShaderSource #shader string utils
	
	 -> Texture
	
	 -> DrawCommand #a command to the renderer for drawing
	
	 -> FrameBuffer 

	 -> createUniforms

	 -> UniformState #uniform values
	
	 -> Context #actual draw pipeline with bind vao & setUniforms & draw arrays or elements, also has extensions

	 -> ComputeCommand #compute shader

Scene -> Camera
      
      -> View # updateFrustums, has camera

      -> SkyBox

      -> Scene # has sun, skybox etc, render function

      -> Cesium3DTileset #3d tile Object

      -> Cesium3DTile #A tile in a Cesium3DTileset

      -> Primitive #A primitive represents geometry in the Scene

      -> Cesium3DTileStyleEngine #apply style use Batched3DModel3DTileContent applyStyle -> Cesium3DTileBatchTable applyStyle£¬setColor -> up-

dateBatchTexture -> Texture.copyFrom  #create colorTexture from data arrayBufferView use batchValues.setColor changes batchValues.
 
      -> SceneFrameBuffer #global framebuffer

      -> FrameState #State information about the current frame.  An instance of this class is provided to update functions.

Just Debug It.See Call Stack.

Widgets -> Viewer -> Viewer #container

color:

Scene -> Cesium3DTileStyle #various color expression evaluates

Core -> Color #color manuplation, color constants£¬rgb£¬rgba£¬hsl color to vec4 red£¬green£¬blue£¬alpha

Scene -> BatchTable #store each primitive's pick color in the creating texture.

webgl2£º

Scene -> modernizeShader #change to opengl es 3.0 glsl.