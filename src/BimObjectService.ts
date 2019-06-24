
import {
  SpinalGraphService,
  SPINAL_RELATION_LST_PTR_TYPE
} from "spinal-env-viewer-graph-service";
import Model = Autodesk.Viewing.Model;


export const BIM_NODE_RELATION_NAME: string = "hasBimNode";
export const BIM_OBJECT_RELATION_NAME: string = "hasBimObject";

export const BIM_OBJECT_VERSION_RELATION_NAME: string = "hasBimVersion";
export const BIM_NODE_RELATION_TYPE: string = SPINAL_RELATION_LST_PTR_TYPE;
export const BIM_OBJECT_RELATION_TYPE: string = SPINAL_RELATION_LST_PTR_TYPE;
export const REFERENCE_OBJECT_RELATION_TYPE: string = SPINAL_RELATION_LST_PTR_TYPE;
export const REFERENCE_OBJECT_RELATION_NAME: string = "hasReferenceObject";
export const BIM_OBJECT_VERSION_RELATION_TYPE: string = SPINAL_RELATION_LST_PTR_TYPE;

export class BimObjectService {
  private mappingModelIdBimFileId: { [modelId: number]: { bimFileId: string, version: number } };
  private mappingBimFileIdModelId: { [bimFileId: string]: { modelId: number, version: number, model: Model } };

  createBIMObjectVerionContext(bimFileId: string) {
    SpinalGraphService.getChildren(bimFileId, [BIM_NODE_RELATION_NAME]).then(children => {
      if (children.length > 0)
        return children[0];

      const nodeId = SpinalGraphService.createNode({
        name: "BIMObjectContext",
        currentVersion: 0
      }, undefined);
      SpinalGraphService.addChild(bimFileId, nodeId, BIM_NODE_RELATION_NAME, BIM_NODE_RELATION_TYPE);
    })
  }

  getBimFileContext(bimFileId: string) : any {
    return SpinalGraphService.getChildren(bimFileId, [BIM_NODE_RELATION_NAME]).then(children => {
      if (children.length > 0)
        return children[0];
      return undefined;
    })
  }

  createBIMObjectVersion(bimFileId: string, version: number) {
    this.getBimFileContext(bimFileId).then(context => {
      const nodeId = SpinalGraphService.createNode({version}, undefined);
      SpinalGraphService.addChild(context.id, nodeId, BIM_OBJECT_VERSION_RELATION_NAME, BIM_OBJECT_VERSION_RELATION_TYPE);
    })
  }

  getBIMObjectVersion(bimFileId: string, version: number) {
    return this.getBimFileContext(bimFileId).then(context => {
      SpinalGraphService.getChildren(context.id, [BIM_OBJECT_VERSION_RELATION_NAME])
        .then(children => {
          return children.find((node) => {
            return node.version === version
          });
        })
    })
  }

