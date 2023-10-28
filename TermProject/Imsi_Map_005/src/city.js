// City.js

import * as THREE from '../../build/three.module.js';

export function createCity(size) {
    const data = [];

    initialize();

    function initialize() {
        for (let x = 0; x < size; x++) {
            const column = [];
            
            for (let y = 0; y < size; y++) {
                const tile = { x, y, isMapObject: true };
                column.push(tile);
            }
            
            data.push(column);
        }
    }

    // Three.js에서 PlaneGeometry를 사용하여 도시를 생성합니다.
    const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const cityMesh = new THREE.Mesh(geometry, material);
    cityMesh.rotateX(-Math.PI / 2); // 평면을 바닥으로 향하도록 회전

    // size 및 data 속성을 포함하는 도시 객체를 반환합니다.
    return {
        size,
        data,
        mesh: cityMesh,
        isMapObject: true
    };
}
