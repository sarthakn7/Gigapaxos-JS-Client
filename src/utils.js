let createdIds = []; // TODO: make this bounded

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function createId() {
  let id;

  // We store created IDs to make sure that unique IDs are returned, but this
  // is lost on page reload while the socket stays the same. So while the address
  // would have differed in a new tab or window due to a different socket, in
  // this case the address would be the same, with some (very minute) probability
  // of a repetition of ID.
  // TODO: see if above needs to be addressed. Apart from using HTML5 storage, we can also see if socket can be refreshed on reload

  do {
    id = random(1000000000000, 10000000000000000);
  } while (!createdIds.includes(id)); // TODO: keep number of checks bounded

  createdIds.push(id);

  return id;
}