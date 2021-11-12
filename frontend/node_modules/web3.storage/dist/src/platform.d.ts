import { MemoryBlockStore } from 'ipfs-car/blockstore/memory';
export declare const fetch: typeof globalThis.fetch;
export declare const Blob: {
    new (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob;
    prototype: Blob;
};
export declare const File: {
    new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag | undefined): File;
    prototype: File;
};
export declare const Blockstore: typeof MemoryBlockStore;
//# sourceMappingURL=platform.d.ts.map