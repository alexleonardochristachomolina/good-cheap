/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useFrame, useThree } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useSpring, animated as a, interpolate, config } from 'react-spring/three'
import propellerImg from '../images/propeller.png'

import buttonAudio from '../audio/button-click.mp3';
import buttonInactiveAudio from '../audio/button-inactive.mp3';
import servo1Audio from '../audio/servo1.mp3';
import servo2Audio from '../audio/servo2.mp3';
import servo3Audio from '../audio/servo3.mp3';

const buttonSound = new Audio(buttonAudio);
const buttonInactiveSound = new Audio(buttonInactiveAudio);
const servo1Sound = new Audio(servo1Audio);
const servo2Sound = new Audio(servo2Audio);
const servo3Sound = new Audio(servo3Audio);

function Sound({ url }) {
  const sound = useRef()
  const { camera } = useThree()
  const [listener] = useState(() => new THREE.AudioListener())
  const buffer = useLoader(THREE.AudioLoader, url)
  useEffect(() => {
    sound.current.setBuffer(buffer)
    // sound.current.setRefDistance(1)
    sound.current.setLoop(true)
    sound.current.play()
    camera.add(listener)
    return () => camera.remove(listener)
  }, [])
  return <positionalAudio ref={sound} args={[listener]} />
}

function playAudio(audio, volume = 1, loop = false) {
    audio.currentTime = 0
    audio.volume = volume
    audio.loop = loop
    audio.play()
}

function playRandomServo() {
  const vol = .3;
  const rand = Math.floor(Math.random() * 3) + 1;
  switch(rand) {
    case 1:
      playAudio(servo1Sound, vol, false);
      return;
    case 2:
      playAudio(servo2Sound, vol, false);
      return;
    case 3:
      playAudio(servo3Sound, vol, false);
  }
}

export default function GFCMachine(props) {
  const group = useRef()
  const { nodes, materials } = useLoader(GLTFLoader, 'gfc-hq.glb', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  const [hovered, set] = useState(false);
  useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])

  const [propellerTex] = useLoader(THREE.TextureLoader, [propellerImg])

  const propeller = useRef();
  useFrame( ({ clock }) => (
    propeller.current.rotation.y += .4,
    group.current.position.y = Math.sin(clock.getElapsedTime() * 1.1) * .057 + 0.1,
    group.current.position.x = Math.sin(clock.getElapsedTime() * 1.5) * .05,
    group.current.position.z = Math.sin(clock.getElapsedTime() * 1.3) * .05,
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * .25) * .2 -1.5
  ))

  const handleClick = (id) => { 
    if(!isActive(id)){
      playRandomServo();
      playAudio(buttonSound, 1, false);
      props.setNewSelection(id);
    } else {
      playAudio(buttonInactiveSound, 1, false);
    }
    
  }
  
  const isActive = (selection) => {
    return props.selections.includes(selection)
  }

  const sphereRotVal = () => {
    if(props.selections.every(s => s !== 'good')) {
        return Math.PI/1.5;
    } else if(props.selections.every(s => s !== 'fast')) {
        return 0;
    } else if(props.selections.every(s => s !== 'cheap')) {
        return -Math.PI/1.5;
    }
  }

  //useFrame(({ clock }) => (group.current.rotation.y = Math.sin(clock.getElapsedTime() / 8) * Math.PI))
  
  const {buttonPos1, buttonPos2, buttonPos3} = useSpring({
    buttonPos1: isActive('good') ? -.06 : .06,
    buttonPos2: isActive('fast') ? -.06 : .06,
    buttonPos3: isActive('cheap') ? -.06 : .06,
    config: { duration: 150 }
  })

  const {arrowRot1, arrowRot2, arrowRot3} = useSpring({
    arrowRot1: isActive('good') ? Math.PI : 0,
    arrowRot2: isActive('fast') ? Math.PI : 0,
    arrowRot3: isActive('cheap') ? Math.PI : 0,
    config: { mass: 1, tension: 120, friction: 14 }
  })

  const {sphereRot} = useSpring({
    sphereRot: sphereRotVal(),
    config: { mass: 25, tension: 500, friction: 200 }
  })

  return (
    <a.group ref={group} {...props} dispose={null} >
      <Sound url="/audio/propeller2.ogg" />
      <mesh material={materials['gfc main']} geometry={nodes.casing.geometry} position={[0, 0, 0]}>
      
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.arrow1.geometry} 
          position={[0.38, 0.06, 0.35]} 
          rotation={arrowRot1.interpolate(r => [r, 0, 0])}
        />
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.arrow2.geometry} 
          position={[0.38, 0.06, -0.35]} 
          rotation={arrowRot2.interpolate(r => [r, 0, 0])}
        />
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.arrow3.geometry} 
          position={[0.38, -0.54, 0]} 
          rotation={arrowRot3.interpolate(r => [r, 0, 0])}
        />
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.button1.geometry} 
          // position={buttonPos1.interpolate(p => [p, 0.33, 0.83])} 
          position={[0, 0.33, 0.83]} 
          onPointerOver={() => set(true)} 
          onPointerOut={() => set(false)}
          onPointerDown={() => handleClick('good')}
        />
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.button2.geometry} 
          // position={buttonPos2.interpolate(p => [p, 0.33, -0.82])}
          position={[0, 0.33, -0.82]}
          onPointerOver={() => set(true)} 
          onPointerOut={() => set(false)}
          onPointerDown={() => handleClick('fast')}
        />
        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.button3.geometry} 
          // position={buttonPos3.interpolate(p => [p, -1.09, 0])} 
          position={[0, -1.09, 0]} 
          onPointerOver={() => set(true)} 
          onPointerOut={() => set(false)}
          onPointerDown={() => handleClick('cheap')}
        />

        <mesh material={nodes.light1.material} geometry={nodes.light1.geometry}>
          <meshPhongMaterial 
            attach = "material"
            color = {new THREE.Color('#010201')}
            emissive = {new THREE.Color('#00ff00')}
            emissiveIntensity = {isActive('good') ? 50 : 0}
          />
        </mesh>
        <mesh material={nodes.light2.material} geometry={nodes.light2.geometry}>
          <meshPhongMaterial 
            attach = "material" 
            color = {new THREE.Color('#010201')}
            emissive = {new THREE.Color('#00ff00')}
            emissiveIntensity = {isActive('fast') ? 50 : 0}
          />
        </mesh>
        <mesh material={nodes.light3.material} geometry={nodes.light3.geometry}>
          <meshPhongMaterial 
            attach = "material" 
            color = {new THREE.Color('#010201')}
            emissive = {new THREE.Color('#00ff00')}
            emissiveIntensity = {isActive('cheap') ? 50 : 0}
          />
        </mesh>

        <a.mesh 
          material={materials['gfc main']} 
          geometry={nodes.sphere.geometry} 
          position={[0.18, -0.14, 0]} 
          rotation={sphereRot.interpolate(r => [0, r, 0])}
        />
        
        <group ref={propeller} position={[-0.01, 0.86, 0]}>
          <mesh material={materials['gfc main']} geometry={nodes.propeller_0.geometry} />
          <mesh geometry = {nodes.propeller_1.geometry}>
            <meshStandardMaterial 
              attach="material" 
              map={propellerTex} 
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        </group>
      </mesh>
    </a.group>
  )
}
