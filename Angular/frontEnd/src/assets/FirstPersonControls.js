const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_E = 69;

class FirstPersonControls {
    constructor(camera, domElement) {
        this.domElement = domElement || document.body;
        this.isLocked = false;
        this.camera = camera;
        // 初始化camera, 将camera放在pitchObject正中央
        camera.rotation.set(0, 0, 0);
        camera.position.set(0, 0, 0);
        // 将camera添加到pitchObject, 使camera沿⽔平轴做旋转, 并提升pitchObject的相对⾼度
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);
        this.pitchObject.position.y = 10;
        // 将pitObject添加到yawObject, 使camera沿竖直轴旋转
        // 为什么要将camera封装进pitchObject，再将pitchObject封装进yawObject？
        this.yawObject = new THREE.Object3D();
        this.yawObject.add(this.pitchObject);

        // 初始化移动状态
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }
    onPointerlockChange() {
        console.log(this.domElement);
        this.isLocked = document.pointerLockElement === this.domElement;
    }
    onPointerlockError() {
        console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
    }
    onMouseMove(event) {
        if (this.isLocked) {
            let movementX = event.movementX || event.mozMovementX ||
                event.webkitMovementX || 0;
            let movementY = event.movementY || event.mozMovementY ||
                event.webkitMovementY || 0;
            this.yawObject.rotation.y -= movementX * 0.002;
            this.pitchObject.rotation.x -= movementY * 0.002;
            // 这⼀步的⽬的是什么？
            this.pitchObject.rotation.x = Math.max(- Math.PI / 2, Math.min(Math.PI /
                2, this.pitchObject.rotation.x));
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEY_W: this.moveForward = true; break;
            case KEY_A: this.moveLeft = true; break;
            case KEY_S: this.moveBackward = true; break;
            case KEY_D: this.moveRight = true; break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case KEY_W: this.moveForward = false; break;
            case KEY_A: this.moveLeft = false; break;
            case KEY_S: this.moveBackward = false; break;
            case KEY_D: this.moveRight = false; break;
        }
    }

    update(delta) {
        // 移动速度
        const moveSpeed = 100;
        // 确定移动⽅向
        let direction = new THREE.Vector3();
        direction.x = Number(this.moveRight) - Number(this.moveLeft);
        direction.z = Number(this.moveBackward) - Number(this.moveForward);
        direction.y = 0;
        // 移动⽅向向量归⼀化，使得实际移动的速度⼤⼩不受⽅向影响
        if (direction.x !== 0 || direction.z !== 0) {
            direction.normalize();
        }
        // 移动距离等于速度乘上间隔时间delta
        if (this.moveForward || this.moveBackward) {
            this.yawObject.translateZ(moveSpeed * direction.z * delta);
        }
        if (this.moveLeft || this.moveRight) {
            this.yawObject.translateX(moveSpeed * direction.x * delta);
        }
    }

    connect() {
        this.domElement.addEventListener('click', this.domElement.requestPointerLock);
        // 在函数后⾯添加bind(this)的⽬的是什么？
        document.addEventListener('pointerlockchange',
            this.onPointerlockChange.bind(this), false);
        document.addEventListener('pointerlockerror',
            this.onPointerlockError.bind(this), false);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
}