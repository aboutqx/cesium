终极奥义： 查找 new ShaderProgram进行debug，这个是只在ShaderCache里出现一次的，依此被每个渲染物体的update方法调用，而且能看到vertex和fragment代码

Example Library for cesium：

https://github.com/MikesWei/CesiumMeshVisualizer

Render pipeline:

https://github.com/CesiumGS/cesium/wiki/Data-Driven-Renderer-Details

Custom webgl sample:

Scene/EllipsoidPrimitive.js

Cesium articles:

https://www.cnblogs.com/fuckgiser/p/5991174.html

FrameBuffer and Compute Tetxure Example:

Renderer -> checkFloatTexturePrecision






Rendering Pipipeline：

    requestAnimationFrame:
    Scene.render

        ->prePassesUpdate -> scene.globe.update(frameState) //..为什么globe的update出现在这里？？

        ->render:
            Scene.updateFrameState()

            Context.uniformState.update(frameState)

            Scene.globe.beginFrame(frameState) //....渲染globe

            Scene.updateEnvironment() #set environmentState

            //沉思： executeCommands 里面是一大堆的状态判断， 从而来执行相应的DrawCommand，从设计模式的角度看，是失败的
            //这里面的耦合性强，聚合性低，为什么不能给每个渲染物体，例如地球（globe）一个render函数，来分别调用呢
            //它采用的是状态判断，

            //  ENVIRONMENT: 0
                COMPUTE: 1
                GLOBE: 2
                TERRAIN_CLASSIFICATION: 3
                CESIUM_3D_TILE: 4
                CESIUM_3D_TILE_CLASSIFICATION: 5
                CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW: 6
                OPAQUE: 7
                TRANSLUCENT: 8
                OVERLAY: 9
                NUMBER_OF_PASSES: 10

            //从这个来规定渲染顺序，在这里面一些pass是每个渲染物体都需要的，能够复用，例如opaque，transluent，但有些根本就是物体啊，例如globe
            //相应的drawcommands来自view.frustumCommands.commands[Pass.passIndex]，还算能读

            //一件好事是这儿我们有了primitiveFramebuffer，不使用picking所有模型都被渲染到这里了，否则渲染到picking
            Scene.updateAndExecuteCommands->...... ->DrawCommand.execute->Context.draw #bindFrameBuffer,set vao,uniformsm,gl.draw


		......->updateAndClearFramebuffers

			->postProcess.update()

		......->executeCommands

            Scene.resolveFramebuffers # resolve frambuffer in case of scene.evionmentState, and set its texture for render

                                        Alse merge primitive framebuffer into globe framebuffer

                                        set passState.framebuffer = defaultFramebuffer when environmentState.usePostProcess == true, render to screen

        ->postPassesUpdate


renderer:

Renderer

	 -> Context #actual draw pipeline with bind passState's framebuffer,vao & setUniforms & draw arrays or elements, also has extensions

		   -> draw() -> beginDraw() -> bind passState.framebuffer, applyRenderState(passState), shaderProgram._bind() ->

RenderState.partialApply() ->gl.ScissorTest,bending,viewport

			     -> continueDraw() -> shaderProgram._setUniforms(uniformMap) , gl.draw()

           -> createPickId

	 -> ComputeCommand #compute shader with gpgpu

	 -> Pass #compute pass for offscreen fbo render

	 -> ComputeEngine #execute a draw command which includes vs, fs, shaderProgram, renderState, uniformMap, framebuffer， outputTexture

	 -> ClearCommand #Represents a command to the renderer for clearing a framebuffer.

	 -> DrawCommand # Represents a command to the renderer for drawing. Can set .framebuffer

		-> execute -> Context#draw(context, passState)

		.vertexArray #vao

