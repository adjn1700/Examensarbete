export class SelectedRoad{
    county: string;
    countyId: number;
    roadId: number;
    subroadId: number;
    direction: string;
    directionId: number;

    public constructor(init?:Partial<SelectedRoad>) {
        Object.assign(this, init);
    }
}
