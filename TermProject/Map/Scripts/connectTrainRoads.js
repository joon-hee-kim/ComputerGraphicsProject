// connectRoads.js
import * as THREE from '../../build/three.module.js';
import { createRoad } from './road.js';

export function connectRoads(scene, city) {
    const roadNetwork = [];
    const trainRoads = [];

    function connectClosestRoads() {
        // 이전 코드 유지...

        // Connect roads to trainRoads
        for (let i = 0; i < roadNetwork.length; i++) {
            const road = roadNetwork[i];
            const trainRoad = trainRoads[Math.floor(Math.random() * trainRoads.length)];

            // Connect road to trainRoad
            const connectionMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(road.x, 0.05, road.y),
                new THREE.Vector3(trainRoad.x, 0.05, trainRoad.y),
            ]);

            const connectionLine = new THREE.Line(geometry, connectionMaterial);
            scene.add(connectionLine);
        }
    }

    // Generate roads along the edges
    for (let x = 0; x < city.size; x += city.tileSize) {
        roadNetwork.push(createRoad(scene, x, 0));
        roadNetwork.push(createRoad(scene, x, city.size - city.tileSize));
    }

    for (let y = 0; y < city.size; y += city.tileSize) {
        roadNetwork.push(createRoad(scene, 0, y));
        roadNetwork.push(createRoad(scene, city.size - city.tileSize, y));
    }

    // Connect roads
    connectClosestRoads();

    return roadNetwork;
}
