export class SelectedRoad{
    county: string;
    countyId: number;
    road: string;
    roadId: number;
    subroadId: number;
    direction: string;
    directionId: number;

    public constructor(init?:Partial<SelectedRoad>) {
        Object.assign(this, init);
    }
}
