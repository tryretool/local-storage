'use strict';

var stub = require('./stub');
var tracking = require('./tracking');

// from https://github.com/munkacsimark/local-data-storage/blob/236f1fbb9ef5f794f22361d3c2eff9c7ea5bddec/dist/validator.js#L4
const isLocalStorageAvailable = () => {
  const storage = global.localStorage;
  try {
      const testItem = "__storage_test__";
      storage.setItem(testItem, testItem);
      storage.removeItem(testItem);
      return true;
  }
  catch (e) {
      return (e instanceof DOMException &&
          (e.code === 22 ||
              e.code === 1014 ||
              e.name === "QuotaExceededError" ||
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
          storage &&
          storage.length !== 0);
  }
};

var ls = isLocalStorageAvailable() ? global.localStorage : stub;

function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

function get (key) {
  return JSON.parse(ls.getItem(key));
}

function set (key, value) {
  try {
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function remove (key) {
  return ls.removeItem(key);
}

function clear () {
  return ls.clear();
}

accessor.set = set;
accessor.get = get;
accessor.remove = remove;
accessor.clear = clear;
accessor.on = tracking.on;
accessor.off = tracking.off;

module.exports = accessor;
