import { R } from "../../../scripts/physics/constants"

export class TableGeometry  {
    static tableX: number
    static tableY: number
    static X: number
    static Y: number
    static hasPockets: boolean = true
  
    static {
      TableGeometry.scaleToRadius(R)
    }
  
    static scaleToRadius(R) {
      let r = 0.03275;
      TableGeometry.tableX = r * 43 - (R - r)
      TableGeometry.tableY = r * 21 - (R - r)
      TableGeometry.X = TableGeometry.tableX + R
      TableGeometry.Y = TableGeometry.tableY + R
    }
}


