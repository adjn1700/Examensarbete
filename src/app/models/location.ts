export class Location {
    longitude: number;
    latitude: number;
    speed?: number;

    public constructor(init?:Partial<Location>) {
        Object.assign(this, init);
    }
}
