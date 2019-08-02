<p align="center">
  <img src="./Chonky.jpg" alt="Chonky">
</p>

[![NPM](https://img.shields.io/npm/v/chonky.svg)](https://www.npmjs.com/package/chonky)

Chonky is a file browser component for React. It tries to recreate the native file browsing experience in your browser.
This means your users can make selections, drag & drop files, toggle file view between "large thumbnails" and "detailed
list", enter folders, and so on.

What Chonky **does not** do is fetching information about the files. It is **your** responsibility to provide file
information, either by making Ajax request to your server, adding necessary FS logic to your Electron app or creating
some virtual FS inside your web application.

## Install

```bash
npm install --save chonky
```

## Usage

```tsx
import * as React from 'react';

import {FileBrowser} from 'chonky';

class Example extends React.Component {
    render() {
        return (
            <FileBrowser fileMap={{}} fileIds={[]}/>
        );
    }
}
```

## License

MIT © [TimboKZ](https://github.com/TimboKZ)