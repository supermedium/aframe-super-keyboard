## aframe-simple-keyboard-component

[![Version](http://img.shields.io/npm/v/aframe-simple-keyboard-component.svg?style=flat-square)](https://npmjs.org/package/aframe-simple-keyboard-component)
[![License](http://img.shields.io/npm/l/aframe-simple-keyboard-component.svg?style=flat-square)](https://npmjs.org/package/aframe-simple-keyboard-component)

Lightweight and functional keyboard for VR

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| label |   |  <empty string> |
| labelColor |   |  #aaa |
| labelBgColor |   |  #000 |
| bgColor |   |  #000 |
| hoverColor |   |  #1A407F |
| pressColor |   |  #5290F6 |
| fontColor |   |  #6699ff |
| keyboardColor |   |  #6699ff |
| maxlength |   |  0 (no maximum) |
| model |   | 'basic' |
| width |   | 0.5 (meters) |
| value |   |  <empty string> |
| interval |   |  50 |
| filters |   | <none> |
| font |   | 'aileronsemibold' |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-simple-keyboard-component/dist/aframe-simple-keyboard-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity simple-keyboard="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-simple-keyboard-component
```

Then require and use.

```js
require('aframe');
require('aframe-simple-keyboard-component');
```