Scene -> Camera

      -> View # updateFrustums, has camera

      -> Scene # has sun, skybox etc, render function.

	 -> updateAndRenderPrimitives #draw

      -> Cesium3DTileset #3d tile Object

      -> Cesium3DTile #A tile in a Cesium3DTileset

      -> Primitive #A primitive represents geometry in the Scene

	  -> update() #Called when Viewer or CesiumWidget render the primitives

      -> Cesium3DTileStyleEngine #apply style use Batched3DModel3DTileContent applyStyle -> Cesium3DTileBatchTable applyStyle，setColor -> up-

dateBatchTexture -> Texture.copyFrom  #create colorTexture from data arrayBufferView use batchValues.setColor changes batchValues.

      -> Cesium3DTileFeature #a feature of tileset

      -> SceneFrameBuffer #global framebuffer

      -> FrameState #State information about the current frame.  An instance of this class is provided to update functions.

      -> Picking #select 3DTileSetFeature

      -> executeComputeCommands() #call from firstViewport

      -> executeCommands() #execute commands follow the Pass order.

	-> uniformState.updatePass() -> ....... various Context.draw()

      -> SceneFramebuffer #has frambuffers with colorTexture, idTexture, depthTexture

	-> clear #bind framebuffer and clear it

      -> Batched3DModel3DTileContent->initialize() #init gltf to this._model which is instance of Model

      -> Model-> update（） #判断gltf载入状态 ModelState.[NEEDS_LOAD,LOADING,LOADED]进行相应操作，push CommandList

Just Debug It.See Call Stack.BreakPoint at each class's update function

Widgets -> Viewer -> Viewer #container

color:

Scene -> Cesium3DTileStyle #various color expression evaluates

Core -> Color #color manuplation, color constants，rgb，rgba，hsl color to vec4 red，green，blue，alpha

Scene -> BatchTable #store each primitive's pick color in the creating texture.

webgl2:

Scene -> modernizeShader #change to opengl es 3.0 glsl.

postprocess：

Scene -> PostProcessStage #define each stage

	-> PostProcessStage.execute #输入colorTexture, depthTexture, idTexture来进行处理

      -> PostProcessComposite #define composite

      -> PostProcessStageCollection #create post-process stage instaces

      -> PostProcessStageLibrary #functions creating common post-process stages

shaders -> Shaders/PostProcessStages


model:

DataSource -> Entity #has ModelGraphics

Scene -> Model #gltf model, ready promise

Scene -> PrimitiveCollection -> get(index) #get scene primitive

DataSource -> ModelVisualizer #map Entity#ModelGraphics to a Model， while only Model has the ready promise

Scene -> Cesium3DTileset.root -> Cesium3DTile.content._batchTable -> Batched3DModel3DTileContent #getFeature(batchId) or _features  ->

Cesium3DTileFeature #pickId

	which is color

	while batchId from Cesium3DTileBatchTable

	#root may have Empty3DTileContent, selectedTiles always change with view.

content.applyStyle -> featureLenght === 0 设置model的属性 model.color = ''，反之有feature,使用batchTable.applyStyle

 Batched3DModel3DTileContent.update #渲染3d model和3d tile

BatchTable.getBatchedAttribute #unpack batch value from b3dm

Cesium3DTileContentFactory  #b3dm :return new Batched3DModel3DTileContent

Cesium3DTileStyle #this.color.getShaderFunction

BatchTable #Creates a texture to look up per instance attributes for batched primitives. For example, store each primitive's pick color in the texture.

Material createUnifrom: if (uniformType === 'sampler2D') {
                material._uniforms[newUniformId] = function() {
                    return material._textures[uniformId];
                };
                material._updateFunctions.push(createTexture2DUpdateFunction(uniformId));
            } #贴图使用方法返回相应_tetxures里面的值，并且使用updateFunctions来更新_textures

uniformState.updateCamera #设置camera的position和三个向量

Model.createVertexBuffer #创建position，normal等的buffer

SceneTransforms.drawingBufferToWgs84Coordinates里调用时uniformState.inverseModel，这个inverseModel竟然时identity，导致设置model的position时位移的上万的坐标无法还原成position。
结果智能用移动后的坐标作为light的position，计算时乘以view，不再是modelView
