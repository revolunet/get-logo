const fetch = require("node-fetch");

const normalizeName = name =>
  name
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/_/g, "-");

const extensions2 = {
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/Q",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const makeBase64Url = (contentType, b64) => `data:${contentType};base64,${b64}`;

const getBase64FromUrl = async url =>
  fetch(url)
    .then(async r => ({
      contentType: r.headers.get("content-type").split(";")[0],
      buffer: await r.buffer()
    }))
    .then(({ contentType, buffer }) => makeBase64Url(contentType, buffer.toString("base64")));

const getFromGithub = name => () =>
  getBase64FromUrl(
    `https://rawgithub.com/gilbarbara/logos/master/logos/${normalizeName(name)}.svg`
  );

const getFromQwant = name => () =>
  fetch(
    `https://api.qwant.com/api/search/images?count=10&offset=1&q=logo%20svg%20${normalizeName(
      name
    )}&size=small`
  )
    .then(r => {
      if (r.status === 200) {
        return r.json();
      }
      throw new Error(r.status);
    })
    .then(json => {
      const result =
        json.data.result &&
        json.data.result.items &&
        json.data.result.length &&
        json.data.result.items[0];
      if (!result) {
        throw new Error("No results");
      }
      return result && getBase64FromUrl(`${result.media}`);
    });

const getLogo = name =>
  Promise.resolve()
    .then(getFromGithub(name))
    .catch(getFromQwant(name))
    .catch(e => null);

module.exports = getLogo;

if (require.main === module) {
  getLogo("google").then(console.log);
}
