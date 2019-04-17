export class PavementData {
    StartContinuousLength: number;
    EndContinuousLength: number;
    Length: number;
    PavementDate: string;
    PavementType: string;
    MaxStoneSize: number;
    Thickness: number;

    public constructor(init?:Partial<PavementData>) {
        Object.assign(this, init);
    }
}
