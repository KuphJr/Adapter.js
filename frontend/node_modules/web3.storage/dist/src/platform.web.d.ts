export const fetch: typeof globalThis.fetch;
export const Request: {
    new (input: RequestInfo, init?: RequestInit | undefined): Request;
    prototype: Request;
};
export const Response: {
    new (body?: BodyInit | null | undefined, init?: ResponseInit | undefined): Response;
    prototype: Response;
    error(): Response;
    redirect(url: string, status?: number | undefined): Response;
};
export const Blob: {
    new (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob;
    prototype: Blob;
};
export const File: {
    new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag | undefined): File;
    prototype: File;
};
export const Blockstore: typeof MemoryBlockStore;
import { MemoryBlockStore } from "ipfs-car/blockstore/memory";
//# sourceMappingURL=platform.web.d.ts.map