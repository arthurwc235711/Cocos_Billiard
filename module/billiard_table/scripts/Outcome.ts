import { Ball } from "./Ball"

export enum OutcomeType {
  Pot = "Pot",   // 进洞
  Cushion = "Cushion", // 撞库
  Collision = "Collision", // 球之间碰撞
  Hit = "Hit", // 球杆击打白球
}

export class Outcome {
  type: OutcomeType
  timestamp: number
  ballA: Ball | null = null
  ballB: Ball | null = null
  incidentSpeed: number

  constructor(type, ballA: Ball, ballB: Ball, incidentSpeed) {
    this.type = type
    this.ballA = ballA
    this.ballB = ballB
    this.incidentSpeed = incidentSpeed
    this.timestamp = Date.now()
  }

  static pot(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Pot, ballA, ballA, incidentSpeed)
  }

  static cushion(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Cushion, ballA, ballA, incidentSpeed)
  }

  static collision(ballA, ballB, incidentSpeed) {
    return new Outcome(OutcomeType.Collision, ballA, ballB, incidentSpeed)
  }

  static hit(ballA, incidentSpeed) {
    return new Outcome(OutcomeType.Hit, ballA, ballA, incidentSpeed)
  }

  static isCueBallPotted(cueBall, outcomes: Outcome[]) {
    return outcomes.some(
      (o) => o.type == OutcomeType.Pot && o.ballA === cueBall
    )
  }

  static isBallPottedNoFoul(cueBall, outcomes: Outcome[]) {
    return (
      outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA !== null) &&
      !Outcome.isCueBallPotted(cueBall, outcomes)
    )
  }

  static pots(outcomes: Outcome[]): Ball[] {
    return outcomes
      .filter((o) => o.type == OutcomeType.Pot)
      .map((o) => o.ballA!)
  }
  static potCount(outcomes: Outcome[]) {
    return this.pots(outcomes).length
  }

  static onlyRedsPotted(outcomes: Outcome[]) {
    return this.pots(outcomes).every((b) => b.id > 6)
  }

  static firstCollision(outcomes: Outcome[]) {
    const collisions = outcomes.filter((o) => o.type === OutcomeType.Collision)
    return collisions.length > 0 ? collisions[0] : undefined
  }

  static isClearTable(table) {
    const onTable = table.balls.filter((ball) => ball.onTable())
    return onTable.length === 1 && onTable[0] === table.cueball
  }

  static isThreeCushionPoint(cueBall, outcomes: Outcome[]) {
    outcomes = Outcome.cueBallFirst(cueBall, outcomes).filter(
      (outcome) => outcome.ballA === cueBall
    )
    const cannons = new Set()
    let cushions = 0
    for (const outcome of outcomes) {
      if (outcome.type === OutcomeType.Cushion) {
        cushions++
      }
      if (outcome.type === OutcomeType.Collision) {
        cannons.add(outcome.ballB)
        if (cannons.size === 2) {
          return cushions >= 3
        }
      }
    }
    return false
  }

  static cueBallFirst(cueBall, outcomes) {
    outcomes.forEach((o) => {
      if (o.type === OutcomeType.Collision && o.ballB === cueBall) {
        o.ballB = o.ballA
        o.ballA = cueBall
      }
    })
    return outcomes
  }


  static is8BallPotted(outcomes: Outcome[]) {
    return outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA!.id === 8)
  }

  static isFirstCushion(outcomes: Outcome[]) {
    return outcomes.length > 1 ? outcomes[1].type === OutcomeType.Cushion : false
  }

  static isCollisionNoCushion(outcomes: Outcome[]) {
    let index = 0;
    const hadCollision = outcomes.some((o, i) =>{ index = i;  return o.type === OutcomeType.Collision })
    if (!hadCollision) {
      return true;
    }
    const cushions = outcomes.slice(index);
    return !cushions.some((o) => o.type === OutcomeType.Cushion);
    // return (outcomes.length > 1 ? outcomes[1].type === OutcomeType.Collision : false) &&
    // !outcomes.some(o=>o.type === OutcomeType.Cushion)
  }

  static isIncludeValidPotted(outcome: Outcome[], ballsNum: number[]) {
    return outcome.some((o) => o.type == OutcomeType.Pot && ballsNum.includes(o.ballA!.id))
  }
}
