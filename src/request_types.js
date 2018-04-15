export const REQUEST_TYPES = {
  REQUEST : 'REQUEST',
  REPLICABLE_REQUEST : 'REPLICABLE_REQUEST',

  CLIENT_REQUEST : 'CLIENT_REQUEST',
  ECHO_REQUEST : 'ECHO_REQUEST',
  REPLICABLE_CLIENT_REQUEST : 'REPLICABLE_CLIENT_REQUEST',

  ACTIVE_REPLICA_ERROR : 'ACTIVE_REPLICA_ERROR',

  CLIENT_RECONFIGURATION_PACKET : 'CLIENT_RECONFIGURATION_PACKET',
  DELETE_SERVICE_NAME : 'DELETE_SERVICE_NAME',
  REQUEST_ACTIVE_REPLICAS : 236,
  CREATE_SERVICE_NAME : 234,
  SERVER_RECONFIGURATION_PACKET : 'SERVER_RECONFIGURATION_PACKET',

};

// TODO : make sure all conditions are correct

export function isReplicableRequest(type) {
  return type === REQUEST_TYPES.REPLICABLE_REQUEST;
}

export function isClientRequest(type) {
  return type === REQUEST_TYPES.CLIENT_REQUEST;
}

export function isEchoRequest(type) {
  return type === REQUEST_TYPES.ECHO_REQUEST;
}

export function isReplicableClientRequest(type) {
  return type === REQUEST_TYPES.REPLICABLE_CLIENT_REQUEST;
}

export function isActiveReplicaError(type) {
  return type === REQUEST_TYPES.ACTIVE_REPLICA_ERROR;
}

export function isClientReconfigurationPacket(type) {
  return type === REQUEST_TYPES.CLIENT_RECONFIGURATION_PACKET;
}

export function isDeleteServiceName(type) {
  return type === REQUEST_TYPES.DELETE_SERVICE_NAME;
}

export function isRequestActiveReplicas(type) {
  return type === REQUEST_TYPES.REQUEST_ACTIVE_REPLICAS;
}

export function isCreateServiceName(type) {
  return type === REQUEST_TYPES.CREATE_SERVICE_NAME;
}

export function isServerReconfigurationPacket(type) {
  return type === REQUEST_TYPES.SERVER_RECONFIGURATION_PACKET;
}
