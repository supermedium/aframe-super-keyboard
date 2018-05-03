/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('simple-keyboard', {
  schema: {
    label: {type: 'string', default: ''},
    labelColor: {type: 'color', default: '#aaa'},
    labelBgColor: {type: 'color', default: '#000'},
    bgColor: {type: 'color', default: '#000'},
    hoverColor: {type: 'color', default: '#1A407F'},
    pressColor: {type: 'color', default: '#5290F6'},
    fontColor: {type: 'color', default: '#6699ff'},
    keyboardColor: {type: 'color', default: '#6699ff'},
    maxlength: {type: 'int', default: 0},
    model: {default: 'basic'},
    width: {default: 0.5},
    value: {type: 'string', default: 'm'},
    interval: {type: 'int', default: 50},
    filters: {type: 'array'},
    font: {default: 'aileronsemibold'}, //aileronsemibold
    hand: {type: 'selector'},
    imagePath: {default: '.'},
    blinkingSpeed: {type: 'int', default: 600}
  },

  init: function(){
    this.KEYBOARDS = {
      'basic': {img: this.data.imagePath + "/sk-basic.png", layout: [{"key":"f", "x":0.345, "y":0.423, "w":0.071, "h":0.189}, {"key":"g", "x":0.416, "y":0.423, "w":0.071, "h":0.189}, {"key":"1", "x":0.093, "y":0.042, "w":0.071, "h":0.187}, {"key":"2", "x":0.164, "y":0.042, "w":0.071, "h":0.187}, {"key":"3", "x":0.234, "y":0.042, "w":0.071, "h":0.187}, {"key":"4", "x":0.304, "y":0.042, "w":0.071, "h":0.187}, {"key":"5", "x":0.375, "y":0.042, "w":0.071, "h":0.187}, {"key":"6", "x":0.445, "y":0.042, "w":0.071, "h":0.187}, {"key":"7", "x":0.515, "y":0.042, "w":0.071, "h":0.187}, {"key":"8", "x":0.585, "y":0.042, "w":0.071, "h":0.187}, {"key":"9", "x":0.656, "y":0.042, "w":0.072, "h":0.187}, {"key":"0", "x":0.727, "y":0.042, "w":0.07, "h":0.187}, {"key":"Delete", "x":0.853, "y":0.056, "w":0.113, "h":0.146}, {"key":"Enter", "x":0.854, "y":0.386, "w":0.113, "h":0.267}, {"key":"Escape", "x":0.883, "y":0.779, "w":0.083, "h":0.14}, {"key":"Shift", "x":0.016, "y":0.623, "w":0.088, "h":0.187}, {"key":"q", "x":0.093, "y":0.228, "w":0.071, "h":0.197}, {"key":"w", "x":0.164, "y":0.228, "w":0.071, "h":0.197}, {"key":"e", "x":0.234, "y":0.228, "w":0.071, "h":0.197}, {"key":"r", "x":0.304, "y":0.228, "w":0.071, "h":0.197}, {"key":"t", "x":0.375, "y":0.228, "w":0.071, "h":0.197}, {"key":"y", "x":0.445, "y":0.228, "w":0.071, "h":0.197}, {"key":"u", "x":0.515, "y":0.228, "w":0.071, "h":0.197}, {"key":"i", "x":0.585, "y":0.228, "w":0.071, "h":0.197}, {"key":"o", "x":0.656, "y":0.228, "w":0.072, "h":0.197}, {"key":"p", "x":0.727, "y":0.228, "w":0.07, "h":0.197}, {"key":"a", "x":0.134, "y":0.423, "w":0.071, "h":0.189}, {"key":"s", "x":0.205, "y":0.423, "w":0.071, "h":0.189}, {"key":"d", "x":0.275, "y":0.423, "w":0.071, "h":0.189}, {"key":"h", "x":0.486, "y":0.423, "w":0.071, "h":0.189}, {"key":"j", "x":0.556, "y":0.423, "w":0.071, "h":0.189}, {"key":"k", "x":0.626, "y":0.423, "w":0.072, "h":0.189}, {"key":"l", "x":0.698, "y":0.423, "w":0.07, "h":0.189}, {"key":"z", "x":0.213, "y":0.611, "w":0.071, "h":0.185}, {"key":"x", "x":0.284, "y":0.611, "w":0.071, "h":0.185}, {"key":"c", "x":0.354, "y":0.611, "w":0.071, "h":0.185}, {"key":"v", "x":0.424, "y":0.611, "w":0.071, "h":0.185}, {"key":"b", "x":0.495, "y":0.611, "w":0.071, "h":0.185}, {"key":"n", "x":0.565, "y":0.611, "w":0.072, "h":0.185}, {"key":"m", "x":0.636, "y":0.611, "w":0.07, "h":0.185}, {"key":" ", "x":0.257, "y":0.818, "w":0.438, "h":0.136}] }
    };

    this.keys = null;
    this.focused = false;
    this.keyHover = null;
    this.prevCheckTime = null;
    this.shift = false;

    this.rawValue = this.data.value;
    this.defaultValue = this.data.value;

    this.intervalId = 0;

    this.kbImg = document.createElement('a-entity');
    this.el.appendChild(this.kbImg);
    this.kbImg.classList.add('keyboard-raycastable');
    this.kbImg.addEventListener('raycaster-intersected', this.hover.bind(this));
    this.kbImg.addEventListener('raycaster-intersected-cleared', this.blur.bind(this));

    this.label = document.createElement('a-entity');
    this.label.setAttribute('text', {align: 'center', font: this.data.font, baseline: 'bottom', lineHeight:40, value: this.data.label, color: this.data.labelColor, width: this.data.width, wrapCount:30});
    this.el.appendChild(this.label);

    this.textInput = document.createElement('a-entity');
    this.textInput.setAttribute('text', {align: 'center', font: this.data.font, value: this.data.value, color: this.data.fontColor, width: this.data.width, wrapCount:20});
    this.el.appendChild(this.textInput);
    this.textInputBg = document.createElement('a-entity');
    this.textInputBg.setAttribute('position', {x: 0, y: 0, z: -0.001});
    this.textInputBg.setAttribute('geometry', {primitive: 'plane', width: this.data.width, height: this.data.width / 10});
    this.textInputBg.setAttribute('material', {shader: 'flat', color: this.data.labelBgColor});
    this.textInput.appendChild(this.textInputBg);

    this.cursor = document.createElement('a-entity');
    this.cursor.setAttribute('position', {x: 0, y: 0, z: 0.001});
    this.cursor.setAttribute('geometry', {primitive: 'plane', width: 0.014, height: 0.04});
    this.cursor.setAttribute('material', {shader: 'flat', color: this.data.fontColor});
    this.textInput.appendChild(this.cursor); 


    document.addEventListener('open', this.open.bind(this));
    this.hand = this.data.hand;
  },

  filter: function(str){
    if (str == '') return '';
    for (var i = 0; i < this.data.filters.length; i++) {
      switch(this.data.filters[i]){
        case 'allupper': 
          str = str.toUpperCase(); 
          break;
        case 'alllower': 
          str = str.toLowerCase(); 
          break;
        case 'title': 
          str = str.split(' ').map(function(s) {return s[0].toUpperCase() + s.substr(1)}).join(' ');
          break;
        case 'first':
          str = str[0].toUpperCase() + str.substr(1);
          break;
        case 'trim':
          str = str.trim();
          break;
      }
    }
    return this.data.maxlength > 0 ? str.substr(0, this.data.maxlength) : str;
  },

  click: function(ev){
    if (!this.keyHover){ return; }
    switch(this.keyHover.key){
      case 'Enter':
        this.accept();
      break;
      case 'Delete':
        this.rawValue = this.rawValue.substr(0, this.rawValue.length - 1);
        this.data.value = this.filter(this.rawValue);
        this.textInput.setAttribute('text', {value: this.data.value});
      break;
      case 'Shift':
        this.shift = !this.shift;
        this.keyHover.el.setAttribute('material', {color: this.shift ? this.data.hoverColor : this.data.bgColor});
        return;
      break;
      case 'Escape':
        this.dismiss();
      break;
      default:
        if (this.data.maxlength > 0 && this.rawValue.length > this.data.maxlength) { break; }
        this.rawValue += this.shift ? this.keyHover.key.toUpperCase() : this.keyHover.key;
        this.data.value = this.filter(this.rawValue);
        this.textInput.setAttribute('text', {value: this.data.value});
      break;
    }
    this.keyHover.el.setAttribute('material', {color: this.data.pressColor});
  },

  open: function(){
    this.el.setAttribute('visible', true);
  },

  accept: function(){
    this.el.setAttribute('visible', false);
    this.el.emit('keyboard-accepted', {value: this.data.value});
  },

  dismiss: function(){
    this.data.value = this.defaultValue;
    this.textInput.setAttribute('text', {value: this.data.value});
    this.el.setAttribute('visible', false);
    this.el.emit('keyboard-dismissed');
  },

  blur: function(ev) {
    this.focused = false;
    if (this.keyHover && this.keyHover.key != 'Shift') this.keyHover.el.setAttribute('material', {color: this.data.bgColor});
    this.keyHover = null;
  },

  hover: function(ev) {
    this.focused = true;
  },

  updateCursorPosition: function(w) {
    function findFontChar(chars, code){
      for (var i = 0; i < chars.length; i++) {
        if (chars[i].id == code) return chars[i];
      }
      return null;
    }
    var font = this.textInput.components.text.currentFont;
    var wf = font.widthFactor;
    var pos = 0;
    for (var i = 0; i < this.data.value.length; i++) {
      var char = findFontChar(font.chars, this.data.value.charCodeAt(i));
      pos += (char.width - 0.54 * wf) / (40 * wf);
    }
//    pos += 0.02 * w;
    this.cursor.setAttribute('position', {x: pos, y: 0, z: 0.001});
  },

  update: function(oldData){
    var self = this;
    var kbdata = this.KEYBOARDS[this.data.model];
    var w = this.data.width;
    var h = this.data.width / 2;
    var w2 = w / 2;
    var h2 = h / 2;
    
    if (!oldData || this.defaultValue != oldData.defaultValue){
      this.rawValue = this.data.value;
      this.defaultValue = this.data.value;
      this.textInput.setAttribute('text', {value: this.filter(this.data.value)});
    } else {
      this.textInput.setAttribute('text', {value: this.filter(this.rawValue)});
    }

    this.kbImg.setAttribute('geometry', {primitive: 'plane', width: w, height: h});
    this.kbImg.setAttribute('material', {shader: 'flat', src: kbdata.img, color: this.data.keyboardColor, transparent: true});

    this.textInput.setAttribute('text', {width: w});
    this.textInput.setAttribute('position', {x: 0, y: 0.35 * w, z: -0.04});
    this.textInputBg.setAttribute('geometry', {width: w, height: w / 10});

    this.cursor.setAttribute('geometry', {primitive: 'plane', width: 0.03 * w, height: 0.06 * w});
    window.setTimeout(function(){ self.updateCursorPosition(w); }, 1000);

    this.label.setAttribute('text', {value: this.data.label, color: this.data.labelColor, width: this.data.width});
    this.label.setAttribute('position', {x: 0, y: 0.45 * w, z: -0.02});

    if (this.keys) {
      this.keys.parentNode.removeChild(this.keys);
    };

    this.keys = document.createElement('a-entity');
    this.el.appendChild(this.keys);
    this.keys.setAttribute('position', {x: 0, y: 0, z: 0.001});

    for (var i = 0; i < kbdata.layout.length; i++) {
      var kdata = kbdata.layout[i];
      var keyw = kdata.w * w;
      var keyh = kdata.h * h;
      var key = document.createElement('a-entity');
      key.setAttribute('data-key', kdata.key);
      key.setAttribute('position', {x: kdata.x * w - w2 + keyw / 2, y: (1 - kdata.y) * h - h2 - keyh / 2, z: 0})
      key.setAttribute('geometry', {primitive: 'plane', width: keyw, height: keyh});
      key.setAttribute('material', {shader: 'flat', color: this.data.bgColor, transparent: true});
      kdata.el = key;
      key.addEventListener('loaded', function(ev){
        ev.target.object3D.children[0].material.blending = THREE.AdditiveBlending;
      })
      this.keys.appendChild(key);
    }

    this.hand = this.data.hand;
    if (this.hand === null) {
      this.hand = document.querySelector('[raycaster]');
    }
    if (this.hand) {
      this.hand.addEventListener('triggerdown', this.click.bind(this));
    } else {
      console.warn('Simple-Keyboard Warning: no controller found');
    }
  },

  play: function () {
    this.runInterval();
  },

  pause: function () {
    this.stopInterval();
  },

  runInterval: function () {
    this.stopInterval();
    this.intervalId = window.setInterval(this.blink.bind(this), this.data.blinkingSpeed);
  },

  stopInterval: function () {
    window.clearInterval(this.intervalId);
    this.intervalId = 0;
  },

  blink: function () {
    this.cursor.setAttribute('visible', !this.cursor.getAttribute('visible'));
  },

  tick: function (time) {
    if (this.prevCheckTime && (time - this.prevCheckTime < this.data.interval)) { return; }
    this.prevCheckTime = time;
    if (this.focused){
      var uv = this.hand.components.raycaster.getIntersection(this.kbImg).uv;
      var keys = this.KEYBOARDS[this.data.model].layout;
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (uv.x > k.x && uv.x < k.x + k.w && (1.0 - uv.y) > k.y && (1.0 - uv.y) < k.y + k.h) {
          if (this.keyHover && (this.keyHover.key != 'Shift' || !this.shift)) this.keyHover.el.setAttribute('material', {color: this.data.bgColor});
          k.el.setAttribute('material', {color: this.data.hoverColor});
          this.keyHover = k;
          break;
        }
      }
    }
  }
});