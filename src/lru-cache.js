/**
 * Simple LRU cache that uses {@link Map} internally to keep only the provided
 * number of entries in the cache. The LRU logic is implemented by resetting
 * any key that is accessed so that it goes to the end of the Map. The first
 * entry in the map would thus always be least recently used, and if capacity
 * is exceeded it is deleted.
 *
 * For safety, this cache doesn't support keys that are null or NaN or
 * undefined.
 *
 * @param capacity Maximum number of entries allowed in this cache
 * @returns LRU object
 * @constructor
 */
export function LRU(capacity) {
  if (capacity <= 0) {
    throw 'Invalid number of items provided';
  }

  return {
    capacity : capacity,
    items : new Map(),

    get : function (key) {
      validateKey(key);

      let value = this.items.get(key);
      // Reset the key so that it goes to the end of the map
      this.items.delete(key);
      this.items.set(key, value);

      return value;
    },

    set : function (key, value) {
      validateKey(key);

      // Remove the key if it's already present so that logic to evict after
      // maxItems works properly and if same key is reinserted it gets inserted
      // at the end of the map.
      this.delete(key);

      while (this.items.size >= capacity) {
        let firstKey = this.items.keys().next().value;
        this.delete(firstKey);
      }

      this.items.set(key, value);
    },

    delete : function (key) {
      validateKey(key);

      this.items.delete(key);
    },

    hasKey : function (key) {
      if (!isKeyValid(key)) {
        return false;
      }
      return this.items.has(key);
    }

  };
}

function validateKey(key) {
  // Last check is for NaN, as only NaN !== NaN
  if (!isKeyValid(key)) {
    throw 'Invalid key';
  }
}

function isKeyValid(key) {
  return !(key === undefined || key === null || key !== key);
}