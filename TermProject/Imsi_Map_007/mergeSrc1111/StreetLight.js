import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

const STREET_LIGHT_MODEL_PATHS = [
    {
      path: "./LowpolyModel/streetLight/scene.gltf",
      scale: 3,
    },
  ];

export class STREETLIGHT{
    // 생성자
    constructor(scene, x, y, k){
        this._roundX = Math.round(x);
        this._roundY = Math.round(y);
        this._scene = scene;
        this._model;
        this._index = k;

        this._createModel();
    }

    // 메쉬 생성
    _createModel(){
        // 랜덤한 모델 선택
        const randomModelIndex = Math.floor(Math.random() * STREET_LIGHT_MODEL_PATHS.length);
        const selectedModel = STREET_LIGHT_MODEL_PATHS[randomModelIndex];

        // 메쉬 생성
        new GLTFLoader().load(selectedModel.path, (gltf) => {
            this._model = gltf.scene;
            this._model.scale.set(selectedModel.scale, selectedModel.scale, selectedModel.scale);

            this._model.position.set(this._roundX, 13.5, this._roundY);
            // 어디에 있는지에 따라 회전
            switch(this._index){
                case 0:
                    this._model.rotation.y = Math.PI/4;
                    break;
                case 1:
                    this._model.rotation.y = -Math.PI/2;
                    break;
                case 2:
                    this._model.rotation.y = Math.PI/2 +  Math.PI/4;
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