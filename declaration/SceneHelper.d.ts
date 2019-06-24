import { SpinalNode } from "spinal-env-viewer-graph-service";
export interface Scene {
    id?: string;
    name: string;
    description?: string;
    autoLoad: boolean;
    type: string;
    [key: string]: any;
}
export declare class SceneHelper {
    private static initialized;
    private static context;
    private static contextName;
    private static type;
    private static contextId;
    private static initialize;
    static createScene(name: string, description: string, autoLoad: true): Promise<SpinalNode>;
    static addModelToScene(sceneId: string, bimFileId: string): Promise<SpinalNode>;
    static getBimFilesFromScene(sceneId: string): any;
    static getSceneFromNode(nodeId: string): Promise<any>;
    static addSceneToNode(nodeId: string, sceneId: string): Promise<any>;
}
