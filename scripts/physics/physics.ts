
import { yy } from "../../../../../yy"
import { norm, up, upCross } from "../utils"
import { BaseRayCollision } from "./component/BaseRayCollision"
import { RayRectangleCollision } from "./component/RayRectangleCollision"
import { RaySphereCollision } from "./component/RaySphereCollision"
import { muS, muC, g, m, Mz, Mxy, R, I, e } from "./constants"
import { Vec3, Node } from "cc"

export function surfaceVelocity(v, w) {
  return surfaceVelocityFull(v, w).setZ(0)
}

const sv = new Vec3()
export function surfaceVelocityFull(v, w) {
    
  return sv.copy(v).addScaledVector(upCross(w), R)
}

const delta = { v: new Vec3(), w: new Vec3() }
Object.freeze(delta)

export function sliding(v, w) {
  const va = surfaceVelocity(v, w)
  delta.v.copy(norm(va).multiplyScalar(-muS * g))
  delta.w.copy(norm(upCross(va)).multiplyScalar(((5 / 2) * muS * g) / R))
  delta.w.setZ(-(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z))
  return delta
}

export function rollingFull(w) {
  const mag = new Vec3(w.x, w.y, 0).length()
  const k = ((5 / 7) * Mxy) / (m * R) / mag
  const kw = ((5 / 7) * Mxy) / (m * R * R) / mag
  delta.v.set(-k * w.y, k * w.x, 0)
  delta.w.set(
    -kw * w.x,
    -kw * w.y,
    -(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z)
  )
  return delta
}

export function forceRoll(v, w) {
  const wz = w.z
  w.copy(upCross(v).multiplyScalar(1 / R))
  w.setZ(wz)
}

