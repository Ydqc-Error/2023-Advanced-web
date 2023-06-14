import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Manager } from "socket.io-client";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';

declare function chat(username: any, socket: any): any;


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private three!: ElementRef<HTMLCanvasElement>;
  constructor(private windowRenderer: Renderer2, private router: Router, public http: HttpClient, public user: UserService) { }
  private element!: HTMLCanvasElement;
  // @Input() public cameraZ: number = 400;


  private get canvas(): HTMLCanvasElement {
    return this.three.nativeElement;
  }


  private modes = Object.freeze({
    NONE: Symbol("none"),
    PRELOAD: Symbol("preload"),
    INITIALISING: Symbol("initialising"),
    CREATING_LEVEL: Symbol("creating_level"),
    ACTIVE: Symbol("active"),
    GAMEOVER: Symbol("gameover")
  });
  private mode = this.modes.NONE;
  private width = window.innerWidth;
  private height = 0.996 * window.innerHeight;

  private camera = new THREE.PerspectiveCamera(45, (this.width) / (this.height), 0.1, 1000);
  private bookcaseLight = new THREE.PointLight(0xffffff, 1, 100);
  private ambientLight = new THREE.AmbientLight(0xaaaaaa)

  private textureLoader = new THREE.TextureLoader();
  private textureWall = this.textureLoader.load('assets/textures/wall1.jpg');
  private textureCeiling = this.textureLoader.load('assets/textures/ceiling.jpg');
  private textureFloor = this.textureLoader.load('assets/textures/floor.jpg', function
    (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
  });
  // private textureDoctor = this.textureLoader.load('assets/people/SimplePeople_Doctor_Brown.png')

  private skyBoxMaterial = [
    new THREE.MeshBasicMaterial({
      map:
        this.textureWall, side: THREE.BackSide
    }), // right
    new THREE.MeshBasicMaterial({
      map:
        this.textureWall, side: THREE.BackSide
    }), // left
    new THREE.MeshBasicMaterial({
      map:
        this.textureCeiling, side: THREE.BackSide
    }), // top
    new THREE.MeshBasicMaterial({
      map:
        this.textureCeiling, side: THREE.BackSide
    }), // bottom
    new THREE.MeshBasicMaterial({
      map:
        this.textureWall, side: THREE.BackSide
    }), // back
    new THREE.MeshBasicMaterial({
      map:
        this.textureWall, side: THREE.BackSide
    }) // front
  ];
  private floorMaterial = new THREE.MeshBasicMaterial({
    map: this.textureFloor,
    side: THREE.BackSide
  });

  private skyBoxGeometry = new THREE.BoxGeometry(150, 150, 150);
  private skyBox = new THREE.Mesh(this.skyBoxGeometry, this.skyBoxMaterial);

  private floorGeometry = new THREE.PlaneGeometry(150, 150, 5, 5);
  private floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);

  private gltfLoader = new GLTFLoader();
  private fbxLoader = new FBXLoader();
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  //光线投射
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private recordRay = false;

  //第一人称视角
  private domElement = document.body;
  private isLocked = false;
  private pitchObject = new THREE.Object3D();
  private yawObject = new THREE.Object3D();
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private KEY_W = 87;
  private KEY_S = 83;
  private KEY_A = 65;
  private KEY_D = 68;
  private KEY_E = 69;
  private clock = new THREE.Clock();


  //socket
  private socket: any;
  private playerMap: any;
  private modelname = '111';

  private group = new THREE.Group();

  //user
  private figures = ["Policeman", "BeachBabe", "Prostitute", "Punk"];
  private colours = ['Black', 'Brown', 'White'];

  //读书
  private cssRenderer!: CSS3DRenderer;
  private cssScene = new THREE.Scene();
  private cssCamera = new THREE.PerspectiveCamera(45, (this.width) / (this.height), 0.1, 1000);
  private controls: any;
  private book: any;
  private booksrc = 'http://www.ibiqu.org/';
  private changed = false;
  private bookVisable = false;


  private createScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.skyBox.userData['type'] = 'skyBox'
    this.scene.add(this.skyBox);

    this.bookcaseLight.position.set(0, 30, -40);
    this.bookcaseLight.castShadow = true;
    this.scene.add(this.bookcaseLight);
    var helper = new THREE.PointLightHelper(this.bookcaseLight); // 创建一个点光源辅助对象
    this.scene.add(helper); // 将辅助对象添加到场景中
    this.scene.add(this.ambientLight);
    this.pitchObject.add(this.camera);
    this.pitchObject.position.y = 10;
    this.yawObject.add(this.pitchObject);

    this.scene.add(this.skyBox);
    this.floor.position.y = 0;
    this.floor.rotation.x = Math.PI / 2;
    this.floor.userData['type'] = 'floor'
    this.scene.add(this.floor);
    //书架
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');;
    this.gltfLoader.setDRACOLoader(dracoLoader);
    this.gltfLoader.load('assets/oldBookcase/scene.glb', (gltf) => {
      var model = gltf.scene;
      // 给模型添加一个自定义属性，表示它的类型
      model.userData['type'] = 'bookcase';
      // 遍历模型的子对象
      model.traverse(function (child) {
        // 如果子对象是一个网格
        if ((<THREE.Mesh>child).isMesh) {
          // 给子对象也添加这个属性
          child.userData['type'] = 'bookcase';
        }
      });
      model.scale.set(15, 15, 15);
      model.position.x = 0;
      model.position.y = -2;
      model.position.z = -50;
      model.rotation.y = -Math.PI;
      this.scene.add(model);
    })
    //人物
    let figure = this.figures[+this.user.userInfo.figure - 1];
    this.fbxLoader.load("assets/people/fbx/people/" + figure + "BeachBabe.fbx", (fbx) => {
      let colour = this.colours[Math.floor(Math.random() * this.colours.length)];
      this.textureLoader.load("assets/people/image/SimplePeople_" + figure + "_" + colour + ".png", function (texture) {
        fbx.traverse(function (child) {
          if ((<THREE.Mesh>child).isMesh) {
            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).map = texture;
          }
        });
      });
      fbx.scale.set(0.04, 0.04, 0.04);
      this.scene.add(fbx)
      this.yawObject.attach(fbx);
      fbx.position.set(0, 0, 0);
      fbx.rotation.set(0, Math.PI, 0);
    });
    this.scene.add(this.yawObject);

  }

  private renderAll() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(this.width, this.height);

    let component: RoomComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.update(component.clock.getDelta())
      component.socket.emit('player', {
        position: component.yawObject.position,
        rotation: component.yawObject.rotation,
        modelname: component.user.userInfo.figure
      });
      if (component.changed) {
        if (component.bookVisable) {

          component.group.add(component.book);

        } else {

          component.group.remove(component.book);

        }
        component.changed = false;
      }

      component.cssRenderer.render(component.cssScene, component.cssCamera);
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private setSocket() {
    let manager = new Manager("http://localhost:3000");
    this.socket = manager.socket("/");
    this.playerMap = new Map();

    this.socket.on('player', (data: any) => {
      if (this.playerMap.has(data.socketid)) {
        let model = this.playerMap.get(data.socketid);
        model.position.set(data.position.x, data.position.y, data.position.z);
        model.rotation.set(data.rotation._x, data.rotation._y + Math.PI,
          data.rotation._z);
      } else {
        this.socket.emit('player', {
          position: this.yawObject.position,
          rotation: this.yawObject.rotation
        });
        let figure = this.figures[+ data.modelname - 1];

        this.fbxLoader.load("assets/people/fbx/people/" + figure + ".fbx", (fbx) => {                     //模型加载位置
          if (!this.playerMap.has(data.socketid)) {
            let num = Math.floor(Math.random() * 3)
            let colour = this.colours[num];
            this.textureLoader.load("assets/people/image/SimplePeople_" + figure + "_" + colour + ".png", function (texture) {
              fbx.traverse(function (child) {
                if ((<THREE.Mesh>child).isMesh) {
                  ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).map = texture;
                }
              });
            });
            fbx.scale.set(0.04, 0.04, 0.04);
            this.scene.add(fbx)
            this.playerMap.set(data.socketid, fbx);
          }
        });
      }
    });
    this.socket.on('offline', (data: any) => {
      if (this.playerMap.has(data.socketid)) {
        this.scene.remove(this.playerMap.get(data.socketid));
        this.playerMap.delete(data.socketid)
      }
    });
  }

  private createCSS3DObject(url: any, x: any, y: any, z: any, ry: any) {
    const div = document.createElement('div');
    div.style.width = '60%';
    div.style.height = '60%';
    div.style.backgroundColor = "#fff";

    const iframe = document.createElement('iframe')
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0px';
    iframe.src = url;

    div.appendChild(iframe);

    const css3DObject = new CSS3DObject(div);
    css3DObject.position.set(x, y, z);
    css3DObject.rotation.y = ry;
    return css3DObject;
  }

  private setCSSRender() {
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = "0";
    this.cssRenderer.domElement.style.left = "0";
    this.cssRenderer.setSize(this.width, this.height);
    document.body.appendChild(this.cssRenderer.domElement);
    this.cssCamera.position.set(0, 0, 500);
    this.cssCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.cssScene.add(this.cssCamera)
    this.controls = new OrbitControls(this.cssCamera, this.cssRenderer.domElement);
    this.cssScene.add(this.yawObject);
    this.book = this.createCSS3DObject(this.booksrc, 0, 50, -200, 0);
    this.cssScene.add(this.group);
  }

  //重塑屏幕大小
  private onWindowResize() {
    this.camera.aspect = (this.width) / (this.height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.cssRenderer.setSize(this.width, this.height);
  }
  //视线判断
  private onRayMove(event: any) {
    //将鼠标坐标转换为归一化设备坐标（-1到1）
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;

    //根据相机和鼠标位置更新光线投射器
    this.raycaster.setFromCamera(this.mouse, this.camera);
  }
  private onRayKeyDown(event: any) {
    if (event.keyCode == this.KEY_E) {
      this.recordRay = true;
    }
  }
  private onRayKeyUp(event: any) {
    if (this.recordRay == true) {
      if (this.bookVisable) {
        this.bookVisable = false;
      }
      else {
        var intersects = this.raycaster.intersectObjects(this.scene.children, true);
        //如果有相交物体
        if (intersects.length > 0) {
          //获取第一个相交物体
          var obj = intersects[0]
          let type = obj.object.userData['type']
          let distance = obj.distance
          console.log(obj.distance, obj.object.userData['type'])
          if (type == 'bookcase' && distance < 20) {
            this.bookVisable = true;
          }
        }
      }
      this.changed = true;

      this.recordRay = false
    }
  }
  //视角控制和移动
  private requestPointerLock() {
    // 请求指针锁定
    this.canvas.requestPointerLock();
    console.log(' request Pointer locked .')
  }
  private onPointerLockChange() {
    // 指针锁定状态改变时的处理逻辑
    if (document.pointerLockElement === this.canvas) {
      // 如果成功锁定了目标元素
      console.log('Pointer locked successfully.'); // 打印日志
      // 可以执行其他操作，例如显示或隐藏一些UI元素
      this.isLocked = true;
    } else {
      // 如果没有锁定目标元素
      console.log('Pointer lock lost.'); // 打印日志
      // 可以执行其他操作，例如显示或隐藏一些UI元素
      this.isLocked = false;
    }
  }
  private onPointerLockError() {
    console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
  }
  private onMouseMove(event: any) {
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
  private onKeyDown(event: any) {
    if (this.isLocked) {
      switch (event.keyCode) {
        case this.KEY_W: this.moveForward = true; break;
        case this.KEY_A: this.moveLeft = true; break;
        case this.KEY_S: this.moveBackward = true; break;
        case this.KEY_D: this.moveRight = true; break;
      }
    }

  }
  private onKeyUp(event: any) {
    if (this.isLocked) {
      switch (event.keyCode) {
        case this.KEY_W: this.moveForward = false; break;
        case this.KEY_A: this.moveLeft = false; break;
        case this.KEY_S: this.moveBackward = false; break;
        case this.KEY_D: this.moveRight = false; break;
      }
    }

  }
  private update(delta: any) {
    // 移动速度
    const moveSpeed = 60;
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
    let posx = this.yawObject.position.x;
    let posz = this.yawObject.position.z;
    let pos = this.yawObject.position;
    //天空盒边界
    if (posz < -70) { pos.setZ(-70) }
    if (posz > 70) { pos.setZ(70) }
    if (posx < -70) { pos.setX(-70) }
    if (posx > 70) { pos.setX(70) }
    //书架边界
    let xmin = 0, zmin = 0
    if (posx > -10 && posx < 10 && posz < -40 && posz > -60) {
      if (posx > 0) { xmin = 10 - posx }
      else { xmin = posx + 10 }
      if (posz > -50) { zmin = -40 - posz }
      else { zmin = posz + 60 }
      //判断最近的一边并将其移出
      if (xmin < zmin) {
        if (posx > 0) { pos.setX(10) }
        else { pos.setX(-10) }
      } else {
        if (posz > -50) { pos.setZ(-40) }
        else { pos.setZ(-60) }
      }


    }


  }
  private connect() {
    // this.domElement.addEventListener('click', this.domElement.requestPointerLock);
    // 在函数后⾯添加bind(this)的⽬的是什么？

    // document.addEventListener('pointerlockchange',
    //   this.onPointerlockChange.bind(this), false);
    // document.addEventListener('pointerlockerror',
    //   this.onPointerlockError.bind(this), false);
    // document.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }


  ngOnInit(): void {
    this.createScene();
    this.connect();
    this.setSocket();
    this.setCSSRender();
    console.log("username是"+this.user.userInfo.username)
    chat(this.user.userInfo.username, this.socket);


    //监听重塑屏幕
    window.addEventListener("resize", this.onWindowResize.bind(this));
    //监听视线变化
    window.addEventListener('mousemove', this.onRayMove.bind(this), false);
    //监听交互
    window.addEventListener('keydown', this.onRayKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onRayKeyUp.bind(this), false);
  }

  ngAfterViewInit() {
    this.renderAll();
    this.windowRenderer.listen('document', 'click', this.requestPointerLock.bind(this));
    this.windowRenderer.listen('document', 'pointerlockchange', this.onPointerLockChange.bind(this));
    this.windowRenderer.listen('document', 'pointerlockerror', this.onPointerLockError.bind(this));
    this.windowRenderer.listen('document', 'mousemove', (event: any) => this.onMouseMove(event));
  }
}

