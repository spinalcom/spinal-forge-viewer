/// <reference types="forge-viewer" />
import * as THREE from "three";
import GuiViewer3D = Autodesk.Viewing.Private.GuiViewer3D;
import Viewer3D = Autodesk.Viewing.Viewer3D;
import Model = Autodesk.Viewing.Model;
import Extension = Autodesk.Viewing.Extension;
import PropertyResult = Autodesk.Viewing.PropertyResult;
import InstanceTree = Autodesk.Viewing.InstanceTree;
export declare class ForgeViewer {
    viewerContainer: HTMLElement;
    viewer: GuiViewer3D | Viewer3D;
    models: {
        [key: number]: Model;
    };
    viewerInitialized: Promise<boolean>;
    started: Promise<Model>;
    headless: boolean;
    currentModelId: number;
    constructor(containerElement: HTMLElement, headless?: boolean);
    getModel(modelId: number): Model;
    initializeViewer(): Promise<boolean>;
    createViewer(): void;
    start(path: string, interactive?: boolean): Promise<Model>;
    loadModel(path: string, option?: {}): Promise<Model>;
    unLoadModel(model: Model): boolean;
    finish(): void;
    viewerEvent(event: string): Promise<any>;
    resize(): void;
    loadExtension(extensionId: string, options?: {}): Promise<Extension>;
    getExtension(extensionId: string): Extension;
    unloadExtension(extensionId: string): boolean;
    getProperties(dbid: number, modelId: number, onSuccessCallback: (r: PropertyResult) => void, onErrorCallBack: (err: any) => void): void;
    getObjectTree(onSuccessCallback: (result: InstanceTree) => void, onErrorCallback: (err: any) => void, modelId?: number): void;
    getHiddenNodes(): any[];
    isolate(node: number[], model: Model): void;
    toggleSelect(dbid: number[], model: Model, selectionType?: number): void;
    select(dbid: number, model: Model, selectionType?: number): void;
    clearSelection(): void;
    getAggregateSelection(callback: (selections: any) => {}): void;
    /**
     * return the isolated items form all loaded models
     */
    getAggregateIsolation(): void;
    show(dbids: number[], model: Model): void;
    hide(dbids: number[], model: Model): void;
    togglevisibility(dbid: number[], model: Model): void;
    search(text: string, onSuccessCallback: () => void, onErrorCallback: () => void, attributeNames: Array<string>, modelId?: number): void;
    scaleModel(model: Model, scale: number): void;
    setCurrentModel(model: Model): boolean;
    /**
     *
     * @param dbIds
     * @param model
     * @param immediate  true to avoid the default transition.
     */
    fitToView(dbIds: number[], model: Model, immediate?: boolean): void;
    setThemingColor(dbId: number[], color: THREE.Vector4, model: Model, recursive: boolean): void;
    clearThermingColor(model: Model): void;
    hideModel(modelId: number): void;
    showModel(modelId: number, preserveTools?: boolean): void;
    explode(scale: number): void;
}
