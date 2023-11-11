// // camera.js
// import * as THREE from '../../build/three.module.js';
// /**
//  * 게임 윈도우와 상호작용하는 3D 카메라를 생성합니다.
//  * @param {HTMLElement} gameWindow - 카메라를 렌더링할 게임 윈도우 요소입니다.
//  * @returns {Object} - 3D 카메라와 이벤트 핸들러 함수들을 포함하는 객체입니다.
//  */
// export function createCamera(gameWindow) {
//     // 각종 상수 및 초기 카메라 설정
//     const DEG2RAD = Math.PI / 180;
//     const LEFT_MOUSE_BUTTON = 0;
//     const MIDDLE_MOUSE_BUTTON = 1;
//     const RIGHT_MOUSE_BUTTON = 2;
//     const MIN_CAMERA_RADIUS = 5;
//     const MAX_CAMERA_RADIUS = 50;
//     const MIN_CAMERA_ELEVATION = 30;
//     const MAX_CAMERA_ELEVATION = 180;
//     const ROTATION_SENSITIVITY = 0.5;
//     const ZOOM_SENSITIVITY = 0.02;
//     const PAN_SENSITIVITY = -0.01;
//     const Y_AXIS = new THREE.Vector3(0, 1, 0);

//     // 카메라 객체 및 초기 상태 변수
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     let cameraOrigin = new THREE.Vector3();
//     let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
//     let cameraAzimuth = 135;
//     let cameraElevation = 45;
//     let isLeftMouseDown = false;
//     let isRightMouseDown = false;
//     let isMiddleMouseDown = false;
//     let prevMouseX = 0;
//     let prevMouseY = 0;

//     // 초기 카메라 위치 설정
//     updateCameraPosition();

//     /**
//      * 마우스 다운 이벤트 핸들러
//      * @param {Event} event - 마우스 다운 이벤트 객체
//      */
//     function onMouseDown(event) {
//         if (event.button === LEFT_MOUSE_BUTTON) {
//             isLeftMouseDown = true;
//         }
//         if (event.button === MIDDLE_MOUSE_BUTTON) {
//             isMiddleMouseDown = true;
//         }
//         if (event.button === RIGHT_MOUSE_BUTTON) {
//             isRightMouseDown = true;
//         }
//     }

//     /**
//      * 마우스 업 이벤트 핸들러
//      * @param {Event} event - 마우스 업 이벤트 객체
//      */
//     function onMouseUp(event) {
//         if (event.button === LEFT_MOUSE_BUTTON) {
//             isLeftMouseDown = false;
//         }
//         if (event.button === MIDDLE_MOUSE_BUTTON) {
//             isMiddleMouseDown = false;
//         }
//         if (event.button === RIGHT_MOUSE_BUTTON) {
//             isRightMouseDown = false;
//         }
//     }

//     /**
//      * 마우스 이동 이벤트 핸들러
//      * @param {Event} event - 마우스 이동 이벤트 객체
//      */
//     function onMouseMove(event) {
//         const deltaX = (event.clientX - prevMouseX);
//         const deltaY = (event.clientY - prevMouseY);

//         // 카메라 회전 처리
//         if (isLeftMouseDown) {
//             cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
//             cameraElevation += (deltaY * ROTATION_SENSITIVITY);
//             cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
//             updateCameraPosition();
//         }

//         // 카메라 패닝 처리
//         if (isMiddleMouseDown) {
//             const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
//             const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
//             cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
//             cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
//             updateCameraPosition();
//         }

//         // 카메라 줌 처리
//         if (isRightMouseDown) {
//             cameraRadius += deltaY * ZOOM_SENSITIVITY;
//             cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
//             updateCameraPosition();
//         }

//         prevMouseX = event.clientX;
//         prevMouseY = event.clientY;
//     }

//     /**
//      * 카메라 위치를 업데이트합니다.
//      */
//     function updateCameraPosition() {
//         camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
//         camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
//         camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
//         camera.position.add(cameraOrigin);
//         camera.lookAt(cameraOrigin);
//         camera.updateMatrix();
//     }

//     // 카메라 및 이벤트 핸들러 함수를 반환
//     return {
//         camera
//     };
// }
