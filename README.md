# Javascript client for [Gigapaxos](https://github.com/MobilityFirst/gigapaxos "Gigapaxos")

This is a Javascript client for [Gigapaxos](https://github.com/MobilityFirst/gigapaxos "Gigapaxos").

## Build Instructions

1. Install NPM if needed
2. Install webpack: npm install webpack -g (or locally in repo)
3. Run npx webpack or npx webpack --mode development for quicker build without uglification
4. gpClient.js is generated in dist folder
5. Update the version in package.json and run npm publish to publish a new version to NPM (NPM authoring settings need to be done separately, [this](https://docs.npmjs.com/getting-started/publishing-npm-packages) is a good resource).

# Usage

Include the generated file gpClient.js via script tag. Client functions can then be accessed using the global variable gpClient.

# Running Example

Start Python server in base directory:

`python3 -m http.server 13080`

Open in browser:
`http://0.0.0.0:13080/usage_example/example.html`