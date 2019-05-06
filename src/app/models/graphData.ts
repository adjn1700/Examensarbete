export class GraphData {
    StartContinuousLength: number;
    EndContinuousLength: number;
    IRIRight: number;
    EdgeDepth: number;
    RutDepthMax17: number;
    CrossfallRutBottom: number;

    public constructor(init?:Partial<GraphData>) {
        Object.assign(this, init);
    }
}
