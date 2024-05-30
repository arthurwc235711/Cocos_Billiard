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
      R = 0.03275;
      TableGeometry.tableX = R * 43
      TableGeometry.tableY = R * 21
      TableGeometry.X = TableGeometry.tableX + R
      TableGeometry.Y = TableGeometry.tableY + R
    }
}


