import { OrbitControl } from '@oasis-engine/controls';
import {
  Animation,
  Camera,
  DirectLight,
  EnvironmentMapLight,
  Logger,
  SystemInfo,
  Vector3,
  WebGLEngine,
  Vector4,
} from 'oasis-engine';

//-- create engine object
export default async (canvas: HTMLCanvasElement) => {
  const engine = new WebGLEngine(canvas);
  engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
  engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // camera
  const cameraEntity = rootEntity.createChild('camera_node');
  cameraEntity.transform.position = new Vector3(0, 1, 5);
  const camera = cameraEntity.addComponent(Camera);
  camera.backgroundColor = new Vector4(1, 0.647, 0, 0);
  //cameraEntity.addComponent(OrbitControl).target = new Vector3(0, 1, 0);

  const lightNode = rootEntity.createChild('light_node');
  rootEntity.addComponent(EnvironmentMapLight);
  lightNode.addComponent(DirectLight).intensity = 0.6;
  lightNode.transform.lookAt(new Vector3(0, 0, 1));
  lightNode.transform.rotate(new Vector3(0, 90, 0));

  const promise = engine.resourceManager
    .load('https://gw.alipayobjects.com/os/basement_prod/aa318303-d7c9-4cb8-8c5a-9cf3855fd1e6.gltf')
    .then((asset) => {
      console.log(asset);
      const { animations, defaultSceneRoot } = asset as any;
      rootEntity.addChild(defaultSceneRoot);

      const animator = defaultSceneRoot.getComponent(Animation);
      animator.playAnimationClip(animations[0].name);
      return {
        animator,
        animations,
      };
    });

  engine.run();

  return promise;
};
