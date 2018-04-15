import {LRU} from "./lru-cache.js";

const PROBE_RATIO = 0.05;
const MIN_PROBE_TIME = 10 * 1000; // 10s
const MAX_ENTRIES = 256;
const ALPHA = 1.0 / 8;

let e2eLatencies = LRU(MAX_ENTRIES);
let lastProbed = LRU(MAX_ENTRIES);

export function getNearest(addresses) {
  let closest = null;
  let closestLatency = null;
  let probe = Math.random() < PROBE_RATIO;

  shuffle(addresses);

  addresses.forEach(function (address) {
    // TODO : why is this done
    if (probe && !recentlyProbed(address)) {
      lastProbed.set(address, Date.now());
      return address;
    }

    if (closest === null) {
      closest = address;
      closestLatency = e2eLatencies.get(closest);
    }

    let latency = e2eLatencies.get(address);

    if (latency !== undefined && closestLatency !== undefined && latency < closestLatency) {
      closest = address;
      closestLatency = latency;
    }
  });

  return closest;
}


/**
 * Shuffles array in place using Fisher-Yates shuffle algorithm.
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 *
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns true if an address was probed recently, false otherwise
 * @param address
 */
function recentlyProbed(address) {
  let lastProbedTime = lastProbed.get(address);

  return (lastProbedTime !== undefined)
      && (Date.now() - lastProbedTime > MIN_PROBE_TIME);
}

function movingAverage(sample, historicalAverage) {
  return (1 - ALPHA) * historicalAverage + ALPHA * sample;
}

export function learnSample(address, latency) {
  let historical = e2eLatencies.get(address);

  if (historical === undefined) {
    e2eLatencies.set(address, latency);
  } else {
    e2eLatencies.set(address, movingAverage(latency, historical));
  }
}

function prefixMatch() {
  // TODO : this function was only called in tests, if needed implement
}

function toString() {
  // TODO: if needed, return e2eLatencies converted to strings
}