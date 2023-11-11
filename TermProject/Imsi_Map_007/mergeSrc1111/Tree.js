import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

const TREE_MODEL_PATHS = [
    {
      path: "./LowpolyModel/tree/scene.gltf",
      scale: 0.35,
    },
    {
      path: "./LowpolyModel/tree2/scene.gltf",
      scale: 10
    },

  ];

export class TREE{
    // 생성자
    constructor(scene, x, y ,idx){
        this._roundX = Math.round(x);
        this._roundY = Math.round(y);
        this._scene = scene;
        this._model;
        this._index = idx;

        this._createModel();
    }

    _createModel(){
        const selectedModel = TREE_MODEL_PATHS[this._index];

        // 메쉬 생성
        new GLTFLoader().load(selectedModel.path, (gltf) => {
            this._model = gltf.scene;
            this._model.scale.set(selectedModel.scale, selectedModel.scale, selectedModel.scale);

            switch(this._index){
              case 0:
                this._model.position.set(this._roundX, 5, this._roundY);
                break;
              case 1:
                this._model.position.set(this._roundX, -0.2, this._roundY);
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