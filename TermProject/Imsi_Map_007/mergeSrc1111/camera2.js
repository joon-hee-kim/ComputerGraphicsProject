// camera.js
import * as THREE from '../../build/three.module.js';
/**
 * 게임 윈도우와 상호작용하는 3D 카메라를 생성합니다.
 * @param {HTMLElement} gameWindow - 카메라를 렌더링할 게임 윈도우 요소입니다.
 * @returns {Object} - 3D 카메라와 이벤트 핸들러 함수들을 포함하는 객체입니다.
 */
export function createCamera(camera) {
    
    // 각도를 라디안으로 변환하는 상수
    const DEG2RAD = Math.PI / 180;

    // 마우스 버튼 식별을 위한 상수
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    // 카메라 반지름의 최솟값과 최댓값
    const MIN_CAMERA_RADIUS = 50;
    const MAX_CAMERA_RADIUS = 1000;

    // 카메라의 상하 이동 각도의 최솟값과 최댓값
    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;

    // 카메라 회전 감도
    const ROTATION_SENSITIVITY = 0.5;

    // 카메라 줌 감도
    const ZOOM_SENSITIVITY = 0.02;

    // 카메라 패닝 감도
    const PAN_SENSITIVITY = -1;

    // 카메라 회전 축을 나타내는 상수 벡터
    const Y_AXIS = new THREE.Vector3(0, 1, 0);
    
    // 카메라의 초기 위치를 나타내는 원점(Vector3 객체)
    let cameraOrigin = new THREE.Vector3();
    cameraOrigin.set(250, 50, 300);
    // 카메라의 위치를 원점에서 얼마나 떨어뜨릴지 결정하는 변수 (극좌표계 반지름)
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;

    // 카메라의 수평 각도를 나타내는 변수 (마우스 드래그로 인한 좌우 회전에 사용)
    let cameraAzimuth = 0;

    // 카메라의 수직 각도를 나타내는 변수 (마우스 드래그로 인한 상하 이동에 사용)
    let cameraElevation = 90;

    // 마우스 왼쪽 버튼이 눌려있는지 여부를 나타내는 불리언 변수
    let isLeftMouseDown = false;

    // 마우스 오른쪽 버튼이 눌려있는지 여부를 나타내는 불리언 변수
    let isRightMouseDown = false;

    // 마우스 중간 버튼(휠)이 눌려있는지 여부를 나타내는 불리언 변수
    let isMiddleMouseDown = false;

    // 이전 프레임에서의 마우스 X 좌표를 저장하는 변수
    let prevMouseX = 0;

    // 이전 프레임에서의 마우스 Y 좌표를 저장하는 변수
    let prevMouseY = 0;

    // 초기 카메라 위치 설정
    updateCameraPosition();

    /**
     * 마우스 다운 이벤트 핸들러
     * @param {Event} event - 마우스 다운 이벤트 객체
     */
    function onMouseDown(event) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = true;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = true;
        }
    }

    /**
     * 마우스 업 이벤트 핸들러
     * @param {Event} event - 마우스 업 이벤트 객체
     */
    function onMouseUp(event) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = false;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        }
    }

    /**
     * 마우스 이동 이벤트 핸들러
     * @param {Event} event - 마우스 이동 이벤트 객체
     */
    function onMouseMove(event) {
        const deltaX = (event.clientX - prevMouseX);
        const deltaY = (event.clientY - prevMouseY);

        // 카메라 회전 처리
        if (isLeftMouseDown) {
            cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
            cameraElevation += (deltaY * ROTATION_SENSITIVITY);
            //console.log("camera Elevation: ", cameraElevation);
            cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
            updateCameraPosition();
        }

        // 카메라 패닝 처리
        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
            cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
            updateCameraPosition();
        }

        // 카메라 줌 처리
        if (isRightMouseDown) {
            cameraRadius += deltaY * ZOOM_SENSITIVITY;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    /**
     * 카메라 위치를 업데이트합니다.
     */
    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(250, 0, 300);
        camera.updateMatrix();
    }

    return {
        camera,
        onMouseDown,
        onMouseMove,
        onMouseUp,
    };
}

