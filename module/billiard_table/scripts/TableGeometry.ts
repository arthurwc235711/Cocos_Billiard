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
      TableGeometry.tableX = r * 43 - (R - r) // r*43 = 1.40825, R-r = 0.01146  =1.39679
      TableGeometry.tableY = r * 21 - (R - r) // r*21 = 0.68775, R-r = 0.01146  =0.67629
      TableGeometry.X = TableGeometry.tableX + R  //1.4410
      TableGeometry.Y = TableGeometry.tableY + R  //0.7205
    }
}


