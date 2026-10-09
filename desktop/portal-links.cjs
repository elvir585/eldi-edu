'use strict';
// Only named destinations are accepted over IPC; renderer input is never a URL.
const destinations = Object.freeze({
  center: 'https://upinitk.com/eldi-edu/',
  instructions: 'https://upinitk.com/eldi-edu/#upute',
  support: 'https://upinitk.com/eldi-edu/#podrska',
  releases: 'https://github.com/elvir585/eldi-edu/releases/latest'
});
function portalURL(destination) {
  if (typeof destination !== 'string' || !Object.hasOwn(destinations,destination)) throw new Error('Nepoznata adresa obrazovnog centra.');
  return destinations[destination];
}
module.exports = {portalURL};
