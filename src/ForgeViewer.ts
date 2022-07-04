/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import * as THREE from 'three';
import GuiViewer3D = Autodesk.Viewing.Private.GuiViewer3D;
import Viewer3D = Autodesk.Viewing.Viewer3D;
import Model = Autodesk.Viewing.Model;
import Extension = Autodesk.Viewing.Extension;
import PropertyResult = Autodesk.Viewing.PropertyResult;
import InstanceTree = Autodesk.Viewing.InstanceTree;
import SelectionMode = Autodesk.Viewing.SelectionMode;

export class ForgeViewer {
  public viewerContainer: HTMLElement;
  public viewer: GuiViewer3D | Viewer3D;
  public models: { [key: number]: Model };
  public viewerInitialized: Promise<boolean>;
  public started: Promise<any>;
  public headless: boolean;
  public currentModelId: number;

  constructor(containerElement: HTMLElement, headless: boolean = false) {
    this.viewerContainer = containerElement;
    this.viewer = null;
    this.models = {};
    this.viewerInitialized = null;
    this.started = null;
    this.headless = headless;
  }

  getModel(modelId: number): Model {
    return this.models[modelId];
  }

  initializeViewer() {
    if (this.viewerInitialized !== null) return this.viewerInitialized;

    const options = {
      env: 'Local',
      docid: '',
      useADP: false,
    };

    this.viewerInitialized = new Promise((resolve) => {
      Autodesk.Viewing.Initializer(options, () => {
        resolve(true);
      });
    });

    return this.viewerInitialized;
  }

  createViewer() {
    if (this.headless)
      this.viewer = new Autodesk.Viewing.Viewer3D(this.viewerContainer, {});
    else
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(
        this.viewerContainer,
        {}
      );
  }

  start(): Promise<any> {
    if (this.started !== null) return this.started;
    this.createViewer();
    this.started = this.initializeViewer();
    return this.started;
  }

