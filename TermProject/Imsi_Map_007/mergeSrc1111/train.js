import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";

let stationCounter = 2; // Station 순차적 ID를 위한 변수

export class Train {
  static passenger = [0, 0, 0, 0];
  static increase_passenger(index){
    this.passenger[index] ++;
  }
  static decrease_passenger(index){
    this.passenger[index] --;
  }
  static print_passenger(){
    console.log(this.passenger);
  }
  static get_pessenger(){
    return this.passenger;
  }
  constructor(scene, stationList, speed, isCircleLine, trainIndex) {
    
    if (Train.instance) {
      // If an instance already exists, return the existing instance
      return Train.instance;
    }
    this.trainIndex = trainIndex;
    this.scene = scene;
    this.stationList = stationList;
    this.speed = speed;
    this.isLastStation = 0;
    this.deltaindex = 1;
    this.isCircleLine = isCircleLine;
    // this.isTrainArrive = false;
    
    // console.log(this.stationList, this.speed, this.isCircleLine);
    // console.log(this.stationList.length);
    this.init();
  }

  init() {
    stationCounter = 2;
    const loader = new GLTFLoader();

    // 이제 Promise를 사용하여 GLTF 모델 로딩을 대기합니다.
    const loadModel = new Promise((resolve) => {
      loader.load("./LowpolyModel/train/scene.gltf", (gltf) => {
        const trainModel = gltf.scene;
        trainModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        trainModel.rotation.x = Math.PI / 180;
        trainModel.rotation.y = Math.PI / 2;
        trainModel.scale.set(1, 1, 1);
        this.scene.add(trainModel);

        this.trainModel = trainModel; // trainModel을 Train 클래스 속성으로 설정
        setupLights(this.scene, trainModel);
        // console.log("train start 1");
        resolve(); // Promise를 해결하여 모델이 로드되었음을 알림
      });
    });

    // GLTF 모델이 로드된 후에 update 메서드 호출
    loadModel.then(() => {
      const startStation = this.stationList[0];
      // console.log(startStation.position);
      if (startStation) {
        this.position = { x: startStation.x, y: 0, z : startStation.y};
        this.currentStationIndex = 0;
        this.trainModel.position.set(this.position.x, this.position.y, this.position.z);
      } else {
        console.error("No station available for the train.");
      }

      this.position = { x: startStation.x, y: 0, z : startStation.y};
      this.currentStationIndex = 0;
      this.trainModel.position.set(this.position.x, this.position.y, this.position.z);

      // 기차 초기 위치 설정 후 애니메이션 시작
      this.start();
      
      // console.log("train start 2");
      // console.log(this.trainModel.position);
    });
  }

  update() {
    // console.log(this.currentStationIndex);
    const StationID = `Station${stationCounter}`; // StationID를 Station1, Station2, ...로 설정
    let currentStation;
    let nextStation;

    if(this.isCircleLine){
      currentStation = this.stationList[this.currentStationIndex % this.stationList.length];
      nextStation = this.stationList[(this.currentStationIndex + this.deltaindex) % this.stationList.length];
    }
    else{
      currentStation = this.stationList[this.currentStationIndex];
      nextStation = this.stationList[(this.currentStationIndex + this.deltaindex)];
    }
    // console.log(" is Circle?? : ", this.isCircleLine);
    // console.log(" currentStation : ", currentStation);
    // console.log(" nextStation    : ", nextStation);

    // console.log("current station index : ", this.currentStationIndex);

    // 열차가 다음 역으로 이동할 수 있는 경우에만 출발역의 ​​열차 수 감소
    if (currentStation && currentStation.train > 0 && nextStation) {
      currentStation.train -= 1; // Decrease the train count
      // console.log(
      //   `People leaving station at (${currentStation.x}, ${currentStation.y}): ${currentStation.train}`
      // );
      // updateInfoHTML({
      //   mark: StationID + " Leaving Train",
      //   x: currentStation.x,
      //   y: currentStation.y,
      //   train: currentStation.train,
      // });
    }

    if (nextStation) {
      const targetX = nextStation.x;
      const targetY = 0;
      const targetZ = nextStation.y;

      const direction = new THREE.Vector3(targetX, targetY, targetZ)
      .sub(this.trainModel.position)
      .normalize();
  
    // Rotate the train to face the direction vector
      this.trainModel.rotation.y = Math.atan2(direction.x, direction.z);
      
      const distance = this.trainModel.position.distanceTo(
        new THREE.Vector3(targetX, targetY, targetZ)
      );

      if (distance < this.speed) {
        // Update the train's position to the next station
        this.trainModel.position.set(targetX, targetY, targetZ);
        if(this.isCircleLine){
          this.currentStationIndex = (this.currentStationIndex + this.deltaindex)%this.stationList.length;
        }
        else{
          this.currentStationIndex += this.deltaindex;
        }
        // Increase train count at the arriving station
        nextStation.train += 1; // Increase the train count
        // console.log(
        //   `Train arriving at station (${nextStation.x}, ${nextStation.y}): ${nextStation.train}`
        // );

        // updateInfoHTML({
        //   mark: StationID + " Arriving Train",
        //   x: nextStation.position.x,
        //   y: nextStation.position.y,
        //   train: nextStation.train,
        // });

        this.stop();
        this.stationList[this.currentStationIndex].isTrainArrive[this.trainIndex] = true;
        // console.log(this.stationList[this.currentStationIndex].isTrainArrive);
        setTimeout(() => {
          this.start();

          this.stationList[this.currentStationIndex].isTrainArrive [this.trainIndex] = false;
          // console.log(this.stationList[this.currentStationIndex].isTrainArrive);
          //console.log(this.stationList[this.currentStationIndex]);
        }, 1000);

      } else {
        // 열차를 다음역으로 이동시킴.
        const direction = new THREE.Vector3(targetX, targetY, targetZ)
          .sub(this.trainModel.position)
          .normalize()
          .multiplyScalar(this.speed);

        this.trainModel.position.add(direction);
      }
    }    
    else{
      // 비원형 노선에 대한 라인 끝을 처리
        this.deltaindex *= -1; // 역방향으로 이동
  }
}

  start() {
    this.isAnimating = true;
    this.animate();
  }

  stop() {
    this.isAnimating = false;
  }

  animate() {
    if (this.isAnimating) {
      this.update();
      requestAnimationFrame(() => this.animate());
    }
  }
}

let prevX = null;
let prevY = null;
let prevMark = null;

function setupLights(scene, trainModel) {
  const light = new THREE.PointLight( 0xff9900, 1000, 100 );
  light.position.copy(trainModel.position);
  light.position.y = 4;
  light.castShadow = true; // default false
  scene.add( light );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 4; // default

  //Create a helper for the shadow camera (optional)
  const helper = new THREE.CameraHelper( light.shadow.camera );
  scene.add( helper );
  //trainModel.add(light); // 열차 모델의 자식으로 추가
  trainModel.add(light);
}