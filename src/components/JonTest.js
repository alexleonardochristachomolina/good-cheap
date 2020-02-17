/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { apply as applySpring, useSpring, animated as a, interpolate, config } from 'react-spring/three'
import * as easings from 'd3-ease'

export default function JonTest(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, 'models/gfc-thing.glb', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  const {rotWheel} = useSpring({
    rotWheel: props.rot,
    config: { mass: 15, tension: 300, friction: 100 }
    // config: { duration: 1000, easing: easings.easeCubicInOut }
  })

  const {rotSphere} = useSpring({
    rotSphere: props.rot,
    config: { mass: 25, tension: 300, friction: 200 }
    // config: { duration: 2000, easing: easings.easeCubicInOut }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <a.mesh
        material={materials['phong1.001']}
        geometry={nodes.base.geometry}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 0.2]}>
        <a.mesh rotation={rotSphere.interpolate(r => [0, 0, r])} material={materials['phong1.001']} geometry={nodes.sphere.geometry} position={[0.01, 4.91, -27.29]}  />
        <a.mesh rotation={rotWheel.interpolate(r => [0, r, 0])} material={materials['phong1.001']} geometry={nodes.wheel.geometry} position={[0.01, 7.5, -27.29]} />
      </a.mesh>
    </group>
  )
}