  loadModel(path: string, option = {}, start: boolean = false): Promise<Model> {
    return new Promise((resolve, reject) => {
      let m = undefined;
      const fn = (e: any) => {
        if (m && e.model.id === m.id) {
          this.viewer.removeEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            fn
          );
          resolve(m);
        }
      };
      this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fn);
      let fct = start ? this.viewer.start : this.viewer.loadModel;
      // @ts-ignore
      fct.call(
        this.viewer,
        path,
        option,
        (model: Model) => {
          m = model;
          this.models[m.id] = m;
        },
        reject
      );
    });
  }

  unLoadModel(model: Model): boolean {
    // @ts-ignore
    if (this.models.hasOwnProperty(model.id)) {
      // @ts-ignore
      this.viewer.impl.unLoadModel(model);

      // @ts-ignore
      delete this.models[model.id];
      return true;
    }
    return false;
  }

  finish(): void {
    if (this.viewer) this.viewer.finish();
  }

  viewerEvent(event: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const handler = (e: any) => {
        this.viewer.removeEventListener(event, handler);
        resolve(e);
      };
      this.viewer.addEventListener(event, handler);
    });
  }

  resize(): void {
    // @ts-ignore
    if (this.viewer && this.viewer.impl) {
      this.viewer.resize();
    }
  }

  loadExtension(extensionId: string, options = {}): Promise<Extension> {
    return this.viewer.loadExtension(extensionId, options);
  }

  getExtension(extensionId: string): Extension {
    return this.viewer.getExtension(extensionId);
  }

  unloadExtension(extensionId: string): boolean {
    // @ts-ignore
    return this.viewer.unloadExtension(extensionId);
  }

  getProperties(
    dbid: number,
    modelId: number,
    onSuccessCallback: (r: PropertyResult) => void,
    onErrorCallBack: (err: any) => void
  ) {
    if (!this.models.hasOwnProperty(modelId)) {
      return onErrorCallBack('Not found');
    }
    return this.models[modelId].getProperties(
      dbid,
      onSuccessCallback,
      onErrorCallBack
    );
  }

  getObjectTree(
    onSuccessCallback: (result: InstanceTree) => void,
    onErrorCallback: (err: any) => void,
    modelId: number = this.currentModelId
  ) {
    if (!this.models.hasOwnProperty(modelId)) {
      return onErrorCallback('Not Found');
    }
    return this.models[modelId].getObjectTree(
      onSuccessCallback,
      onErrorCallback
    );
  }

  getHiddenNodes() {
    //work only with one model viewer3D line 74116
    return this.viewer.getHiddenNodes();
  }

  isolate(node: number[], model: Model) {
    // @ts-ignore
    this.viewer.isolate(node, model);
  }

  toggleSelect(
    dbid: number[],
    model: Model,
    selectionType: number = SelectionMode.REGULAR
  ) {
    // @ts-ignore
    this.viewer.toggleSelect(dbid, model, selectionType);
  }

  select(
    dbid: number,
    model: Model,
    selectionType: number = SelectionMode.REGULAR
  ) {
    // @ts-ignore
    this.viewer.select(dbid, model, selectionType);
  }

  clearSelection() {
    this.viewer.clearSelection();
  }

  getAggregateSelection(callback: (selections: any) => {}) {
    // @ts-ignore
    this.viewer.getAggregateSelection(callback);
  }

  /**
   * return the isolated items form all loaded models
   */
  getAggregateIsolation() {
    // @ts-ignore
    this.viewer.getAggregateIsolation();
  }

  show(dbids: number[], model: Model) {
    // @ts-ignore
    this.viewer.show(dbids, model);
  }

  hide(dbids: number[], model: Model) {
    // @ts-ignore
    this.viewer.hide(dbids, model);
  }

  togglevisibility(dbid: number[], model: Model) {
    // @ts-ignore
    this.viewer.toggleVisibility(dbid, model);
  }

  search(
    text: string,
    onSuccessCallback: () => void,
    onErrorCallback: () => void,
    attributeNames: Array<string>,
    modelId: number = this.currentModelId
  ) {
    if (!this.models.hasOwnProperty(modelId)) {
      return onErrorCallback();
    }

    return this.models[modelId].search(
      text,
      onSuccessCallback,
      onErrorCallback,
      attributeNames
    );
  }

  scaleModel(model: Model, scale: number) {
    const fragCount = model.getFragmentList().fragments.fragId2dbId.length;

    //fragIds range from 0 to fragCount-1
    for (var fragId = 0; fragId < fragCount; ++fragId) {
      // @ts-ignore
      const fragProxy = this.viewer.impl.getFragmentProxy(model, fragId);

      fragProxy.getAnimTransform();

      fragProxy.scale = new THREE.Vector3(scale, scale, scale);

      fragProxy.updateAnimTransform();
    }

    // @ts-ignore
    this.viewer.impl.sceneUpdated(true);
  }

  setCurrentModel(model: Model): boolean {
    // @ts-ignore
    const id = model.id;
    if (!this.models.hasOwnProperty(id)) return false;

    this.currentModelId = id;
    // @ts-ignore
    this.viewer.impl.model = model;

    return true;
  }

  /**
   *
   * @param dbIds
   * @param model
   * @param immediate  true to avoid the default transition.
   */
  fitToView(dbIds: number[], model: Model, immediate: boolean = false) {
    // @ts-ignore
    this.viewer.fitToView(dbIds, model, immediate);
  }

  setThemingColor(
    dbId: number[],
    color: THREE.Vector4,
    model: Model,
    recursive: boolean
  ) {
    color.setX(color.x > 1 ? color.x / 255 : color.x);
    color.setY(color.y > 1 ? color.y / 255 : color.y);
    color.setY(color.z > 1 ? color.z / 255 : color.z);
    // @ts-ignore
    this.viewer.setThemingColor(dbId, color, model, recursive);
  }

  clearThermingColor(model: Model) {
    this.viewer.clearThemingColors(model);
  }

  hideModel(modelId: number) {
    this.viewer.hideModel(modelId);
  }

  showModel(modelId: number, preserveTools: boolean = false) {
    // @ts-ignore
    this.viewer.showModel(modelId, preserveTools);
  }
  explode(scale: number) {
    this.viewer.explode(scale);
  }
}
