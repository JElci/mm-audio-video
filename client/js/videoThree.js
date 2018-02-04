import * as THREE from '../node_modules/three/build/three.module.js';
import  './CannyFilter.js';

class VideoThree {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    this.renderer = new THREE.WebGLRenderer();
    this.fontloader = new THREE.FontLoader();
    this.videoMaterial;
    this.animationID;
    this.camera;
    this.filters = [];
    this.videoTextures = [];
    this.container;
    this.videos = [];
    this.videoImages = [];
  }

  init(container , cameraPos , size) {
    this.camera = new THREE.PerspectiveCamera( 75, size["width"]/size["height"], 0.1, 1000 );
    this.renderer.setSize(size["width"], size["height"]);
    this.camera.position.set(cameraPos["x"],cameraPos["y"],cameraPos["z"]);
    this.container = container;
    container.appendChild(this.renderer.domElement);

    this.animate();
  }

  addText(messageInput , color , textSize , textPos) {
    var scene = this.scene;
    this.fontloader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
		    var xMid, text;
				var textShape = new THREE.BufferGeometry();
				var matDark = new THREE.LineBasicMaterial( {
					color: color,
					side: THREE.DoubleSide
				});
				var matLite = new THREE.MeshBasicMaterial( {
					color: color,
					transparent: true,
					opacity: 0.4,
					side: THREE.DoubleSide
				});
				var message = messageInput;
				var shapes = font.generateShapes( message, textSize, 2 );
				var geometry = new THREE.ShapeGeometry( shapes );
				geometry.computeBoundingBox();
				xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
				geometry.translate( xMid, textPos["y"], textPos["z"]);
				textShape.fromGeometry( geometry );
				text = new THREE.Mesh( textShape, matLite );
				text.position.z = -15;
        text.position.y = 3;
				scene.add( text );
        var holeShapes = [];
				for ( var i = 0; i < shapes.length; i ++ ) {
					var shape = shapes[ i ];
					if ( shape.holes && shape.holes.length > 0 ) {
						for ( var j = 0; j < shape.holes.length; j ++ ) {
							var hole = shape.holes[ j ];
							holeShapes.push( hole );
						}
					}
				}
				shapes.push.apply( shapes, holeShapes );
				var lineText = new THREE.Object3D();
				for ( var i = 0; i < shapes.length; i ++ ) {
					var shape = shapes[ i ];
					var points = shape.getPoints();
					var geometry = new THREE.BufferGeometry().setFromPoints( points );
					geometry.translate( xMid, textPos["y"], textPos["z"]);
					var lineMesh = new THREE.Line( geometry, matDark );
					lineText.add( lineMesh );
				}
				scene.add( lineText );
			});
  }

  addVideoWithChromaKey(video , filters , color , videoPos , planeSize) {
    this.videos.push(video);
    let videoImage = document.createElement("canvas");
    this.videoImages.push(videoImage);
    videoImage.height = video.videoHeight;
    videoImage.width = video.videoWidth;
    videoImage.ctx = videoImage.getContext("2d");
    videoImage.ctx.fillRect( 0 , 0 , videoImage.width , videoImage.height);

    let videoTexture = new THREE.VideoTexture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    this.videoTextures.push(videoTexture);

    let videoMaterial = new ChromaKeyMaterial(videoTexture, color);
    let videoGeometry = new THREE.PlaneGeometry( planeSize["x"], planeSize["y"], 4, 4 );
    let videoScreen =  new THREE.Mesh( videoGeometry, videoMaterial );
    videoScreen.position.set(videoPos["x"] , videoPos["y"] , videoPos["z"]);

    this.scene.add(videoScreen);

    if(filters) {
      this.filters.push(filters);
    }
  }

  addVideo(video , filters , videoPos , planeSize) {
    this.videos.push(video);
    let videoImage = document.createElement("canvas");
    this.videoImages.push(videoImage);
    videoImage.height = video.videoHeight;
    videoImage.width = video.videoWidth;
    videoImage.ctx = videoImage.getContext("2d");
    videoImage.ctx.fillRect( 0 , 0 , videoImage.width , videoImage.height);

    let videoTexture = new THREE.VideoTexture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    this.videoTextures.push(videoTexture);

    let videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, overdraw: true, transparent: true});
    let videoGeometry = new THREE.PlaneGeometry( planeSize["x"], planeSize["y"], 4, 4 );
    let videoScreen =  new THREE.Mesh( videoGeometry, videoMaterial );
    videoScreen.position.set(videoPos["x"] , videoPos["y"] , videoPos["z"]);

    this.scene.add(videoScreen);

    if(filters) {
      this.filters.push(filters);
    }
  }

  useFilter(videoImage , filter) {
    let imageData = videoImage.ctx.getImageData(0 , 0 , videoImage.width , videoImage.height);

    if(filter["invert"].checked) {
      Filter.invertColor(imageData);
    }
    if(filter["grayscale"].checked) {
      Filter.grayScaleFilter(imageData);
    }
    if(filter["redscale"].checked) {
      Filter.redScaleFilter(imageData);
    }
    if(filter["greenscale"].checked) {
      Filter.greenScaleFilter(imageData);
    }
    if(filter["bluescale"].checked) {
      Filter.blueScaleFilter(imageData);
    }

    videoImage.ctx.putImageData(imageData , 0 , 0);
  }

  animate() {
    this.animationID = window.requestAnimationFrame(this.animate.bind(this));

    for(let i = 0 ; i < this.videos.length ; i++) {
      if (this.videos[i].readyState === this.videos[i].HAVE_ENOUGH_DATA ) {
        this.videoImages[i].ctx.drawImage( this.videos[i], 0, 0 );

        if(this.filters[i]) {
          this.useFilter(this.videoImages[i] , this.filters[i]);
        }

        if ( this.videoTextures[i] ) {
          this.videoTextures[i].needsUpdate = true;
        }
      }
    }
    this.renderer.render( this.scene, this.camera );
  }

  stopAnimation() {
    if (this.animationID) {
			cancelAnimationFrame(this.animationID);
			this.animationID = undefined;
		}
  }

  convertCanvasToImage(canvas) {
	  var image = new Image();
	  image.src = canvas.toDataURL("image/png");
	  return image;
  }
}
export default new VideoThree();

