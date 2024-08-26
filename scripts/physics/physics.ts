
import { yy } from "../../../../../yy"
import { BilliardData } from "../../data/BilliardData"
import { norm, up, upCross } from "../utils"

import { BaseRayCollision } from "./component/BaseRayCollision"
import { RayRectangleCollision } from "./component/RayRectangleCollision"
import { RaySphereCollision } from "./component/RaySphereCollision"
import { muS, muC, g, m, Mz, Mxy, R, I, e } from "./constants"
import { Vec3, Node, math } from "cc"

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

export function rotateApplyUnrotate(theta, v, w, model, ball) {
  const vr = v.clone().applyAxisAngle(up, theta)
  const wr = w.clone().applyAxisAngle(up, theta)

  const delta = model(vr, wr, ball.id)

  delta.v.applyAxisAngle(up, -theta)
  delta.w.applyAxisAngle(up, -theta)
  return delta
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre

const epsilon = R * 0.05
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
  const Pze_val = Pze(c0(v)) // 抓握力 
  const Pzs_val = Pzs(s0(v, w)) // 弹性力
  // yy.log.i("sin_a:", sin_a, "cos_a:", cos_a, "theta_a", theta_a);
  // yy.log.w("Pze_val:", Pze_val, "Pzs_val:", Pzs_val);
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

function gripHan(v, w, id) {
  let { c, s, A, B } = basisHan(v, w)
  if (id !== 0) {
    A =  7 / 0.5 / m;
  }
  const ecB = (1 + e) * (c / B)
  const PX = (-s.x / A) * sin_a - ecB * cos_a
  const PY = s.y / A
  const PZ = (s.x / A) * cos_a - ecB * sin_a
  return impulseToDelta(PX, PY, PZ)
}

function slipHan(v, w) {
  const { c, B } = basisHan(v, w)
  const ecB = (1 + e) * (c / B)
  const mu = muCushion(v) / 10;
  const phi = Math.atan2(v.y, v.x)
  const cos_phi = Math.cos(phi)
  const sin_phi = Math.sin(phi)
  const PX = -mu * ecB * cos_phi * cos_a - ecB * cos_a
  const PY = mu * ecB * sin_phi
  const PZ = mu * ecB * cos_phi * cos_a - ecB * sin_a

  // yy.log.w(mu,  PX, PY, PZ)
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
export function bounceHan(v: Vec3, w: Vec3, id: number = -1) {

  if (id === 0 && BilliardData.instance.getOffset().length() > 0.2) { // 母球带旋转的球吃旋转
    // yy.log.e("bounceHanBlend")
    return bounceHanBlend(v, w, id)
  }
  else {
    if (isGripCushion(v, w)) {
      // yy.log.e("gripHan")
      return bounceHanBlend(v, w, id)
      // return gripHan(v, w, id)
    } else {
  
      // yy.log.e("slipHan")
      return slipHan(v, w,)
    }
  }



  return slipHan(v, w)
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
export function bounceHanBlend(v: Vec3, w: Vec3, id:number = -1) {
  const deltaGrip = gripHan(v, w, id)
  const deltaSlip = slipHan(v, w)

  const isCheckSide = Math.sign(v.y) === Math.sign(w.z)
  const factor = isCheckSide ? Math.cos(Math.atan2(v.y, v.x)) : 1


  // yy.log.w("isCheckSide:", isCheckSide, "factor:", factor)

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
  RaySphereCollision.sRaySphereCollisions.forEach((circle, i)=>{
    if(raySphere(origin, direction, circle)) {
      const fx = origin.x - circle.node.worldPosition.x;
      const fy = origin.y - circle.node.worldPosition.y;
  
      const a = direction.x * direction.x + direction.y * direction.y;
      const b = 2 * (fx * direction.x + fy * direction.y);
      const c = fx * fx + fy * fy - (circle.radius + R) * (circle.radius +R );
  
      const discriminant = b * b - 4 * a * c;
  
      if (discriminant < 0) {
          // 没有实数解，表示没有交点
          circle.sqrDeep = Infinity;
      }
  
      // 计算两个交点
      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  
      // 选择正的 t 值（表示在移动方向上的交点）
      if (t1 >= 0 && t2 >= 0) {
        circle.sqrDeep = Math.min(t1, t2);
      } else if (t1 >= 0) {
        circle.sqrDeep = t1;
      } else if (t2 >= 0) {
        circle.sqrDeep = t2;
      } else {
          // 两个 t 值都为负，表示交点在反方向
          circle.sqrDeep = Infinity;
      }

      // yy.log.w(  "圆形长度 ", circle.sqrDeep)

      // circle.sqrDeep = origin.distanceToSquared(circle.node.worldPosition);
      sortNode.push(circle);
    }
  });

  // if (sortNode.length === 0) {
    RayRectangleCollision.sRayRectangleCollisions.forEach((c, i)=>{
      let point = rayRectangle14(origin, direction, c)
      if(point) {
        let source = origin;
        let target = c.node.worldPosition;
        let inc = R + 0.025;


        if (c.node.position.y !== 0) {
          let h = Math.abs(target.y - source.y) - inc;
          let w = direction.x/direction.y * h;
          c.sqrDeep = Math.sqrt(h*h + w*w)//- R*2;//减少45.47像素贴图的误差
        }
        else {
            let w = Math.abs(target.x - source.x) - inc;
            let h = direction.y/direction.x * w;
            c.sqrDeep = Math.sqrt(h*h + w*w)//- R*2;
        }

        // let tmpSqr = Math.sqrt(Math.pow(Math.abs(point.x - origin.x),2) + Math.pow(Math.abs(point.y - origin.y), 2));
        // yy.log.w(  "矩形长度 ", c.sqrDeep)

        // c.sqrDeep = origin.distanceToSquared(new Vec3(point.x, point.y, c.node.worldPosition.z))
        // yy.log.w('rayHit RayRectangleCollision' + c.node.name, c.sqrDeep, c.node.name, new Vec3(point.x, point.y, c.node.worldPosition.z))
        // yy.log.w('rayHit RayRectangleCollision' + c.node.name, c.sqrDeep, c.node.name)
        sortNode.push(c);
      }
    });
  // }

  sortNode.sort((a, b) => a.sqrDeep - b.sqrDeep);

  sortNode.forEach((s, i)=>{
    nodes.push(s.node);
  })

  return nodes;
}
function raySphere(origin: Vec3, direction: Vec3, raySphere: RaySphereCollision) {
  let m = origin.clone().subtract(raySphere.node.worldPosition);

  let b = m.dot(direction);
  let c = m.dot(m) - (raySphere.radius + R) * (raySphere.radius + R);
  // 如果c > 0且b > 0，射线起点在球体外部且在球心方向之外，没有交点
  if (c > 0 && b > 0)   {
    return false;
  }
  let discriminant = b * b - c;
  // 如果discriminant < 0，射线与球体没有交点
  if (discriminant < 0) {
    return false;
  }

  // yy.log.w('rayHit RaySphereCollision', raySphere.node.name, discriminant);
  // 射线与球体相交（判别式大于或等于0）
  return true;
}

function rayRectangle14(origin: Vec3, direction: Vec3, rectangle: RayRectangleCollision) {
  let ox = origin.x, oy = origin.y;
  let dx = direction.x, dy = direction.y;
  const DEVIATION = 0.00065; // 修正母球心到库的误差值


  if (dy > 0 && rectangle.node.position.y > 0) { // 上方裤边
    let disY = rectangle.node.worldPosition.y - rectangle.halfLength - R + DEVIATION;
    let t = (disY - oy) / dy;
    let disX = ox + t * dx;
    let left = rectangle.node.worldPosition.x - rectangle.halfWidth - R;
    let right = rectangle.node.worldPosition.x + rectangle.halfWidth + R;
    // yy.log.w("rayRectangle14", origin, direction, rectangle.node.name, disX, left, right);
    if (disX > left && disX < right && oy < disY) {
      return {x: disX, y: disY};
    }
  }
  else if (dy < 0 && rectangle.node.position.y < 0) { // 下方裤边
    let disY = rectangle.node.worldPosition.y + rectangle.halfLength + R - DEVIATION;;
    let t = (disY - oy) / dy;
    let disX = ox + t * dx;
    let left = rectangle.node.worldPosition.x - rectangle.halfWidth - R;
    let right = rectangle.node.worldPosition.x + rectangle.halfWidth + R;
    if (disX > left && disX < right && oy > disY) {
      return {x: disX, y: disY};
    }
  }
  else {
    if (dx > 0 && rectangle.node.position.y === 0) {
      let disX = rectangle.node.worldPosition.x - rectangle.halfWidth - R + DEVIATION;
      let t = (disX - ox) / dx;
      let disY = oy + t * dy;
      let top = rectangle.node.worldPosition.y + rectangle.halfLength + R;
      let bottom = rectangle.node.worldPosition.y - rectangle.halfLength - R;
      if (disY > bottom && disY < top && ox < disX) {
        return {x: disX, y: disY};
      }
    }
    else if (dx < 0 && rectangle.node.position.y === 0) {
      let disX4 = rectangle.node.worldPosition.x + rectangle.halfWidth + R -  DEVIATION;
      let t4 = (disX4 - ox) / dx;
      let disY4 = oy + t4 * dy;
      let top4 = rectangle.node.worldPosition.y + rectangle.halfLength + R;
      let bottom4 = rectangle.node.worldPosition.y - rectangle.halfLength - R;
      if (disY4 > bottom4 && disY4 < top4 && ox > disX4) {
        return {x: disX4, y: disY4};
      }
    }

  }


}







