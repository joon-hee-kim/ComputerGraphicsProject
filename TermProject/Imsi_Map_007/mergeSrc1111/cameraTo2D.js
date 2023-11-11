// camera.js
import * as THREE from '../../build/three.module.js';

export function cameraTo2D(camera) {
    // 초기 카메라 위치 설정
    updateCameraPosition();

    /**
     * 카메라 위치를 업데이트합니다.
     */
    function updateCameraPosition() {
        camera.position.set(200, 500, 200);
        console.log(camera.position);
    }
    return {
        camera
    };
}

