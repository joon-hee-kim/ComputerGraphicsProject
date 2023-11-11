import * as THREE from "../../build/three.module.js";
import { OrbitControls } from "../../examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

export class MyCharacter {
  constructor(scene, renderer, camera) {
    const divContainer = document.querySelector("#render-target");
    this._divContainer = divContainer;

    this._camera2D = false;
    this._scene = scene;
    this._renderer = renderer;
    this._camera = camera;
    this._modelIndex = 0;
    this._camera.position.set(-50, 70, -50);
    this._camera.lookAt(100, 0, 100);
    this._speed = 0;
    this._start = false;
    this._meshArray = [
      "./Model/characters/Purple.gltf",
      "./Model/characters/Yellow.gltf",
      "./Model/characters/Green.gltf",
      "./Model/characters/Skyblue.gltf",
      "./Model/characters/Pink.gltf",
    ];

    this._model;
    this._setupModel(this._modelIndex);
    this._setupControls();
    this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));
  }

  _setupModel(modelIndex) {
    new GLTFLoader().load(this._meshArray[modelIndex], (gltf) => {
      const model = gltf.scene;
      this._model = model;
      model.scale.set(20, 20, 20);
      model.position.set(3, 0, 10);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      const animationClips = gltf.animations; //gltf.animations는 THREE.AnimationClip[] 타입의 배열
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap = {};

      animationClips.forEach((clip) => {
        const name = clip.name;
        animationsMap[name] = mixer.clipAction(clip);
      });

      this._mixer = mixer; // 애니메이션 play하려면 mixer 객체를 프레임마다 업데이트 해줘야 함!
      this._animationMap = animationsMap;
      this._currentAnimationAction = this._animationMap["Armature|Dance"];
      this._currentAnimationAction.play();
      this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));

      this._scene.add(model);
    });
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._divContainer);
    //this._controls.target.set(0, 100, 0);

    this._pressedKeys = {};
    document.addEventListener("keydown", (event) => {
      if (this._start) {
        this._pressedKeys[event.key.toLowerCase()] = true;
        this._processAnimation();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this._start) {
        this._pressedKeys[event.key.toLowerCase()] = false;
        this._processAnimation();
      }
    });
  }

  _processAnimation() {
    const previousAnimationAction = this._currentAnimationAction;
    if (
      this._pressedKeys["w"] ||
      this._pressedKeys["a"] ||
      this._pressedKeys["s"] ||
      this._pressedKeys["d"]
    ) {
      if (this._pressedKeys["shift"]) {
        this._currentAnimationAction = this._animationMap["Armature|Run"]; // Run
        this._speed = 20;
      } else {
        this._currentAnimationAction = this._animationMap["Armature|Walk"]; // Walk
        this._speed = 9;
      }
    } else {
      this._currentAnimationAction = this._animationMap["Armature|Idle"]; // Idle
      this._speed = 0;
    }

    if (previousAnimationAction != this._currentAnimationAction) {
      previousAnimationAction.fadeOut(0.5);
      this._currentAnimationAction.reset().fadeIn(0.5).play();
    }
  }

  _directionOffset() {
    const pressedKeys = this._pressedKeys;
    let directionOffset = 0;

    if (pressedKeys["w"]) {
      if (pressedKeys["a"]) {
        directionOffset = Math.PI / 4; //w+a(45도)
      } else if (pressedKeys["d"]) {
        directionOffset = -Math.PI / 4;
      }
    } else if (pressedKeys["s"]) {
      if (pressedKeys["a"]) {
        directionOffset = Math.PI / 4 + Math.PI / 2; //w+a(45도)
      } else if (pressedKeys["d"]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2;
      } else {
        directionOffset = Math.PI; // s(180도)
      }
    } else if (pressedKeys["a"]) {
      directionOffset = Math.PI / 2;
    } else if (pressedKeys["d"]) {
      directionOffset = -Math.PI / 2;
    }
    return directionOffset;
  }

  update(time) {
    time *= 0.001; // second unit

    this._controls.update();
    if (this._mixer) {
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);

      const angleCameraDirectionAxisY =
        Math.atan2(
          this._camera.position.x - this._model.position.x,
          this._camera.position.z - this._model.position.z
        ) + Math.PI;

      const rotateQuaternion = new THREE.Quaternion();
      rotateQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angleCameraDirectionAxisY + this._directionOffset()
      );

      this._model.quaternion.rotateTowards(
        rotateQuaternion,
        THREE.MathUtils.degToRad(20)
      );

      const walkDirection = new THREE.Vector3();
      this._camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this._directionOffset()
      );

      const moveX = walkDirection.x * (this._speed * deltaTime);
      const moveZ = walkDirection.z * (this._speed * deltaTime);

      this._model.position.x += moveX;
      this._model.position.z += moveZ;

      this._camera.position.x += moveX;
      this._camera.position.z += moveZ;

      if (!this._camera2D) {
        this._controls.target.set(
          this._model.position.x,
          this._model.position.y,
          this._model.position.z
        );
      }
    }
    this._previousTime = time;
  }

  render(time) {
    this.update(time);
    this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));
  }

  changeMesh(modelIndex) {
    this._modelIndex =
      (modelIndex + this._meshArray.length) % this._meshArray.length;
    window.cancelAnimationFrame(this._AnimRequestFrame);
    if (this._scene) {
      this._scene.remove(this._model);
    }
    this._setupModel(this._modelIndex);
  }
}
