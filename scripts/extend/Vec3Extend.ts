import { misc, Quat, Vec3 } from "cc";
import { yy } from "../../../../../yy";


declare module "cc" {
    interface Vec3 {           
        /**
        * @zh 设置当前向量x值。
        * @param x 新x值。
        * @returns `this`
        */
        setX(x: number): Vec3;
        /**
        * @zh 设置当前向量y值。
        * @param y 新y值。
        * @returns `this`
        */
        setY(y: number): Vec3;
        /**
        * @zh 设置当前向量z值。
        * @param z 新z值。
        * @returns `this`
        */
        setZ(z: number): Vec3;
        /**
        * @zh 传递的vector3的x, y和z属性的值复制到自身。
        * @param v 复制的Vec3。
        * @returns `this`
        */
        copy(v: Vec3): Vec3;
        /**
        * @zh 计算自身向量到v的距离。
        * @param v 目标Vec3。
        * @returns `this`
        */        
        distanceTo ( v : Vec3 ) : number
        /**
        * @zh 对该矢量应用由轴和角度指定的旋转。。
        * @param axis 轴
        * @param angle 弧度
        * @returns `this`
        */     
        applyAxisAngle( axis: Vec3, angle: number ): Vec3;
        /**
         * 将v和s的倍数加上这个向量。
         * @param v 目标Vec3
         * @param s 倍数
         */
        addScaledVector( v: Vec3, s: number ): Vec3;
        /**
         * 算从这个向量到v的距离的平方，如果你只是比较距离和另一个距离，你应该比较距离的平方，因为它计算起来更有效率。
         * @param v 目标Vec3
         */
        distanceToSquared( v: Vec3 ): number;
        /**
         * 判断当前向量x,y,z是否和v相等。
         * @param v 目标Vec3
         */
        vec3Equals( v: Vec3 ): boolean;
        /**
         * 以弧度为单位返回这个向量和向量v之间的夹角。 转化角度就是 radians * 180 / Math.PI
         * @param v 目标Vec3
         */
        angleTo( v: Vec3 ): number;
    }
}
Vec3.prototype.setX = function (x: number) {
    this.x = x;
    return this;
}
Vec3.prototype.setY = function (y: number) {
    this.y = y;
    return this;
}
Vec3.prototype.setZ = function (z: number) {
    this.z = z;
    return this;
}
Vec3.prototype.copy = function (v: Vec3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;   
}
Vec3.prototype.distanceTo = function (v : Vec3) : number {
    return Vec3.distance(this, v)
}
Vec3.prototype.applyAxisAngle = function ( axis: Vec3, angle: number ) {
    axis = axis.normalize(); // 创建一个归一化的轴向量
    const quat = Quat.fromAxisAngle(new Quat(), axis, angle); // 创建一个表示旋转的四元数
    Vec3.transformQuat(this, this, quat);
    return this;
}
Vec3.prototype.addScaledVector = function ( v: Vec3, s: number ) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
}
Vec3.prototype.distanceToSquared = function ( v: Vec3 ) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
}
Vec3.prototype.vec3Equals = function ( v: Vec3 ) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
}   
Vec3.prototype.angleTo = function (v:Vec3):number {
    return Vec3.angle(this, v);
}