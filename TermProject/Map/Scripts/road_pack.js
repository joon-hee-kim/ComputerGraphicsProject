import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

const ROAD_PACK_PATH = [
  {
    path: "./Model/road_straight/scene.gltf",
    scale: 0.25,
  },
];

export class ROAD_PACK {
  // 생성자
  constructor(scene, x, y) {
    this._roundX = Math.round(x);
    this._roundY = Math.round(y);
    this._scene = scene;
    this._model;

    this._createModel();
  }

  _createModel() {
    // 랜덤한 모델 선택
    const randomModelIndex = Math.floor(Math.random() * ROAD_PACK_PATH.length);
    const selectedModel = ROAD_PACK_PATH[randomModelIndex];

    // 메쉬 생성
    new GLTFLoader().load(selectedModel.path, (gltf) => {
      this._model = gltf.scene;
      this._model.scale.set(
        selectedModel.scale,
        selectedModel.scale,
        selectedModel.scale
      );

      this._model.position.set(this._roundX, 0.1, this._roundY);
      // 회전 각도를 지정하여 설정할 수 있습니다.
      this._model.rotation.set(0, Math.PI / 2, 0); // 예: x축을 기준으로 90도 회전

      this._model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });
      this._scene.add(this._model);
    });
  }
}
