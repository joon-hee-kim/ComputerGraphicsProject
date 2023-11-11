import * as THREE from "../../build/three.module.js";
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";
import { Train } from "./train.js";

export class NewNPC {
  static NPC_count = 0;
  static get_NPC_count(){
    return this.NPC_count;
  }
  constructor(scene, camera, renderer, buildingList, stationList, npcList) {
    this.npcList = npcList;
    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;
    this._model;
    this._speed = 4;
    this._buildingList = buildingList;
    this._stationList = stationList;
    this._meshArray = [
      "./Model/characters/Purple.gltf",
      "./Model/characters/Yellow.gltf",
      "./Model/characters/Green.gltf",
      "./Model/characters/Skyblue.gltf",
      "./Model/characters/Pink.gltf",
    ];

    this._startBuildingIndex;
    this._endBuildingIndex;
    this._nearStationIndex;
    this._nearStationPosition;
    this._startBuildingToNearStationRadian;

    this._endStationIndex;
    this._endStationPosition;    
    //
    this._arriveAtStartStation = false;
    this._rideOnTrain = false;
    this._arriveAtEndStation = false;
    this._arriveAtEndBuilding = false;

    this.path;
    this.route;
    this.currentIndex = 0;
    
    this.canArriveAt = false;

    this.npcList.push(this);

    this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));
    this._decideModelAndDecideRoot();
  }
  
  
  updateRailInfo(rail_info){
    const route = rail_info;
    const start = this._nearStationIndex;
    const target = this._endStationIndex;
    let startInRoute = false;

    let table = new Array(this._stationList.length).fill([]);
    for(let i = 0; i<table.length; i++){
        table[i] = new Array(this._stationList.length).fill(0);
    }

    for(let i = 0; i<table.length; i++){
        for(let j = 0; j<table.length; j++){
            if(i!=j){
                const connectInfo = {
                    length : Infinity,
                    rail : [],
                    path : []
                }
                table[i][j] = connectInfo;
            }
            else{
                const connectInfo = {
                    length : 0,
                    rail : [],
                    path : []
                }
                table[i][j] = connectInfo;
            }
        }
    }
    for(let i = 0; i<route.length; i++){
        for(let j = 0; j<route[i].length; j++){
            if(start == route[i][j]){
                startInRoute = true;
            }
        }
    }
    if(!startInRoute){
      return;
    }
    for(let i = 0; i<route.length; i++){
        for(let j = 0; j<route[i].length; j++){
            for(let k = j+1; k<route[i].length; k++){
                const connectInfo = {
                    length : 1,
                    rail : [i],
                    path : []
                }
                table[route[i][j]][route[i][k]] = connectInfo;  
                table[route[i][k]][route[i][j]] = connectInfo; 
            }
        }
    }

    let d = table[start];

    let v = new Array(this._stationList.length).fill(false);

    v[start] = true;
    for(let i = 0; i<this._stationList.length-2; i++){
        let current = getSmallIndex(this._stationList.length);
        v[current] = true;
        for(let j = 0; j<this._stationList.length; j++){
            if(!v[j]){
                if(d[current].length + table[current][j].length < d[j].length){
                    d[j].length = d[current].length + table[current][j].length;
                    d[j].rail = d[current].rail.concat(table[current][j].rail);
                    d[j].path = d[current].path.concat(current);
                }
            }
        }
    }
    if(d[target].length == Infinity){
        this.canArriveAt = false;
    }
    else{
        this.canArriveAt = true;
        d[target].path.unshift(start);
        d[target].path.push(target);
        console.log(d[target]);
        this.path = d[target].path;
        this.route = d[target].rail;
    }

    function getSmallIndex(n){
        let min = Infinity;
        let index = 0;
        for(let i = 0; i<n; i++){
            if(d[i].length < min && !v[i]){
                min = d[i].length;
                index = i;
            }
        }
        return index;
    }
  }


  _decideModelAndDecideRoot() {
    // 모델 메쉬 결정하고 시작 빌딩 결정
    var minDistanceToNearStation = Infinity;
    this._modelIndex = Math.floor(Math.random() * this._meshArray.length);
    this._startBuildingIndex = Math.floor(
      Math.random() * this._buildingList.length
    );
    // this._startBuildingIndex = 2;
    this._buildingPosition = new THREE.Vector3(
      this._buildingList[this._startBuildingIndex].x,
      0,
      this._buildingList[this._startBuildingIndex].y
    );

    // 시작 빌딩과 가까운 역의 인덱스 찾기
    for (let i = 0; i < this._stationList.length; i++) {
      const stationPosition = new THREE.Vector3(
        this._stationList[i].x,
        // this._stationList[i].mesh.position.y,
        0,
        this._stationList[i].y
      );
      const distance = this._buildingPosition.distanceTo(stationPosition);

      if (distance < minDistanceToNearStation) {
        minDistanceToNearStation = distance;
        this._nearStationIndex = i;
      }
    }

    do{
      this._endBuildingIndex = Math.floor(
        Math.random() * this._buildingList.length
      );
      this._endBuildingPosition = new THREE.Vector3(
        this._buildingList[this._endBuildingIndex].x,
        0,
        this._buildingList[this._endBuildingIndex].y
      );
      var minDistanceToEndStation = Infinity;
      for(let i = 0; i<this._stationList.length; i++){
        const stationPosition = new THREE.Vector3(
        this._stationList[i].x,
        0,
        this._stationList[i].y
        );
        const distance = this._endBuildingPosition.distanceTo(stationPosition);

        if(distance < minDistanceToEndStation){
          minDistanceToEndStation = distance;
          this._endStationIndex = i;
        }
      }
    }while(this._endStationIndex == this._nearStationIndex);

    // this.path.push(this._nearStationIndex);
    // this.path.push(this._endStationIndex);

    console.log("nearStationIndex : ", this._nearStationIndex, "endStationIndex : ", this._endStationIndex);

    // 가까운 역의 위치
    this._nearStationPosition = new THREE.Vector3(
      this._stationList[this._nearStationIndex].x,
      0,
      this._stationList[this._nearStationIndex].y
    );

    this._endStationPosition = new THREE.Vector3(
      this._stationList[this._endStationIndex].x,
      0,
      this._stationList[this._endStationIndex].y
    );
      // console.log(this._endStationPosition);
    // 빌딩과 가까운 역과의 각도
    this._startBuildingToNearStationRadian = Math.atan2(
      this._buildingPosition.x - this._nearStationPosition.x,
      this._buildingPosition.z - this._nearStationPosition.z
    );
    // console.log("라디안: " + this._startBuildingToNearStationRadian);
    this._endStationToEndBuildingRadian = Math.atan2(
      this._endStationPosition.x - this._endBuildingPosition.x,
      this._endStationPosition.z - this._endBuildingPosition.z
    )


    // 모델 load
    new GLTFLoader().load(this._meshArray[this._modelIndex], (gltf) => {
      // console.log("npc 로드 중이니?");
      this._model = gltf.scene;
      const model = gltf.scene;
      model.scale.set(80, 80, 80);

      // 모델 빌딩 위치에 생성
      model.position.set(
        this._buildingList[this._startBuildingIndex].x,
        0,
        this._buildingList[this._startBuildingIndex].y
      );

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

      this._scene.add(this._model);

      this._mixer = mixer; // 애니메이션 play하려면 mixer 객체를 프레임마다 업데이트 해줘야 함!
      this._animationMap = animationsMap;
      this._currentAnimationAction = this._animationMap["Armature|Walk"];
      this._currentAnimationAction.play();
      this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));
    });
  }

  gotostartstation(time) {
    time *= 0.001; // second unit
    if (this._mixer) {
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);

      const rotateQuaternion = new THREE.Quaternion();
      rotateQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this._startBuildingToNearStationRadian + Math.PI
      );

      this._model.quaternion.rotateTowards(
        rotateQuaternion,
        THREE.MathUtils.degToRad(20)
      );

      // 모델이 걷는 부분
      // console.log(this._buildingPosition, this._nearStationPosition);
      const walkDirection = new THREE.Vector3().subVectors(
        this._nearStationPosition,
        this._buildingPosition
      );
      walkDirection.y = 0;
      walkDirection.normalize();

      const test = new THREE.Vector3().subVectors(
        this._model.position,
        this._nearStationPosition
      );
      // console.log(test);
      if (Math.abs(test.x) < 3.0 && Math.abs(test.z) < 5.0) {
        // this._model.visible = false;
        this._arriveAtStartStation = true;
        this._stationList[this._nearStationIndex].wait ++;
        console.log("im arrive!", console.log(this._stationList[this._nearStationIndex]));
      } else {
        const moveX = walkDirection.x * (this._speed * deltaTime);
        const moveZ = walkDirection.z * (this._speed * deltaTime);

        this._model.position.x += moveX;
        this._model.position.z += moveZ;
      }
    }

    // console.log(time)
    this._previousTime = time;
  }
  // _endStationIndex
  gotoendbuilding(time) {
    time *= 0.001; // second unit
    if (this._mixer) {
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);
      // console.log(time);

      const rotateQuaternion = new THREE.Quaternion();
      rotateQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this._endStationToEndBuildingRadian + Math.PI
      );

      this._model.quaternion.rotateTowards(
        rotateQuaternion,
        THREE.MathUtils.degToRad(20)
      );

      // 모델이 걷는 부분
      // console.log(this._buildingPosition, this._nearStationPosition);
      const walkDirection = new THREE.Vector3().subVectors(
        this._endBuildingPosition,
        this._endStationPosition
      );
      walkDirection.y = 0;
      walkDirection.normalize();

      const test = new THREE.Vector3().subVectors(
        this._model.position,
        this._endBuildingPosition
      );
      // console.log(test);
      if (Math.abs(test.x) < 3.0 && Math.abs(test.z) < 5.0) {
        this._model.visible = false;
        this._arriveAtEndBuilding = true;
        // console.log("im arrive!", console.log(this._stationList[this._nearStationIndex]));
      } else {
        const moveX = walkDirection.x * (this._speed * deltaTime);
        const moveZ = walkDirection.z * (this._speed * deltaTime);

        this._model.position.x += moveX;
        this._model.position.z += moveZ;
        // console.log("deltatime : ", deltaTime);
        // console.log(moveX, moveZ);
      }
    }
    this._previousTime = time;

    // this._previousTime2 = time;
  }

  render(time) {
    if(!this._arriveAtStartStation){
      this.gotostartstation(time);
    }
    if(this.canArriveAt && this._arriveAtStartStation && this._stationList[this._nearStationIndex].isTrainArrive[this.route[this.currentIndex]] && this.currentIndex == 0){
      this._model.visible = false;
      this._stationList[this._nearStationIndex].wait --;
      this._rideOnTrain = true; 
      Train.increase_passenger(this.route[this.currentIndex]);
      Train.print_passenger();
      this.currentIndex ++;     
    }
    if(this.canArriveAt && !this._arriveAtEndStation){
      if(this._rideOnTrain && 
        this._stationList[this.path[this.currentIndex]].isTrainArrive[this.route[this.currentIndex - 1]] && 
        !this._arriveAtEndStation){
          console.log("여기서 내립니다 ", this.path[this.currentIndex]);
          this._stationList[this.path[this.currentIndex]].wait ++;
          const transferStation = this._stationList[this.path[this.currentIndex]];
          this._model.position.set(
            transferStation.x,
            0,
            transferStation.y
          );
          Train.decrease_passenger(this.route[this.currentIndex - 1]);
          Train.print_passenger();
          this._model.visible = true;

          this._rideOnTrain = false;
          

          if(this.currentIndex + 1 == this.path.length){
            this._arriveAtEndStation = true;
            this._stationList[this.path[this.currentIndex]].wait --;
            this._previousTime = time * 0.001;
          }
      }
      console.log(this._stationList[this.path[this.currentIndex]]);
      if(!this._arriveAtEndStation && this.currentIndex < this.route.length){
        if(!this._rideOnTrain&&
          this._stationList[this.path[this.currentIndex]].isTrainArrive[this.route[this.currentIndex]]){
            Train.increase_passenger(this.route[this.currentIndex]);
            Train.print_passenger();
            this.currentIndex++;
            console.log("여기서 탑니다.", this.path[this.currentIndex]);
            this._stationList[this.path[this.currentIndex]].wait --;
            this._model.visible = false;
            this._rideOnTrain = true;
          }
        }
      }


    // if(this._rideOnTrain && this._stationList[this._endStationIndex].isTrainArrive[this.route[this.currentIndex]]){   
    //   this._model.position.set(
    //     this._endStationPosition.x,
    //     this._endStationPosition.y,
    //     this._endStationPosition.z
    //   );
    //   this._model.visible = true;
    //   this._rideOnTrain = false;
    //   this._arriveAtEndStation = true;
    //   this._previousTime = time * 0.001;
    // }




    if(this._arriveAtEndStation && !this._arriveAtEndBuilding){
      this.gotoendbuilding(time);
      // console.log("asdfasdfa");
    }
    if (this._arriveAtEndBuilding) {
      // 모델을 scene에서 제거합니다.
      this._scene.remove(this._model);
    
      // 모델을 메모리에서 제거합니다.
      this._model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // 모델의 자식 객체 중 Mesh인 경우 메모리에서 제거합니다.
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    
      // 모델 변수를 null로 설정하여 참조를 해제합니다.
      this._model = null;
      cancelAnimationFrame(this._AnimRequestFrame);
      return;
    }
    
    
    // console.log(this._stationList[this._nearStationIndex].isTrainArrive);
    this._AnimRequestFrame = requestAnimationFrame(this.render.bind(this));
  }
}
