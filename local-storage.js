'use strict';

var stub = require('./stub');
var tracking = require('./tracking');

// from https://github.com/munkacsimark/local-data-storage/blob/236f1fbb9ef5f794f22361d3c2eff9c7ea5bddec/dist/validator.js#L4
const isLocalStorageAvailable = () => {
  try {
      const storage = global.localStorage;
      const testItem = "__storage_test__";
      storage.setItem(testItem, testItem);
      storage.removeItem(testItem);
      return true;
  }
  catch (e) {
      return false
  }
};

var ls = isLocalStorageAvailable() ? global.localStorage : stub;

function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

function getRaw(key) {
  return ls.getItem(key)
}

function get (key) {
  return JSON.parse(getRaw(key));
}

function set (key, value) {
  try {
    setRaw(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function setRaw(key, stringValue) {
  return ls.setItem(key, stringValue)
}


function remove (key) {
  return ls.removeItem(key);
}

function clear () {
  return ls.clear();
}

accessor.set = set;
accessor.get = get;
accessor.setRaw = setRaw;
accessor.getRaw = getRaw;
accessor.remove = remove;
accessor.clear = clear;
accessor.on = tracking.on;
accessor.off = tracking.off;

module.exports = accessor;
