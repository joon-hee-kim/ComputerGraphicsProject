import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

const BENCH_MODEL_PATHS = [
    {
      path: "./LowpolyModel/bench/scene.gltf",
      scale: 0.05,
    },
  ];

export class BENCH{
    // 생성자
    constructor(scene, x, y, k){
        this._roundX = Math.round(x);
        this._roundY = Math.round(y);
        this._scene = scene;
        this._model;
        this._index = k;

        this._createModel();
    }

    _createModel(){
        // 랜덤한 모델 선택
        const randomModelIndex = Math.floor(Math.random() * BENCH_MODEL_PATHS.length);
        const selectedModel = BENCH_MODEL_PATHS[randomModelIndex];

        // 메쉬 생성
        new GLTFLoader().load(selectedModel.path, (gltf) => {
            this._model = gltf.scene;
            this._model.scale.set(selectedModel.scale, selectedModel.scale, selectedModel.scale);

            this._model.position.set(this._roundX, 1.7, this._roundY);
            switch(this._index){
              case 0:
                this._model.rotation.y = -Math.PI/2;
                break;
              case 1:
                this._model.rotation.y = Math.PI/2;
                break;
              case 2:
                this._model.rotation.y = -Math.PI;
                break;
            }
      
            this._model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
              }
            });
            this._scene.add(this._model);
        });
    }
}