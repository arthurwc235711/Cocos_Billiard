import { Quat, Vec3 } from "cc"

export const zero = new Vec3(0, 0, 0)
export const up = new Vec3(0, 0, 1)

export function vec(v) {
  return new Vec3(v.x, v.y, v.z)
}

const upCrossVec = new Vec3()
export function upCross(v) {
  return upCrossVec.copy(up).cross(v)
}
const normVec = new Vec3()
export function norm(v) {
  return normVec.copy(v).normalize()
}

const axisQuat = new Quat();
export function rotateAxisAngle(nor: Vec3, angle: number) {
  return Quat.fromAxisAngle(axisQuat, nor, angle);
}

const vc = new Vec3()
export function passesThroughZero(v, dv) {
  return vc.copy(v).add(dv).dot(v) <= 0
}

export function unitAtAngle(theta) {
  return new Vec3(1, 0, 0).applyAxisAngle(up, theta)
}

export function round(num) {
  const sign = Math.sign(num)
  return (sign * Math.floor((Math.abs(num) + Number.EPSILON) * 10000)) / 10000
}

export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function roundVec(v) {
  v.x = round(v.x)
  v.y = round(v.y)
  v.z = round(v.z)
  return v
}

export function roundVec2(v) {
  v.x = round2(v.x)
  v.y = round2(v.y)
  v.z = round2(v.z)
  return v
}
