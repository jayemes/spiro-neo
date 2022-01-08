import * as THREE from "three";
import React from "react";
import "../../css/ThreeDElement.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Disc from "../../assets/disc.png";

class ThreeDElement extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.canvas = null;
    this.myScene = null;
    this.size = 500;
    this.sprite = new THREE.TextureLoader().load(Disc);
    this.createCanvas = this.createCanvas.bind(this);
  }

  createCanvas() {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.size, this.size, true);
    this.canvas = renderer.domElement;
    this.canvas.id = "3DC";

    let scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
    let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    camera.position.set(70, 70, 70);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxAzimuthAngle = 3.14152;
    controls.minAzimuthAngle = -3.14152;

    this.updateScene(scene);

    renderer.render(scene, camera);

    let animate = function () {
      requestAnimationFrame(animate);

      controls.update();

      let canvasContainer = this.myRef.current;

      let newSize;
      if (canvasContainer !== null) {
        newSize =
          Math.max(
            600,
            Math.min(
              canvasContainer?.clientHeight || 1000,
              canvasContainer?.clientWidth || 1000,
              900
            )
          ) - 100;
      } else {
        newSize = 900;
      }

      if (newSize !== this.size) {
        renderer.domElement.width = newSize;
        renderer.domElement.height = newSize;
        renderer.setSize(renderer.domElement.width, renderer.domElement.height);
      }

      renderer.render(scene, camera);
    }.bind(this);

    animate();
    return scene;
  }

  generatePointsByNodes(outputNode) {
    let points = [];

    const output = outputNode.output;

    if (!output) return [];

    const initialParam = outputNode.initial || 0.0;
    const nops = outputNode.nops || 2000;
    let delta = Number.parseFloat(outputNode.delta);

    if (delta === 0) delta = 0.00001;

    for (let i = initialParam; i <= initialParam + nops * delta; i += delta) {
      const x = output["x"](i);
      const y = output["y"](i);
      const z = output["z"](i);

      points.push(new THREE.Vector3(x, y, z));
    }

    // console.log(points)

    return points;
  }

  generatePoints(output) {
    return this.generatePointsByNodes(output);
  }

  createGeometry(points, style, transform) {
    let object3D;

    if (!style) {
      object3D = this.createLineGeometry(points, style);
    } else {
      switch (style.type) {
        case "index":
          object3D = this.createCubesGeometry(points);
          break;
        case "extrusion":
          object3D = this.createSplinesGeometry(points, style);
          break;
        case "points":
          object3D = this.createPointsGeometry(points, style);
          break;
        default:
          object3D = this.createLineGeometry(points, style);
      }
    }

    if (transform) {
      object3D.rotateX(transform.rotation[0] || 0);
      object3D.rotateY(transform.rotation[1] || 0);
      object3D.rotateZ(transform.rotation[2] || 0);
    }

    return object3D;
  }

  createMaterial(style, points) {
    let material;
    if (style && style.type === "solid") {
      material = new THREE.LineBasicMaterial({});
      material.color.setRGB(
        style.color.r / 255,
        style.color.g / 255,
        style.color.b / 255
      );
    } else {
      material = this.createPositionalMaterial(points);
    }
    return material;
  }

  createLineGeometry(points, style) {
    const lines = new THREE.Object3D();
    lines.name = "Lines";

    const material = this.createMaterial(style, points);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    lines.add(line);

    return lines;
  }

  createCubesGeometry(points) {
    const cubes = new THREE.Object3D();
    cubes.name = "Lines";

    const nops = points.length;

    const geometry = new THREE.IcosahedronBufferGeometry(0.5);

    for (let i = 0; i < nops - 1; i += 1) {
      let material = new THREE.MeshBasicMaterial({});
      material.color.setHSL(i / nops, 1, 0.5);
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        points[i].x + Math.random() / 10.0,
        points[i].y,
        points[i].z
      );
      cubes.add(cube);
    }
    return cubes;
  }

  createCircle(radius, segments) {
    if (segments < 2) segments = 2;

    return new Array(segments).fill(0).map((val, idx) => {
      const a = ((2 * idx) / segments) * Math.PI;

      return new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius);
    });
  }

  createSplinesGeometry(points, style) {
    const { radius = 10, segments = 20, steps, color } = style;

    const spline = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
    );

    spline.curveType = "catmullrom";

    const profile = this.createCircle(radius, segments);

    const extrudeSettings = {
      steps: steps > 0 ? steps : points.length || 1,
      bevelEnabled: false,
      extrudePath: spline,
    };

    const shape = new THREE.Shape(profile);
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    geometry.name = "Lines";

    const material = new THREE.MeshStandardMaterial({
      color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`,
      metalness: 0.7,
      roughness: 0.3,
    });

    return new THREE.Mesh(geometry, material);
  }

  createPointsGeometry(points, style) {
    const vertices = points.flatMap((point) => [point.x, point.y, point.z]);

    const { color, size } = style;

    const sprite = this.sprite;

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
      color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`,
      map: size > 0 ? sprite : null,
      size: size > 0 ? size : 1,
      alphaTest: 0.5,
      transparent: true,
    });

    return new THREE.Points(geometry, material);
  }

  createPositionalMaterial(points) {
    if (points.length > 0) {
      const c = 0.0001; // Quick fix to avoid formatting the numbers

      const xMax = Math.max(...points.map((it) => it.x)) + c;
      const xMin = Math.min(...points.map((it) => it.x)) + c;

      const yMax = Math.max(...points.map((it) => it.y)) + c;
      const yMin = Math.min(...points.map((it) => it.y)) + c;

      const zMax = Math.max(...points.map((it) => it.z)) + c;
      const zMin = Math.min(...points.map((it) => it.z)) + c;

      const vShader = `
                varying vec3 pos;
    
                void main() {
                pos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `;
      const fShader = `
                varying vec3 pos;
    
                void main() {
                gl_FragColor = vec4((0.2 + 0.8*(pos.x-(${xMin}))/((${xMax})-(${xMin}))),
                                    (0.2 + 0.8*(pos.y-(${yMin}))/((${yMax})-(${yMin}))),
                                    (0.2 + 0.8*(pos.z-(${zMin}))/((${zMax})-(${zMin}))),
                                    1.0).rgba;
                }
                `;

      return new THREE.ShaderMaterial({
        vertexShader: vShader,
        fragmentShader: fShader,
        uniforms: {},
      });
    }

    return new THREE.LineBasicMaterial();
  }

  updateScene(scene) {
    while (scene.children.length) {
      scene.remove(scene.children[0]);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const light = new THREE.PointLight(0xffffff, 10, 1000, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    const light2 = new THREE.PointLight(0xffffff, 10, 1000, 1);
    light2.position.set(-200, -200, -200);
    scene.add(light2);

    let pointsObject = {};

    for (let id in this.props.outputs) {
      let outputNode = this.props.outputs[id];

      let points = this.generatePoints(outputNode);

      scene.add(
        this.createGeometry(points, outputNode.style, outputNode.transform)
      );

      pointsObject = { ...pointsObject, [id]: points };
    }
    window.points = pointsObject;
  }

  componentDidMount() {
    // console.log("Mount")
    this.myScene = this.createCanvas();
    this.myRef.current.appendChild(this.canvas);
  }

  componentDidUpdate() {
    // console.log("Update")
    this.updateScene(this.myScene);
  }

  render() {
    // return container
    return <div id="canvas-container" ref={this.myRef} />;
  }
}

export default ThreeDElement;
