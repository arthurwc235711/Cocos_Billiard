
// import { Ball } from "../../module/table/scripts/Ball"
import { yy } from "../../../../../yy";
import { Ball } from "../../module/billiard_table/scripts/Ball"
import { BilliardManager } from "../BilliardManager"
import { R } from "./constants"

export class Collision {
  static isPointPerpendicularToSegment(A, B, C) {
    // 计算向量 BC
    const BC = { x: C.x - B.x, y: C.y - B.y };
    
    // 计算线段 BC 的长度的平方
    const BCLengthSquared = BC.x * BC.x + BC.y * BC.y;

    // 计算点 A 到点 B 的向量
    const AB = { x: A.x - B.x, y: A.y - B.y };

    // 计算投影的比例
    const t = (AB.x * BC.x + AB.y * BC.y) / BCLengthSquared;

    // 限制 t 的范围在 [0, 1] 之间
    const clampedT = Math.max(0, Math.min(1, t));

    // 计算交点 D 的坐标
    const D = {
        x: B.x + clampedT * BC.x,
        y: B.y + clampedT * BC.y
    };

    // 计算向量 AD
    const AD = { x: D.x - A.x, y: D.y - A.y };

    // 计算点积
    const dotProduct = AD.x * BC.x + AD.y * BC.y;

    // 判断是否垂直
    return  AD;//dotProduct === 0;
}




  static willCollide(a: Ball, b: Ball, t: number): boolean {
    if (a.id === 0) { 
      if ((a.inMotion() && b.isStationary()) &&
      a.onTable() &&
      b.onTable()
      ) {
        if ( a.futurePosition(t).distanceToSquared(b.futurePosition(t)) < 4 * R * R) {
          return true;
        } 
        // 切边碰撞判断修正
        const table = BilliardManager.instance.getTable();
        if (b === table.shotBall) {
          const af = a.futurePosition(t);
          const center = Collision.isPointPerpendicularToSegment({ x: b.pos.x, y:b.pos.y }, { x: a.pos.x, y:a.pos.y }, { x: af.x, y: af.y }) ;
          const result = center.x * center.x + center.y * center.y < 4 * R * R;
          if (result) {          
            yy.log.e("result is true")
          }
          return result
        }
      }
    }

    return (
      (a.inMotion() || b.inMotion()) &&
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceToSquared(b.futurePosition(t)) < 4 * R * R
    )
  }

  static collide(a: Ball, b: Ball) {
    return Collision.updateVelocities(a, b)
  }

  static positionsAtContact(a: Ball, b: Ball) {
    const sep = a.pos.distanceTo(b.pos)
    const rv = a.vel.clone().subtract(b.vel)
    const t = (sep - 2 * R) / rv.length() || 0
    return {
      a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t),
    }
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    // a.ballmesh.trace.forceTrace(contact.a)
    // b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.subtract(contact.a).normalize()
    const aDotCenters = ab.dot(a.vel)
    const bDotCenters = ab.dot(b.vel)
    a.vel.addScaledVector(ab, bDotCenters).addScaledVector(ab, -aDotCenters)
    b.vel.addScaledVector(ab, aDotCenters).addScaledVector(ab, -bDotCenters)
    a.setSliding();
    b.setSliding();
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)
  }
}
