import { ForgeViewer } from "./ForgeViewer";
import { BimObjectService } from "./BimObjectService";
export declare class SpinalForgeViewer extends ForgeViewer {
    currentSceneId: string;
    scenes: {
        sceneId: string;
        modelIds: number[];
    }[];
    bimObjectService: BimObjectService;
    getScene(modelId: number): {
        sceneId: string;
        modelIds: number[];
    }[];
    getSVF(element: any, nodeId: string, name: string): Promise<{
        version: any;
        path: any;
        id: string;
        name: string;
        thumbnail: any;
    }>;
    loadBimFile(bimfIle: any): Promise<unknown>;
    loadModelFromNode(nodeId: string): Promise<any[]>;
}
