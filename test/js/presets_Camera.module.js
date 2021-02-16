import * as THREE from "../../node_modules/three/build/three.module.js";
import Viewport from "../../node_modules/three-viewport/dist/viewport.es.js"
import stage1 from "./stage1.module.js"
import Presetable from "../../src/Presetable.module.js"


const presets = {
	daylight: {
		position: [ 10, 10 , 10]
	}, 
	nighttime: {
		position: [ 20, 10 , 20]
	}
};


let VP = new Viewport();
VP.init();
VP.start();

//document.body.appendChild( VP.renderer.domElement );
VP.renderer.setClearColor('white', 0 );
VP.renderer.shadowMap.enabled	= true;
VP.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

Presetable.implement( VP.camera );

// add presets on runtime
VP.camera.addPresets( presets );

VP.camera.position.set(4,4,11);
VP.camera.lookAt(VP.scene.position);
stage1( VP );


// add DirectionalLightExtended
let directionalLight 	= new THREE.DirectionalLight( { color: "0xff0000", intensity: 0.5 } );


directionalLight.position.set(3, 6, 3 );
directionalLight.target.position.set(0, 0, 0);
VP.scene.add( directionalLight );



// toggle Light
setTimeout( () => { 
	VP.camera.loadPreset( "daylight" );
 }, 2500);

setTimeout( () => { 
	VP.camera.loadPreset( "nighttime" );
}, 5000);

