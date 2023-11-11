// Building.js
import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

// 빌딩 모델의 경로와 크기 정보
const buildingModels = [
  {
    path: "./LowpolyModel/city_building/scene.gltf",// 제일 높은 모델
    scale: {x: 0.003, y: 0.0025, z: 0.002},
  },
  { path: "./LowpolyModel/modern_apartment/scene.gltf", //
  scale: {x: 0.5, y: 0.7, z: 0.5} },
  {path: "./LowpolyModel/whitehall_building/scene.gltf",  //주황 모델
  scale: {x: 0.2, y: 0.3, z: 0.4}},
  {path: "./LowpolyModel/storefront_lowpoly_house/scene.gltf", // 빨간 모델
  scale: { x: 3.5, y: 5, z: 3.5}},
];

export function createBuilding(scene, x, y, buildingList, modelIndex) {
  // 정수로 위치 조정
  const roundX = Math.round(x);
  const roundY = Math.round(y);

  // 이미 해당 위치에 빌딩이 있는지 확인
  if (isBuildingAtLocation(buildingList, roundX, roundY)) {
    // console.log(roundX, roundY, "위치에 이미 빌딩이 있습니다.");
    // console.log(buildingList);
    return null; // 빌딩 생성 실패를 나타내기 위해 null 반환
  }

  // 랜덤한 빌딩 모델 선택
  const randomModelIndex = Math.floor(Math.random() * buildingModels.length);
  const selectedModel = buildingModels[modelIndex];

  // 빌딩 모델 로드
  const loader = new GLTFLoader();
  let buildingMesh;

  loader.load(selectedModel.path, (gltf) => {
    buildingMesh = gltf.scene;
    buildingMesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
    // 빌딩 메쉬의 위치, 회전, 크기 설정
    buildingMesh.rotation.x = -Math.PI / 180;
    buildingMesh.scale.set(
      selectedModel.scale.x,
      selectedModel.scale.y,
      selectedModel.scale.z
    );
    buildingMesh.position.set(roundX, 0.0001, roundY);

    // 씬에 빌딩 메쉬 추가
    scene.add(buildingMesh);

    // console.log(roundX, roundY, "위치에 빌딩 생성됨");

    // 생성된 빌딩 정보 반환
    const buildingInfo = {
      randomModelIndex,
      mesh: buildingMesh,
      x: roundX,
      y: roundY,
    };
    // console.log(buildingList);
    buildingList.push(buildingInfo); // 새로운 빌딩을 목록에 추가
    // console.log("buildingList: ", buildingList);
  });

  return null; // 비동기로 모델이 로드되기를 기다리는 동안 null 반환
}

function isBuildingAtLocation(buildingList, x, y) {
  const buildingSize = 2; // 빌딩의 크기
  return buildingList.some((building) => {
    const isOverlapX = Math.abs(x - building.x) < buildingSize;
    const isOverlapY = Math.abs(y - building.y) < buildingSize;
    return isOverlapX && isOverlapY;
  });
}