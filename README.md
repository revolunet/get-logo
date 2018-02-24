# get-logo

Returns a b64 logo of your choice

 - search SVG on [gilbarbara/logos](https://github.com/gilbarbara/logos)
 - search whatever on qwant

Please contribute SVGs to [gilbarbara/logos](https://github.com/gilbarbara/logos) so we can have a good collection !

⚠ shouldn't work in the browser due to [CORS](https://enable-cors.org/) limitations.

## Usage

```js
const getLogo = require('get-logo');

getLogo('renault').then(data => {
  console.log(data);
  // data:image/jpeg;base64,/9j/4AAQSkZZBAAAAQDB....
})
```