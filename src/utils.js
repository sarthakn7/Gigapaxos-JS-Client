const MAX_IDS = 100;

let createdIds = [];

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
    id = random(10000, 10000000000000000);
  } while (createdIds.includes(id));

  addId(id);

  return id;
}

function addId(id) {
  while (createdIds.length >= MAX_IDS) {
    createdIds.shift();
  }
  createdIds.push(id);
}

/**
 * This uses Google's public DNS over https (https://developers.google.com/speed/public-dns/docs/dns-over-https).
 * Cloudfare also offers a similar service: https://developers.cloudflare.com/1.1.1.1/dns-over-https/json-format/
 *
 * @param name Hostname to lookup
 * @param callback Callback which excepts one parameter response, which is called on receiving DNS response
 */
export function dnsQuery(name, callback) {
  fetch(`https://dns.google.com/resolve?name=${name}`, {
    accept: 'application/json, text/plain',
    cache: 'no-cache',
    method : 'GET'
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    callback(response);
  });
}