var Filter = {
  grayScaleFilter : function(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      let y = (0.2126*r + 0.7152*g + 0.0722*b);

      data[i]     = y;
      data[i + 1] = y;
      data[i + 2] = y;
    }
    return data;
  },

  invertColor : function(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return data;
  },

  blueScaleFilter : function(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let blue = Filter.getHighestColorValue(data , i);
      let redBlue = Filter.getLowestColorValue(data , i);

      data[i] = redBlue;
      data[i + 1] = redBlue;
      data[i + 2] = blue;
    }
    return data;
  },

  greenScaleFilter : function(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let green = Filter.getHighestColorValue(data , i);
      let redBlue = Filter.getLowestColorValue(data , i);

      data[i] = redBlue;
      data[i + 1] = green;
      data[i + 2] = redBlue;
    }
    return data;
  },

  redScaleFilter : function(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let red = Filter.getHighestColorValue(data , i);
      let greenBlue = Filter.getLowestColorValue(data , i);

      data[i] = red;
      data[i + 1] = greenBlue;
      data[i + 2] = greenBlue;
    }
    return data;
  },

  cannyFilter : function(imageData) {
    return CannyJS.canny(imageData);
  },

  getLowestColorValue : function(data , i) {
    let result = data[i];

    if(result > data[i + 1]) {
      result = data[i + 1];
    }

    if(result > data[i + 2]) {
      result = data[i + 2];
    }
    return result;
  },

  getHighestColorValue : function(data , i) {
    let result = data[i];

    if(result < data[i + 1]) {
      result = data[i + 1];
    }

    if(result < data[i + 2]) {
      result = data[i + 2];
    }
    return result;
  }
}

var ChromaKeyMaterial = function (texture, keyColor) {
  THREE.ShaderMaterial.call(this);

  var keyColorObject = new THREE.Color(keyColor);
  var videoTexture = texture

  this.setValues({
    uniforms: {
      texture: {
        type: "t",
        value: videoTexture
      },
      color: {
        type: "c",
        value: keyColorObject
      }
    },
    vertexShader:
    "varying mediump vec2 vUv;\n" +
    "void main(void)\n" +
    "{\n" +
    "vUv = uv;\n" +
    "mediump vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
    "gl_Position = projectionMatrix * mvPosition;\n" +
    "}",
    fragmentShader:
    "uniform mediump sampler2D texture;\n" +
    "uniform mediump vec3 color;\n" +
    "varying mediump vec2 vUv;\n" +
    "void main(void)\n" +
    "{\n" +
    "  mediump vec3 tColor = texture2D( texture, vUv ).rgb;\n" +
    "  mediump float a = (length(tColor - color) - 0.5) * 7.0;\n" +
    "  gl_FragColor = vec4(tColor, a);\n" +
    "}",
    transparent: true,
    overdraw: true
  });
};
ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
