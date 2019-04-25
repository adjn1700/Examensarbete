export class Location {
    longitude: number;
    latitude: number;
    speed?: number;
    timestamp: Date;

    public constructor(init?:Partial<Location>) {
        Object.assign(this, init);
    }
}
