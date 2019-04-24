export class SelectedRoad{
    county: string;
    countyId: number;
    road: string;
    roadId: number;
    subroadId: number;
    direction: string;

    public constructor(init?:Partial<SelectedRoad>) {
        Object.assign(this, init);
    }
}
