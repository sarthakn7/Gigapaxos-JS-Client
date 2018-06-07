import {REQUEST_TYPES} from './request_types.js';
import {createId} from "./utils.js";
import {learnSample, getNearest} from "./e2e_latency_aware_redirector";
import {log} from './logger.js';

class ActivesInfo {
  constructor(actives, lastUpdated) {
    this.actives = actives;
    this.lastUpdated = lastUpdated;
  }
}

const MIN_REQUEST_ACTIVES_INTERVAL = 60000;
const HTTP_PORT_OFFSET = 300; // TODO: replace with mechanism to obtain this

let broadcastName = '**'; // TODO: comes from config
let reconfiguratorAddress;
// TODO: later: two different initialize, one sets reconfigurator address, one kind of looks up reconfigurator addresses in a dns-like way
let activesInfo = null; // TODO: map from service name to actives

let updatingActiveReplicas = false;
let pendingAppRequests = [];

let updateActiveReplicasCallback = function (response) {
  let now = Date.now();
  let actives = [];
  for (let activeReplica of response['ACTIVE_REPLICAS']) {
    actives.push(createActiveReplicaAddress(activeReplica));
  }
  activesInfo = new ActivesInfo(actives, now);
  updatingActiveReplicas = false;

  while (pendingAppRequests.length > 0) {
    let requestAndCallback = pendingAppRequests.shift();
    sendRequestToActive(requestAndCallback.request, requestAndCallback.callback);
  }
};

export function initialize(newReconfiguratorAddress) {
  reconfiguratorAddress = newReconfiguratorAddress;
}

/**
 * Adds the HTTP_PORT_OFFSET to the address, and also prefixes with 'http:/'.
 *
 * @param receivedAddress Address received from reconfigurators
 * @returns {string} HTTP address for active replica
 */
function createActiveReplicaAddress(receivedAddress) {
  let addressAndPort = receivedAddress.split(':');
  let httpPort = parseInt(addressAndPort[1]) + HTTP_PORT_OFFSET;

  return `http:/${addressAndPort[0]}:${httpPort}`;
}

function sendRequest(request, address, callback) {
  fetch(address, {
    body: JSON.stringify(request), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, same-origin, *omit
    headers: {
    // 'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // *manual, follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    if (callback !== null && callback !== undefined) {
      callback(response); // TODO : can add additional checks here
    }
  })
  .catch(function (reason) {
    console.log('Error : ' + reason);
  });
}

// Reconfigurator functions

export function createService(serviceName, initialState, callback) {
  checkInitialized();

  let request = {
    IS_QUERY:true,
    EPOCH:0, // TODO: where is epoch coming from
    RECURSIVE_REDIRECT:true,
    CREATE_TIME:Date.now(),
    TYPE : REQUEST_TYPES.CREATE_SERVICE_NAME, // TODO: check if type needs to be sent for this request
    RECONFIGURE_UPON_ACTIVES_CHANGE: 'REPLICATE_ALL',
    serviceName : serviceName,
    initialState : initialState,
    QID: createId(),
    NAME: '**'
  };

  sendRequest(request, reconfiguratorAddress, callback);

  // TODO : send request to reconfigurator
}

function updateActiveReplicas(name) {
  updatingActiveReplicas = true;
  requestActiveReplicas(name, updateActiveReplicasCallback);
}

function requestActiveReplicas(name, callback) {
  let request = {
    IS_QUERY:true,
    RECURSIVE_REDIRECT:true,
    CREATE_TIME:Date.now(),
    TYPE : REQUEST_TYPES.REQUEST_ACTIVE_REPLICAS,
    QID: createId(),
    NAME: name
  };

  sendRequest(request, reconfiguratorAddress, callback);
}

const EXECUTE_TYPE = 2000;

export function sendDispersibleRequest(service, request, callback) {
  sendAppRequest(service, EXECUTE_TYPE, {APP_REQUEST: request}, createCallback(callback));
}

function createCallback(appCallback) {
  return function (response) {
    let appResponse = JSON.parse(response["APP_RESPONSE"]);
    appCallback(appResponse)
  }
}

// App request

export function sendAppRequest(serviceName, type, content, callback) {
  checkInitialized();

  let request = {
    REQUEST_ID : createId(),
    SERVICE_NAME : serviceName,
    type : type,
  };

  for (let key in content) {
    if (request[key] !== undefined) {
      throw `Key : {key} cannot be added to content as it is reserved for internal function`;
    }

    request[key] = content[key];
  }

  let completeCallback = createCompleteCallback(request, callback);
  sendRequestToActive(request, completeCallback);
}

function checkInitialized() {
  if (reconfiguratorAddress === undefined) {
    throw "Client not initialized";
  }
}

function createCompleteCallback(address, callback) {
  let sentTime = Date.now();
  return function (response) {
    callback(response);

    // From function updateBestReplica (ReconfigurableAppClientAsync:473)
    // TODO: Below two lines are supposed to run for uncoordinated requests only. For coordinated mostRecentlyWrittenMap entry is added
    let latency = Date.now() - sentTime; // TODO: can use timing api for getting more accurate latency
    learnSample(address, latency);
  }
}

function sendRequestToActive(request, callback) {
  if (updatingActiveReplicas) {
    queueRequest(request, callback);
  } else {
    if (activesInfo !== null && activesInfo.actives.length > 0 && queriedActivesRecently()) {
      let nearestActive = getNearest(activesInfo.actives);
      sendRequest(request, nearestActive, callback);
    } else {
      queueRequest(request, callback);
      updateActiveReplicas(request.SERVICE_NAME);
    }
  }
}

/**
 * Add request to {@link pendingAppRequests} to be executed after active
 * replicas are updated.
 *
 * @param request App request to be sent
 * @param callback Callback to be processed with the response of app request
 */
function queueRequest(request, callback) {
  pendingAppRequests.push({
    request : request,
    callback : callback
  });
}

function queriedActivesRecently() {
  // TODO: additional condition which wasn't understood
  return activesInfo !== null && activesInfo.lastUpdated !== null
      && (Date.now() - activesInfo.lastUpdated < MIN_REQUEST_ACTIVES_INTERVAL);

}