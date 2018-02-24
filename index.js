const fetch = require("node-fetch");
const path = require("path");

const normalizeName = name =>
  name
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/_/g, "-");

const extensions = {
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const makeBase64Url = (contentType, b64) => {
  return `data:${contentType};base64,${b64}`;
};

const getBase64Url = url => {
  return fetch(url)
    .then(async r => ({
      contentType: r.headers.get("content-type").split(";")[0],
      buffer: await r.buffer()
    }))
    .then(({ contentType, buffer }) => makeBase64Url(contentType, buffer.toString("base64")));
};

const getFromGithub = name => () =>
  getBase64Url(`https://rawgithub.com/gilbarbara/logos/master/logos/${normalizeName(name)}.svg`);

const getFromQwant = name => () =>
  fetch(`https://api.qwant.com/api/search/images?count=10&offset=1&q=logo%20svg%20${normalizeName(name)}&size=small`)
    .then(r => {
      if (r.status === 200) {
        return r.json();
      }
      throw new Error(r.status);
    })
    .then(json => getBase64Url(`${json.data.result.items[0].media}`));

const getLogo = name =>
  Promise.resolve()
    .then(getFromGithub(name))
    .catch(getFromQwant(name));

module.exports = getLogo;

if (require.main === module) {
  getLogo("google").then(console.log);
}
