import * as THREE from '../../build/three.module.js';
export class npc{
    constructor(scene, startbuilding, dstbuilding, stationList){
        this.speed = 0.3;
        this.scene = scene;
        this.startbuilding = startbuilding;
        this.dstbuilding = dstbuilding;
        this.stationList = stationList;
        this.startstation = this.stationList[this.startbuilding.cityinfo.index];
        console.log(this.startstation);
        this.dststation = this.stationList[this.dstbuilding.cityinfo.index];
        this.arriveStartStation = false;
        this.rideontrain = false;
        this.arriveDstStation = false;
        this.arriveDstBuilding = false;

        this.haveride = 0;
        // console.log("dstbuilding",dstbuilding);
        this.init();
    }

    init(){
        const x = this.startbuilding.x;
        const y = this.startbuilding.y;
        const colorList = [0xf55142, 0x4542f5, 0x42f542, 0xdeeb34, 0xaceb34, 0x34ebdc];
        const npcMaterial = new THREE.MeshStandardMaterial({
            color : colorList[this.dstbuilding.cityinfo.index],
            roughness : 0.8,
            metalness : 0.8,
        });

        const npcGeometry = new THREE.BoxGeometry(5, 5, 5);

        // npc 메쉬 생성
        const npcMesh = new THREE.Mesh(npcGeometry, npcMaterial);
        
        // npc 메쉬의 크기 및 회전
        npcMesh.rotation.x = -Math.PI / 2;
        npcMesh.renderOrder = 1;
        npcMesh.position.set(x, 1, y);

        // 맵 객체 여부를 나타내는 속성 추가
        npcMesh.isMapObject = true;

        // 도로 메쉬를 씬에 추가
        this.scene.add(npcMesh);
        this.mesh = npcMesh
        console.log("NPC created!", x, y);

        // 생성된 도로 정보 반환

        this.animate();
        return { mesh: npcMesh, x: x, y: y };
    }

    gotostartstation(){
        const targetX = this.startstation.x;
        const targetY = 1;
        const targetZ = this.startstation.y;
        this.move(targetX, targetY, targetZ);
        const distance = this.mesh.position.distanceTo(new THREE.Vector3(targetX, targetY, targetZ));
        if(distance - 5 < this.speed ){
            this.arriveStartStation = true;
        }
    }

    gotodstbuilding(){
        const targetX = this.dstbuilding.x;
        const targetY = 1;
        const targetZ = this.dstbuilding.y;
        this.move(targetX, targetY, targetZ);
        const distance = this.mesh.position.distanceTo(new THREE.Vector3(targetX, targetY, targetZ));
        if(distance - 2 < this.speed ){
            this.arriveDstBuilding = true;
        }
    }

    move(targetX, targetY, targetZ) {
        // npc의 속도 설정
    
        // npc가 이동할 방향 설정
        const direction = new THREE.Vector3(targetX, targetY, targetZ)
            .sub(this.mesh.position)
            .normalize()
            .multiplyScalar(this.speed);
        // npc를 이동시키는 반복문
        this.mesh.position.add(direction);
    }

    ridetrain(){
        this.mesh.visible = false;
        this.rideontrain = true;
    }

    getoftrain(){
        this.mesh.position.set(this.dststation.x, 1, this.dststation.y);
        this.mesh.visible = true;
        this.arriveDstStaition = true;
    }

    animate(){
        if(!this.arriveStartStation){
            this.gotostartstation();
        }
        if(this.arriveStartStation && this.startstation.trainarrived && this.haveride == 0){
            this.ridetrain();
            this.haveride = 1;
            this.arriveStartStation = false;
        }
        if(this.rideontrain && this.dststation.trainarrived){
            console.log("arrive dststation");
            this.rideontrain = false;
            this.getoftrain();
        }
        if(this.arriveDstStaition){
            this.gotodstbuilding();
        }
        if(this.arriveDstBuilding){
            this.scene.remove(this.mesh);
        }
        requestAnimationFrame(() => this.animate());
    }

    printinfo(){
        console.log("start : ", this.startbuilding, "dst : ", this.dstbuilding);
    }
}