  getBIMObject(dbId: number, model: Model) {
    return new Promise(async (resolve, reject) => {
      try {
        const externalId = await BimObjectService.getExternalId(dbId, model);
        // @ts-ignore
        const modelMeta = this.mappingModelIdBimFileId[model.id];
        this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version)
          .then(node => {
            // @ts-ignore
            SpinalGraphService.getChildren(node.id, [BIM_OBJECT_RELATION_NAME]).then(children => {
              resolve(children.find((node) => {
                return node.externalId === externalId
              }));
            })
          })

      } catch (e) {
        reject(e);
      }
    })
  }

  createBIMObject(dbid: number, model: Model, name: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const externalId = await BimObjectService.getExternalId(dbid, model);
        // @ts-ignore
        const modelMeta = this.mappingModelIdBimFileId[model.id];
        const nodeId = SpinalGraphService.createNode({
          type: 'BIMObject',
          bimFileId: modelMeta.bimFileId,
          version: modelMeta.version,
          externalId,
          dbid,
          name
        }, undefined);
        // @ts-ignore

        this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version).then(node => {
          // @ts-ignore
          SpinalGraphService.addChild(node.id, nodeId, BIM_OBJECT_RELATION_NAME, BIM_OBJECT_RELATION_TYPE).then(resolve)
        })
      } catch (e) {
        reject(e);
      }
    })
  }

  static getExternalId(dbId: number, model: Model) {
    return new Promise((resolve, reject) => {
      model.getProperties(dbId, (props) => {
        resolve(props.externalId);
      }, reject);
    })
  }

  getDbIdFromExternalId(externalId: string, bimFileId: string) {
    return new Promise((resolve, reject) => {
      const modelMeta = this.mappingBimFileIdModelId[bimFileId];
      const model = modelMeta.model;
      model.getExternalIdMapping(res => {
        resolve(res[externalId]);
      }, reject);
    })
  }

  addBIMObject(contextId: string, parentId: string, dbId: number, model: Model, name: string) {
    return this.getBIMObject(dbId, model).then(bimObject => {
      if (bimObject) {
        // @ts-ignore
        return SpinalGraphService.addChildInContext(parentId, bimObject.id, contextId, BIM_OBJECT_RELATION_NAME, BIM_NODE_RELATION_TYPE)
      }

      this.createBIMObject(dbId, model, name).then(child => {
        // @ts-ignore
        return SpinalGraphService.addChildInContext(parentId, child.getId(), contextId, BIM_OBJECT_RELATION_NAME, BIM_NODE_RELATION_TYPE)
      })
    })
  }

  removeBIMObject(parentId: string, bimObjectId: string) {
    return SpinalGraphService.removeChild(parentId, bimObjectId, BIM_NODE_RELATION_NAME, BIM_NODE_RELATION_TYPE);
  }

  deleteBImObject(dbId: number, model: Model) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const modelMetaData = this.mappingModelIdBimFileId[model.id];
      const externalId = BimObjectService.getExternalId(dbId, model);

      this.getBIMObject(dbId, model).then(bimObject => {
        // @ts-ignore
        return SpinalGraphService.getRealNode(bimObject.id).removeFromGraph();
      })
    })
  }

  addReferenceObject(parentId: string, dbId: number, model: Model, name: string) {
    this.getBIMObject(dbId, model).then(child => {
      // @ts-ignore
      SpinalGraphService.addChild(parentId, child.id, REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE)
    })
  }

  removeReferenceObject(parentId: string, dbid: number, model: Model) {
    this.getBIMObject(dbid, model).then((child) => {
      // @ts-ignore
      SpinalGraphService.removeChild(parentId, child.id, REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE);
    })

  }

  getAllExternalIdForVersion(bimFileId: string, version: number) {
    return new Promise(resolve => {

      this.getBIMObjectVersion(bimFileId, version).then(child => {
        // @ts-ignore
        SpinalGraphService.getChildren(child.id, [BIM_OBJECT_RELATION_NAME])
          .then(children => {
            resolve(children.map(children => {
              return children.externalId
            }));
          })
      })
    })
  }

  getDifferenceExternalIdForVersion(version1: number, version2: number, bimFileId: string) {
    const promise = [];
    promise.push(this.getAllExternalIdForVersion(bimFileId, version1));
    promise.push(this.getAllExternalIdForVersion(bimFileId, version2));

    return Promise.all(promise).then((result: Array<Array<string>>) => {
      const union = result[0].filter((node) => {
        return typeof result[1].find(n => {
          // @ts-ignore
          return n.externalId === node.externalId
        }) !== "undefined";
      });
      const newBIMObj = result[0].filter((node) => {
        return typeof result[1].find(n => {
          // @ts-ignore
          return n.externalId === node.externalId
        }) === "undefined";
      });
      const oldBIMObj = result[1].filter((node) => {
        return typeof result[0].find(n => {
          // @ts-ignore
          return n.externalId === node.externalId
        }) !== "undefined";
      });

      return {union, newBIMObj, oldBIMObj};

    })
  }

  addModel(bimFileId : string, model: Model, version: number){
    // @ts-ignore
    this.mappingModelIdBimFileId[model.id] = {bimFileId, number};
    // @ts-ignore
    this.mappingBimFileIdModelId[bimFileId] = {modelId: model.id, version, model}
  }
}