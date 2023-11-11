// Station.js

import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";
import { Train } from "./train.js";

let stationCounter = 1; // Station 순차적 ID를 위한 변수

export function createStation(scene, x, y, StationList, index) {
  // 정수로 위치 조정
  const roundX = Math.round(x);
  const roundY = Math.round(y);

  //이미 해당 위치에 철도역이 있는지 확인
  if (isStationAtLocation(StationList, roundX, roundY)) {
    console.log(roundX, roundY, "위치에 이미 철도가 있습니다.");
    // console.log(StationList);
    return null; // 역 생성 실패를 나타내기 위해 null 반환
  }

  //첫 번째로 생성된 역인지 확인
  const isFirstTile = StationList.length === 0;

  // 연결된 철도를 그리기 위한 머티리얼 및 지오메트리
  const midPoint = new THREE.Vector3((roundX + x) / 2, 0.1, (roundY + y) / 2);
  const ConnectionMaterial = new THREE.LineBasicMaterial({ color: 0x548769 });
  const ConnectionGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(x, 0.1, y),
    midPoint,
    new THREE.Vector3(roundX, 0.1, roundY),
  ]);

  // 연결된 철도를 나타내는 라인 메쉬 생성
  const ConnectionLine = new THREE.Line(ConnectionGeometry, ConnectionMaterial);
  scene.add(ConnectionLine);

  const modelPaths = [
    "./LowpolyModel/railway_station/scene.gltf",
    // Add more model paths as needed
  ];

  // GLTF 로더 생성
  const loader = new GLTFLoader();
  let models = [];

  // Counter to keep track of loaded models
  let modelsLoaded = 0;

  modelPaths.forEach((modelPath, index) => {
    loader.load(
      modelPath,
      (gltf) => {
        // Model loaded callback
        const model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        //model.scale.set(5, 3.5, 5);
        model.scale.set(30, 30, 30);
        model.rotation.x = Math.PI / 180;
        //model.rotation.y = Math.PI;
        model.position.set(roundX, 17, roundY);
        models.push(model);
        scene.add(model);

        modelsLoaded++;

        // Check if all models are loaded
        if (modelsLoaded === modelPaths.length) {
          // All models loaded, proceed with the rest of the code

          // ... (previous code)

          // Rendering loop start
          //animate();
        }
      },
      undefined,
      (error) => {
        // console.error("Error loading GLTF model", error);
      }
    );
  });

  // console.log(roundX, roundY, "위치에 철도 생성됨");

  // 생성된 철도 정보 반환
  const StationInfo = {
    mesh: ConnectionLine,
    x: roundX,
    y: roundY,
    wait: 0,
    isTrainArrive: [false,false,false,false],
    index : index,
    connectedRail : []
  };
  StationList.push(StationInfo); // 새로운 철도를 목록에 추가
  // console.log("Station List: ", StationList);;

  stationCounter++;

  // 이전 철도와 연결
  if (!isFirstTile) {
    const prevStation = StationList[StationList.length - 2];
    if (prevStation.mesh) {
      connectStations(ConnectionLine, prevStation.mesh);
    }

    // 철도가 생성되면 Train을 시작하는 코드 추가
    // startTrainAnimation(scene, StationList);
  }

  return StationInfo;
}

function isStationAtLocation(StationList, x, y) {
  const StationSize = 1; // 철도의 크기
  // console.log("list" + StationList);
  return StationList.some((Station) => {
    const isOverlapX = Math.abs(x - Station.x) < StationSize;
    const isOverlapY = Math.abs(y - Station.y) < StationSize;
    return isOverlapX && isOverlapY;
  });
}

// 두 철도를 연결하는 함수
function connectStations(station1, station2) {
  const point1 = new THREE.Vector3().copy(station1.position);
  const point2 = new THREE.Vector3().copy(station2.position);

  // 여기에 철도를 연결하는 코드를 추가하세요.
  // 예를 들어, point1과 point2를 연결하는 방법으로 선을 그립니다.
  const ConnectionMaterial = new THREE.LineBasicMaterial({ color: 0x548769 });
  const ConnectionGeometry = new THREE.BufferGeometry().setFromPoints([
    point1,
    point2,
  ]);

  const ConnectionLine = new THREE.Line(ConnectionGeometry, ConnectionMaterial);
  station1.parent.add(ConnectionLine);
}

// Train을 시작하는 함수
function startTrainAnimation(scene, stationList) {
  const trainSpeed = 0.4; // 원하는 속도로 조절
  const train = new Train(scene, stationList, trainSpeed);
  train.start(); // Train 애니메이션 시작
}

function animate() {}