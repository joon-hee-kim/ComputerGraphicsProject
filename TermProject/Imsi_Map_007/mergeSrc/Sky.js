import * as THREE from "../../build/three.module.js";
import { Sky } from "../../examples/jsm/objects/Sky.js";
import { GUI } from "../../examples/jsm/libs/lil-gui.module.min.js";

let test = 0;
export class SKY{
    constructor(scene, renderer){
        this._scene = scene;
        this._renderer = renderer;
        this._sky = new Sky();
        this._gui = new GUI();
        this._sun = new THREE.Vector3();
        this._uniforms = this._sky.material.uniforms;
        this._effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.4,
            elevation: 1,
            azimuth: 90,
            exposure: 0.7,
        };
        console.log(this._sky.material);
        this._sky.position.set(100.0, 0.0, 100.0);
        this._sky.scale.setScalar(1000);
        this._scene.add(this._sky);
    }

    _guiAdd(){
        this._gui.add(this._effectController, "turbidity", 0.0, 20.0, 0.1).onChange(this._guiChanged);
        this._gui.add(this._effectController, "rayleigh", 0.0, 4, 0.001).onChange(this._guiChanged);
        this._gui
          .add(this._effectController, "mieCoefficient", 0.0, 0.1, 0.001)
          .onChange(this._guiChanged);
        this._gui
          .add(this._effectController, "mieDirectionalG", 0.0, 1, 0.001)
          .onChange(this._guiChanged);
        this._gui.add(this._effectController, "elevation", 0, 90, 0.1).onChange(this._guiChanged);
        this._gui.add(this._effectController, "azimuth", -180, 180, 0.1).onChange(this._guiChanged);
        this._gui.add(this._effectController, "exposure", 0, 1, 0.0001).onChange(this._guiChanged);
    }

    _guiChanged(){
        console.log(this._sky.material.uniforms);
        this._uniforms["turbidity"].value = this._effectController.turbidity;
        this._uniforms["rayleigh"].value = this._effectController.rayleigh;
        this._uniforms["mieCoefficient"].value = this._effectController.mieCoefficient;
        this._uniforms["mieDirectionalG"].value = this._effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - this._effectController.elevation);
        const theta = THREE.MathUtils.degToRad(this._effectController.azimuth);

        this._sun.setFromSphericalCoords(1, phi, theta);

        this._uniforms["sunPosition"].value.copy(this._sun);

        this._renderer.toneMappingExposure = this._effectController.exposure;
        //this._renderer.render(this._scene, this._camera);
    }
}