import { ForgeViewer } from "./ForgeViewer";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import { SCENE_TYPE } from "./Constants";

import { loadModelPtr } from "./utils";
import { SceneManagerService } from "./SceneManagerService";

export class SpinalForgeViewer extends ForgeViewer {

  public currentSceneId: string;
  public scenes: { sceneId: string, modelIds: number[] }[];
  public bimObjectService: BimObjectService = new BimObjectService();


  getScene(modelId: number) {
    return this.scenes.filter((scene) => {
      return scene.modelIds.indexOf(modelId) !== -1
    })
  };

  getSVF(element: any, nodeId: string, name: string) {
    return loadModelPtr(element.ptr)
      .then(elem => {
          return loadModelPtr(elem.currentVersion)
        }
      )
      .then(elem => {
          if (elem.hasOwnProperty('items'))
            for (let i = 0; i < elem.items.length; i++)
              if (elem.items[i].path.get().indexOf('svf') !== -1) {
                return {
                  version: elem.versionId,
                  path: elem.items[i].path.get(),
                  id: nodeId,
                  name,
                  thumbnail: elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
                };
              }
          return undefined;
        }
      );
  }

  loadBimFile(bimfIle: any) {
    return new Promise(resolve => {
      this.getSVF(bimfIle.element, bimfIle.id, bimfIle.name)
        .then((svfVersionFile) => {
          this.loadModel(svfVersionFile.path)
            .then(model => {
              this.bimObjectService
                .addModel(bimfIle.id, model, svfVersionFile.version);
              resolve({bimFileId: bimfIle.id, model})
            })
        })
    })
  }

  async loadModelFromNode(nodeId: string): Promise<any[]> {
    try {
      const node = await SpinalGraphService.getNodeAsync(nodeId);
      if (node.type === SCENE_TYPE) {
        return SceneManagerService.getBimFilesFromScene(nodeId)
          .then((children: any) => {
            const promises = [];
            for (let i = 0; i < children.length; i++) {
              promises.push(this.loadBimFile(children[i]));
            }
            return Promise.all(promises);

          });
      } else
        return SceneManagerService.getSceneFromNode(nodeId)
          .then((scene: { id: string }) => {
            return this.loadModelFromNode(scene.id)
          })
    } catch (e) {
      console.error(e);
    }
  }

}