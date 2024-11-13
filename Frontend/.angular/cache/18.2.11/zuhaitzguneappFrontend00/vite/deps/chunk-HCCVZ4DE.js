// node_modules/ol/util.js
function abstract() {
  throw new Error("Unimplemented abstract method.");
}
var uidCounter_ = 0;
function getUid(obj) {
  return obj.ol_uid || (obj.ol_uid = String(++uidCounter_));
}

export {
  abstract,
  getUid
};
//# sourceMappingURL=chunk-HCCVZ4DE.js.map