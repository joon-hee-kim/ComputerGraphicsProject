import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

const MUSEUM_MODEL_PATHS = [
  {
    //path: "./Model/old_station_industrial_building_series_no1/scene.gltf",
    path: "./Model/ateneum_museum/scene.gltf",
    scale: 0.7,
  },
];

export class MUSEUM_MODEL {
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
    const randomModelIndex = Math.floor(
      Math.random() * MUSEUM_MODEL_PATHS.length
    );
    const selectedModel = MUSEUM_MODEL_PATHS[randomModelIndex];

    // 메쉬 생성
    new GLTFLoader().load(selectedModel.path, (gltf) => {
      this._model = gltf.scene;
      this._model.scale.set(
        selectedModel.scale,
        selectedModel.scale,
        selectedModel.scale
      );

      this._model.rotation.set(0, Math.PI, 0); // 예: x축을 기준으로 90도 회전
      this._model.position.set(this._roundX, 0, this._roundY);

      this._model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });
      this._scene.add(this._model);
    });
  }
}
