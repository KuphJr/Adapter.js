'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var memory = require('ipfs-car/blockstore/memory');

// TODO: Use indexedDb

const fetch = globalThis.fetch;
const Request = globalThis.Request;
const Response = globalThis.Response;
const Blob = globalThis.Blob;
const File = globalThis.File;
const Blockstore = memory.MemoryBlockStore;

exports.Blob = Blob;
exports.Blockstore = Blockstore;
exports.File = File;
exports.Request = Request;
exports.Response = Response;
exports.fetch = fetch;
//# sourceMappingURL=platform.web.cjs.map
