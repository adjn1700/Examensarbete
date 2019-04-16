export class PavementData {
    startContinuousLength: number;
    endContinuousLength: number;
    length: number;
    pavementDate: Date;
    pavementType: string;
    maxStoneSize: number;
    thickness: number;

    public constructor(init?:Partial<PavementData>) {
        Object.assign(this, init);
    }
}
