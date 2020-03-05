Example Library for cesium£º

https://github.com/MikesWei/CesiumMeshVisualizer

Render pipeline:

https://github.com/CesiumGS/cesium/wiki/Data-Driven-Renderer-Details

Custom webgl sample: 

Scene/EllipsoidPrimitive.js

FrameBuffer and Compute Tetxure Example:

Renderer -> checkFloatTexturePrecision

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

		   -> draw() -> beginDraw() -> bindFramebuffer, applyRenderState(passState), shaderProgram._bind() -> RenderState.partialApply() -															>gl.ScissorTest,bending,viewport

			     -> continueDraw() -> gl.draw()

	 -> ComputeCommand #compute shader with gpgpu

	 -> Pass #compute pass for offscreen fbo render
	
	 -> ComputeEngine #execute a draw command which includes vs, fs, shaderProgram, renderState, uniformMap, framebuffer£¬ outputTexture

	 -> ClearCommand #Represents a command to the renderer for clearing a framebuffer.

	 -> DrawCommand # Represents a command to the renderer for drawing. Can set .framebuffer

		-> execute -> Context#draw()

		.vertexArray #vao

Scene -> Camera
      
      -> View # updateFrustums, has camera

      -> SkyBox

      -> Scene # has sun, skybox etc, render function.
	
	 -> updateAndRenderPrimitives #draw

      -> Cesium3DTileset #3d tile Object

      -> Cesium3DTile #A tile in a Cesium3DTileset

      -> Primitive #A primitive represents geometry in the Scene

	  -> update() #Called when Viewer or CesiumWidget render the primitives

      -> Cesium3DTileStyleEngine #apply style use Batched3DModel3DTileContent applyStyle -> Cesium3DTileBatchTable applyStyle£¬setColor -> up-

dateBatchTexture -> Texture.copyFrom  #create colorTexture from data arrayBufferView use batchValues.setColor changes batchValues.

      -> Cesium3DTileFeature #a feature of tileset
 
      -> SceneFrameBuffer #global framebuffer

      -> FrameState #State information about the current frame.  An instance of this class is provided to update functions.

      -> Picking #select 3DTileSetFeature

      -> executeComputeCommands() #call from firstViewport

      -> executeCommands() #execute commands follow the Pass order.
	
	-> uniformState.updatePass()

Just Debug It.See Call Stack.

Widgets -> Viewer -> Viewer #container

color:

Scene -> Cesium3DTileStyle #various color expression evaluates

Core -> Color #color manuplation, color constants£¬rgb£¬rgba£¬hsl color to vec4 red£¬green£¬blue£¬alpha

Scene -> BatchTable #store each primitive's pick color in the creating texture.

webgl2:

Scene -> modernizeShader #change to opengl es 3.0 glsl.

model:

DataSource -> Entity #has ModelGraphics 

Scene -> Model #gltf model, ready promise

Scene -> PrimitiveCollection -> get(index) #get scene primitive

DataSource -> ModelVisualizer #map Entity#ModelGraphics to a Model£¬ while only Model has the ready promise

Scene -> Cesium3DTileset.root -> Cesium3DTile.content._batchTable -> Batched3DModel3DTileContent #getFeature(batchId) or _features  -> 

Cesium3DTileFeature #pickId 

	which is color

	while batchId from Cesium3DTileBatchTable

	#root may have Empty3DTileContent, selectedTiles always change with view.