export function rotateApplyUnrotate(theta, v, w, model) {
  const vr = v.clone().applyAxisAngle(up, theta)
  const wr = w.clone().applyAxisAngle(up, theta)

  const delta = model(vr, wr)

  delta.v.applyAxisAngle(up, -theta)
  delta.w.applyAxisAngle(up, -theta)
  return delta
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre

const epsilon = R * 0.1
const theta_a = Math.asin(epsilon / R)

const sin_a = Math.sin(theta_a)
const cos_a = Math.cos(theta_a)

export function s0(v, w) {
  return new Vec3(
    v.x * sin_a - v.z * cos_a + R * w.y,
    -v.y - R * w.z * cos_a + R * w.x * sin_a
  )
}

export function c0(v) {
  return v.x * cos_a
}

export function Pzs(s) {
  const A = 7 / 2 / m
  return s.length() / A
}

export function Pze(c) {
  const B = 1 / m
  const coeff = restitutionCushion(new Vec3(c / cos_a, 0, 0))
  return (muC * ((1 + coeff) * c)) / B
}

export function isGripCushion(v, w) {
  const Pze_val = Pze(c0(v))
  const Pzs_val = Pzs(s0(v, w))
  return Pzs_val <= Pze_val
}

function basisHan(v, w) {
  return {
    c: c0(v),
    s: s0(v, w),
    A: 7 / 2 / m,
    B: 1 / m,
  }
}

function gripHan(v, w) {
  const { c, s, A, B } = basisHan(v, w)
  const ecB = (1 + e) * (c / B)
  const PX = (-s.x / A) * sin_a - ecB * cos_a
  const PY = s.y / A
  const PZ = (s.x / A) * cos_a - ecB * sin_a
  return impulseToDelta(PX, PY, PZ)
}

function slipHan(v, w) {
  const { c, B } = basisHan(v, w)
  const ecB = (1 + e) * (c / B)
  const mu = muCushion(v)
  const phi = Math.atan2(v.y, v.x)
  const cos_phi = Math.cos(phi)
  const sin_phi = Math.sin(phi)
  const PX = -mu * ecB * cos_phi * cos_a - ecB * cos_a
  const PY = mu * ecB * sin_phi
  const PZ = mu * ecB * cos_phi * cos_a - ecB * sin_a
  return impulseToDelta(PX, PY, PZ)
}

/**
 * Based directly on Han2005 paper.
 * Expects ball to be bouncing in +X plane.
 *
 * @param v ball velocity
 * @param w ball spin
 * @returns delta to apply to velocity and spin
 */
export function bounceHan(v: Vec3, w: Vec3) {
  if (isGripCushion(v, w)) {
    return gripHan(v, w)
  } else {
    return slipHan(v, w)
  }
}

/**
 * Modification Han 2005 paper by Taylor to blend two bounce regimes.
 * Motive is to remove cliff edge discontinuity in original model.
 * Gives more realistic check side (reverse side played at steep angle)
 *
 * @param v ball velocity
 * @param w ball spin
 * @returns delta to apply to velocity and spin
 */
export function bounceHanBlend(v: Vec3, w: Vec3) {
  const deltaGrip = gripHan(v, w)
  const deltaSlip = slipHan(v, w)

  const isCheckSide = Math.sign(v.y) === Math.sign(w.z)
  const factor = isCheckSide ? Math.cos(Math.atan2(v.y, v.x)) : 1

  const delta = {
    v: deltaSlip.v.lerp(deltaGrip.v, factor),
    w: deltaSlip.w.lerp(deltaGrip.w, factor),
  }
  return delta
}

function impulseToDelta(PX, PY, PZ) {
  return {
    v: new Vec3(PX / m, PY / m),
    w: new Vec3(
      (-R / I) * PY * sin_a,
      (R / I) * (PX * sin_a - PZ * cos_a),
      (R / I) * PY * cos_a
    ),
  }
}

export function muCushion(v: Vec3) {
  const theta = Math.atan2(Math.abs(v.y), v.x)
  return 0.471 - theta * 0.241
}

export function restitutionCushion(v: Vec3) {
  const e = 0.39 + 0.257 * v.x - 0.044 * v.x * v.x
  return e
}

/**
 * Spin on ball after strike with cue
 * https://billiards.colostate.edu/technical_proofs/new/TP_A-12.pdf
 *
 * @param offset (x,y,0) from center strike where x,y range from -0.5 to 0.5 the fraction of R from center.
 * @param v velocity of ball after strike
 * @returns angular velocity
 */
export function cueToSpin(offset: Vec3, v: Vec3) {
  const spinAxis = Math.atan2(-offset.x, offset.y)
  const spinRate = ((5 / 2) * v.length() * (offset.length() * R)) / (R * R)
  const dir = v.clone().normalize()
  const rvel = upCross(dir)
    .applyAxisAngle(dir, spinAxis)
    .multiplyScalar(spinRate)
  return rvel
}

export function rayHit(origin: Vec3, direction: Vec3) {
  let nodes: Node[] = [];
  let sortNode: BaseRayCollision[] = [];
  RaySphereCollision.sRaySphereCollisions.forEach((c, i)=>{
    if(raySphere(origin, direction, c)) {
      c.sqrDeep = origin.distanceToSquared(c.node.worldPosition);
      // yy.log.w('rayHit RaySphereCollision', c.sqrDeep, c.node.name, c.node.worldPosition)
      sortNode.push(c);
    }
  });

  if (sortNode.length === 0) {
    RayRectangleCollision.sRayRectangleCollisions.forEach((c, i)=>{
      let point = rayRectangle3(origin, direction, c)
      if(point) {
        // c.sqrDeep = origin.distanceToSquared(new Vec3(point.x, point.y, c.node.worldPosition.z))
        // yy.log.w('rayHit RayRectangleCollision' + c.node.name, c.sqrDeep, c.node.name, new Vec3(point.x, point.y, c.node.worldPosition.z))
        // yy.log.w('rayHit RayRectangleCollision' + c.node.name, c.sqrDeep, c.node.name)
        sortNode.push(c);
      }
    });
  }

  sortNode.sort((a, b) => a.sqrDeep - b.sqrDeep);
  sortNode.forEach((s, i)=>{
    nodes.push(s.node);
  })

  return nodes;
}
function raySphere(origin: Vec3, direction: Vec3, raySphere: RaySphereCollision) {
  let m = origin.clone().subtract(raySphere.node.worldPosition);

  let b = m.dot(direction);
  let c = m.dot(m) - raySphere.radius * raySphere.radius;
  // 如果c > 0且b > 0，射线起点在球体外部且在球心方向之外，没有交点
  if (c > 0 && b > 0)   {
    return false;
  }
  let discriminant = b * b - c;
  // 如果discriminant < 0，射线与球体没有交点
  if (discriminant < 0) {
    return false;
  }
  // 射线与球体相交（判别式大于或等于0）
  return true;
}

function rayRectangle(origin: Vec3, direction: Vec3, rectangle: RayRectangleCollision){
  const ox = origin.x, oy = origin.y;
  const dx = direction.x, dy = direction.y;
  const rx = rectangle.node.worldPosition.x, ry = rectangle.node.worldPosition.y;
  const rw = rectangle.width, rl = rectangle.length;

  const txmin = (rx - ox) / dx;
  const txmax = (rx + rw - ox) / dx;
  const tymin = (ry - oy) / dy;
  const tymax = (ry + rl - oy) / dy;

  const tmin = Math.max(Math.min(txmin, txmax), Math.min(tymin, tymax));
  const tmax = Math.min(Math.max(txmin, txmax), Math.max(tymin, tymax));

  if (tmin > tmax) {
    return null;
  }
  const collisionT = tmin;
  const collisionX = ox + collisionT * dx;
  const collisionY = oy + collisionT * dy;

  return {x: collisionX, y: collisionY};
}


function rayRectangle1(origin: Vec3, direction: Vec3, rectangle: RayRectangleCollision){
  const ox = origin.x, oy = origin.y;
  const dx = direction.x, dy = direction.y;
  const rx = rectangle.node.worldPosition.x, ry = rectangle.node.worldPosition.y;
  const hrw = rectangle.halfWidth, hrl = rectangle.halfLength;

  let tx = 0, ty = 0;
  if (direction.x >= 0) {
    tx = (rx + hrw - ox) / dx
  }
  else {
    tx = (rx - hrw - ox) / dx
  }
  if (direction.y >= 0) {
    ty = (ry + hrl - oy) / dy
  }
  else {
    ty = (ry - hrl - oy) / dy
  }

  const txmin = (rx - hrw - ox) / dx//Math.abs((rx - hrw - ox) / dx);
  const txmax = (rx + hrw - ox) / dx//Math.abs((rx + hrw - ox) / dx);
  const tymin = (ry - hrl - oy) / dy//Math.abs((ry - hrl - oy) / dy);
  const tymax = (ry + hrl - oy) / dy//Math.abs((ry + hrl - oy) / dy);

  yy.log.w("pos time: ", txmin, txmax, tymin, tymax);

  yy.log.w("pos：" + rectangle.node.name , (rx - hrw - ox), (rx + hrw - ox), (ry - hrl - oy), (ry + hrl - oy))

  const tmin = Math.max(Math.min(txmin, txmax), Math.min(tymin, tymax));
  const tmax = Math.min(Math.max(txmin, txmax), Math.max(tymin, tymax));

  yy.log.w("pos max", tmin, tmax);
  if (tmin > tmax) {
    return null;
  }
  const collisionT = tmin;
  const collisionX = ox + collisionT * dx;
  const collisionY = oy + collisionT * dy;

  return {x: collisionX, y: collisionY};
}

function rayRectangle2(origin: Vec3, direction: Vec3, rectangle: RayRectangleCollision){
  const ox = origin.x, oy = origin.y;
  const dx = direction.x, dy = direction.y;
  const rx1 = rectangle.node.worldPosition.x - rectangle.halfWidth, ry1 = rectangle.node.worldPosition.y ;
  const rx2 = rectangle.node.worldPosition.x + rectangle.halfWidth, ry2 = rectangle.node.worldPosition.y ;

  const t = (rx1 - ox) / dx;
  const u = ((ry2 - ry1) * (rx1 - ox) - (rx2 - rx1) * (ry1 - oy)) / (dx * (ry2 - ry1) - dy * (rx2 - rx1));

  if (t>= 0 && u >= 0 && u <=1) {
    const intersectionX = ox + t * dx;
    const intersectionY = oy + t * dy;
    return { x: intersectionX, y: intersectionY };
  }

  return null;
}


function rayRectangle3(origin: Vec3, direction: Vec3, rectangle: RayRectangleCollision){
  const ox = origin.x, oy = origin.y;
  const dx = direction.x, dy = direction.y;
  const rx = rectangle.node.worldPosition.x, ry = rectangle.node.worldPosition.y;
  const hrw = rectangle.halfWidth, hrl = rectangle.halfLength;
  let rx1 = rectangle.node.worldPosition.x - rectangle.halfWidth, ry1 = rectangle.node.worldPosition.y ;
  let rx2 = rectangle.node.worldPosition.x + rectangle.halfWidth, ry2 = rectangle.node.worldPosition.y ;

  if (rectangle.node.position.y > 0) {
      if (direction.y >= 0) {
        if (direction.x <= 0) {
          if (origin.x >= rx1 && origin.x <= rx2) {
            let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
            return  Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy)
          }
          else {
            let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
            let minDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
            return  Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy) && Math.abs(dx/dy) >= Math.abs(minDir.x/minDir.y); //  ture相交
          }
        }
        else {
          if (origin.x >= rx1 && origin.x <= rx2){
            let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
            return Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy)
          }
          else {
            let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
            let minDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
            return Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy) && Math.abs(dx/dy) >= Math.abs(minDir.x/minDir.y); //  ture相交
          }
        }
    }
  }
  else if(rectangle.node.position.y < 0) {
    if (direction.y <= 0) {
      if (direction.x <= 0) {
        if (origin.x >= rx1 && origin.x <= rx2) {
          let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
          return  Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy); //  ture相交
        }
        else {
          let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
          let minDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
          return  Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy) && Math.abs(dx/dy) >= Math.abs(minDir.x/minDir.y); //  ture相交
        }
      }
      else {
        if (origin.x >= rx1 && origin.x <= rx2){
          let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
          return Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy); //  ture相交
        }
        else {
          let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
          let minDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
          return Math.abs(maxDir.x/maxDir.y) >= Math.abs(dx/dy) && Math.abs(dx/dy) >= Math.abs(minDir.x/minDir.y); //  ture相交
        }

      }
    }
  }
  else {
    rx1 = rectangle.node.worldPosition.x, ry1 = rectangle.node.worldPosition.y - rectangle.halfLength ;
    rx2 = rectangle.node.worldPosition.x, ry2 = rectangle.node.worldPosition.y + rectangle.halfLength ;   
    if (rectangle.node.position.x > 0){
      if (direction.x >= 0) {
        if (direction.y >= 0) {
          let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
          return  Math.abs(maxDir.y/maxDir.x) >= Math.abs(dy/dx); //  ture相交
        }
        else {
          let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
          return Math.abs(maxDir.y/maxDir.x) >= Math.abs(dy/dx); //  ture相交
        }
      }
    }
    else if (rectangle.node.position.x < 0) {
      if (direction.x <= 0) {
        if (direction.y >= 0) {
          let maxDir = new Vec3(rx2, ry2, 0).subtract(origin).normalize();
          return  Math.abs(maxDir.y/maxDir.x) >= Math.abs(dy/dx); //  ture相交
        }
        else {
          let maxDir = new Vec3(rx1, ry1, 0).subtract(origin).normalize();
          return Math.abs(maxDir.y/maxDir.x) >= Math.abs(dy/dx); //  ture相交
        }
      }
    }
  }
}