/**import * as THREE from '../../build/three.module.js';

export function createCity(size, index) {
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
    const colorList = [0xf55142, 0x4542f5, 0x42f542, 0xdeeb34, 0xaceb34, 0x34ebdc];
    // Three.js에서 PlaneGeometry를 사용하여 도시를 생성합니다.
    console.log("color", index, colorList[index]);
    const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
    const material = new THREE.MeshStandardMaterial({
        color: colorList[index], // 좀 더 진한 회색
        roughness: 0.8, // 표면 거칠기
        metalness: 0.1, // 금속적인 정도
    });
    const cityMesh = new THREE.Mesh(geometry, material);
    cityMesh.rotateX(-Math.PI / 2); // 평면을 바닥으로 향하도록 회전


    // size 및 data 속성을 포함하는 도시 객체를 반환합니다.
    const cityObject = {
        size,
        data,
        mesh: cityMesh,
        isMapObject: true,
    };

    return cityObject;
}  */

import * as THREE from '../../build/three.module.js';

export function createCity(size) {
    const data = [];

    initialize();

    function initialize() {
        const column = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                column.push({ type: 'empty' });                
            }
            data.push(column);
        }

        return data;
    }
    // Three.js에서 PlaneGeometry를 사용하여 도시를 생성합니다.
    const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x77dd77,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide, // 이 부분을 추가
        transparent: true, // 추가
        opacity: 1.0, // 추가
    });
    const cityMesh = new THREE.Mesh(geometry, material);
    cityMesh.receiveShadow = true;
    cityMesh.rotateX(-Math.PI / 2); // 평면을 바닥으로 향하도록 회전


    // size 및 data 속성을 포함하는 도시 객체를 반환합니다.
    const cityObject = {
        size,
        data,
        mesh: cityMesh,
        isMapObject: true,
    };

    return cityObject;
} 