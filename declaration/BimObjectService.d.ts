/// <reference types="forge-viewer" />
import Model = Autodesk.Viewing.Model;
export declare const BIM_NODE_RELATION_NAME: string;
export declare const BIM_OBJECT_RELATION_NAME: string;
export declare const BIM_OBJECT_VERSION_RELATION_NAME: string;
export declare const BIM_NODE_RELATION_TYPE: string;
export declare const BIM_OBJECT_RELATION_TYPE: string;
export declare const REFERENCE_OBJECT_RELATION_TYPE: string;
export declare const REFERENCE_OBJECT_RELATION_NAME: string;
export declare const BIM_OBJECT_VERSION_RELATION_TYPE: string;
export declare class BimObjectService {
    private mappingModelIdBimFileId;
    private mappingBimFileIdModelId;
    createBIMObjectVerionContext(bimFileId: string): void;
    getBimFileContext(bimFileId: string): any;
    createBIMObjectVersion(bimFileId: string, version: number): void;
    getBIMObjectVersion(bimFileId: string, version: number): any;
    getBIMObject(dbId: number, model: Model): Promise<unknown>;
    createBIMObject(dbid: number, model: Model, name: string): Promise<unknown>;
    static getExternalId(dbId: number, model: Model): Promise<unknown>;
    getDbIdFromExternalId(externalId: string, bimFileId: string): Promise<unknown>;
    addBIMObject(contextId: string, parentId: string, dbId: number, model: Model, name: string): Promise<any>;
    removeBIMObject(parentId: string, bimObjectId: string): Promise<boolean>;
    deleteBImObject(dbId: number, model: Model): Promise<unknown>;
    addReferenceObject(parentId: string, dbId: number, model: Model, name: string): void;
    removeReferenceObject(parentId: string, dbid: number, model: Model): void;
    getAllExternalIdForVersion(bimFileId: string, version: number): Promise<unknown>;
    getDifferenceExternalIdForVersion(version1: number, version2: number, bimFileId: string): Promise<{
        union: string[];
        newBIMObj: string[];
        oldBIMObj: string[];
    }>;
    addModel(bimFileId: string, model: Model, version: number): void;
}
