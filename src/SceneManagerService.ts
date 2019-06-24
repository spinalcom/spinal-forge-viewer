import {
  SpinalContext,
  SpinalGraphService,
  SpinalNode
} from "spinal-env-viewer-graph-service";
import {
  PART_RELATION_NAME, PART_RELATION_TYPE,
  SCENE_RELATION_NAME,
  SCENE_RELATION_TYPE, SCENE_TYPE
} from "./Constants";

export interface Scene {
  id? : string;
  name : string;
  description? : string;
  autoLoad : boolean;
  type: string;
  [key: string] : any;
}

export class SceneManagerService {
  private static initialized: Promise<boolean>;
  private static context: SpinalContext;
  private static contextName: string = "Scenes";
  private static type: string = "SpinalService";
  private static contextId: string;

  private static initialize() {
    if (this.initialized !== null) {
      return this.initialized;
    }

    this.initialized = new Promise<boolean>((resolve, reject) => {

      this.context = SpinalGraphService.getContext(this.contextName);
      if (typeof this.context === "undefined") {
        SpinalGraphService.addContext(this.contextName, this.type)
          .then(context => {
            this.context = context;
            this.contextId = context.getId();
            resolve(true);
          }).catch(reject);
      }

      resolve(true);
    });
    return this.initialized;
  }

  public static createScene(name: string, description: string, autoLoad: true): Promise<SpinalNode> {
    return SceneManagerService.initialize().then(() => {
      const sceneId: SpinalNode = SpinalGraphService.createNode({
        name,
        description,
        autoLoad,
        type: SCENE_TYPE
      }, undefined);
      return SpinalGraphService.addChildInContext(this.contextId, sceneId, this.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    });

  }

  public static addModelToScene(sceneId: string, bimFileId: string): Promise<SpinalNode> {
    return SceneManagerService.initialize().then(() => {

      return SpinalGraphService.addChildInContext(sceneId, bimFileId, this.contextId, PART_RELATION_NAME, PART_RELATION_TYPE);
    })
  }

  public static getBimFilesFromScene(sceneId: string) {
    return SceneManagerService.initialize().then(() => {
      return SpinalGraphService.getChildren(sceneId, [PART_RELATION_NAME]);

    })
  }

  public static getSceneFromNode(nodeId: string) : Promise<any>{
    return SceneManagerService.initialize().then(() => {
      return SpinalGraphService.getChildren(nodeId, [SCENE_RELATION_NAME])

    })
  }

  public static addSceneToNode(nodeId: string, sceneId: string) {
    return SceneManagerService.initialize().then(() => {
      return SpinalGraphService.addChildInContext(nodeId, sceneId, this.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    })
  }

}

