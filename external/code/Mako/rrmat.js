"use strict";
var RRMatrix, RRSlideshow, approxFraction, arraysEqual, deepCopy, makeArray, texFraction,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

deepCopy = function(x) {
  var k, l, len, out, v;
  if (x instanceof Array) {
    out = [];
    for (l = 0, len = x.length; l < len; l++) {
      v = x[l];
      out.push(deepCopy(v));
    }
    return out;
  } else if ((x != null) && typeof x === 'object') {
    out = {};
    for (k in x) {
      v = x[k];
      out[k] = deepCopy(v);
    }
    return out;
  } else {
    return x;
  }
};

arraysEqual = function(a, b) {
  var i, l, ref;
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }
    for (i = l = 0, ref = a.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
      if (!arraysEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
};

makeArray = function(rows, cols, val) {
  var i, j, l, m, ref, ref1, ret, row;
  ret = [];
  for (i = l = 0, ref = rows; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
    row = [];
    for (j = m = 0, ref1 = cols; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
      row.push(val);
    }
    ret.push(row);
  }
  return ret;
};

approxFraction = function(x, error) {
  var lower_d, lower_n, middle_d, middle_n, n, upper_d, upper_n;
  if (error == null) {
    error = .00001;
  }
  n = Math.floor(x);
  x -= n;
  if (x < error) {
    return [n, 1];
  } else if (1 - error < x) {
    return [n + 1, 1];
  }
  lower_n = 0;
  lower_d = 1;
  upper_n = 1;
  upper_d = 1;
  while (true) {
    middle_n = lower_n + upper_n;
    middle_d = lower_d + upper_d;
    if (middle_d * (x + error) < middle_n) {
      upper_n = middle_n;
      upper_d = middle_d;
    } else if (middle_n < (x - error) * middle_d) {
      lower_n = middle_n;
      lower_d = middle_d;
    } else {
      return [n * middle_d + middle_n, middle_d];
    }
  }
};

texFraction = function(x, error) {
  var den, minus, num, ref;
  if (error == null) {
    error = 0.00001;
  }
  ref = approxFraction(x, error), num = ref[0], den = ref[1];
  if (den === 1) {
    return num.toString();
  }
  minus = num < 0 ? '-' : '';
  num = Math.abs(num);
  return minus + "\\frac{" + num + "}{" + den + "}";
};

RRSlideshow = (function(superClass) {
  extend(RRSlideshow, superClass);

  function RRSlideshow() {
    return RRSlideshow.__super__.constructor.apply(this, arguments);
  }

  RRSlideshow.prototype.rowSwap = function(row1, row2, opts) {
    var k, keys, l, len, ref, slides;
    if (opts == null) {
      opts = {};
    }
    keys = (ref = opts.keys) != null ? ref : ['chain'];
    delete opts.keys;
    slides = this.controller.rowSwap(row1, row2, opts);
    for (l = 0, len = keys.length; l < len; l++) {
      k = keys[l];
      this.addSlide(slides[k]);
    }
    return this;
  };

  RRSlideshow.prototype.rowMult = function(rowNum, factor, opts) {
    var k, keys, l, len, ref, slides;
    if (opts == null) {
      opts = {};
    }
    keys = (ref = opts.keys) != null ? ref : ['chain'];
    delete opts.keys;
    slides = this.controller.rowMult(rowNum, factor, opts);
    for (l = 0, len = keys.length; l < len; l++) {
      k = keys[l];
      this.addSlide(slides[k]);
    }
    return this;
  };

  RRSlideshow.prototype.rowRep = function(sourceRow, factor, targetRow, opts) {
    var k, keys, l, len, ref, slides;
    if (opts == null) {
      opts = {};
    }
    keys = (ref = opts.keys) != null ? ref : ['chain'];
    delete opts.keys;
    slides = this.controller.rowRep(sourceRow, factor, targetRow, opts);
    for (l = 0, len = keys.length; l < len; l++) {
      k = keys[l];
      this.addSlide(slides[k]);
    }
    return this;
  };

  RRSlideshow.prototype.unAugment = function(opts) {
    this.addSlide(this.controller.unAugment(opts));
    return this;
  };

  RRSlideshow.prototype.reAugment = function(opts) {
    this.addSlide(this.controller.reAugment(opts));
    return this;
  };

  RRSlideshow.prototype.setStyle = function(transitions, opts) {
    this.addSlide(this.controller.setStyle(transitions, opts));
    return this;
  };

  RRSlideshow.prototype.highlightPivots = function(opts) {
    this.addSlide(this.controller.highlightPivots(opts));
    return this;
  };

  return RRSlideshow;

})(Slideshow);

RRMatrix = (function(superClass) {
  var StyleSlide;

  extend(RRMatrix, superClass);

  RRMatrix.prototype.styleKeys = ['color', 'opacity', 'transform'];

  function RRMatrix(numRows, numCols, view, mathbox, opts) {
    var empty, i, j, l, len, m, name, o, prop, q, ref, ref1, ref2, ref3, ref4, ref5, s, startAugmented, state, t, u;
    this.numRows = numRows;
    this.numCols = numCols;
    this.view = view;
    this.resize = bind(this.resize, this);
    this.alignBaselines = bind(this.alignBaselines, this);
    this.htmlMatrix = bind(this.htmlMatrix, this);
    this.jumpState = bind(this.jumpState, this);
    this.computePositions = bind(this.computePositions, this);
    this._id = bind(this._id, this);
    ref = opts || {}, name = ref.name, this.fontSize = ref.fontSize, this.rowHeight = ref.rowHeight, this.rowSpacing = ref.rowSpacing, this.defSpeed = ref.defSpeed, this.colSpacing = ref.colSpacing, this.augmentCol = ref.augmentCol, startAugmented = ref.startAugmented;
    if (name == null) {
      name = "rrmat";
    }
    if (this.fontSize == null) {
      this.fontSize = 20;
    }
    if (this.rowHeight == null) {
      this.rowHeight = this.fontSize * 1.2;
    }
    if (this.rowSpacing == null) {
      this.rowSpacing = this.fontSize;
    }
    if (this.colSpacing == null) {
      this.colSpacing = this.fontSize;
    }
    this.matHeight = this.rowHeight * this.numRows + this.rowSpacing * (this.numRows - 1);
    if (startAugmented == null) {
      startAugmented = this.augmentCol != null;
    }
    if (this.defSpeed == null) {
      this.defSpeed = 1.0;
    }
    this.domClass = MathBox.DOM.createClass({
      render: (function(_this) {
        return function(el, props, children) {
          props = deepCopy(props);
          props.innerHTML = children;
          props.innerHTML += '<span class="baseline-detect"></span>';
          return el('span', props);
        };
      })(this)
    });
    this.timers = [];
    this.swapLineSamples = 30;
    this.matrixElts = [];
    this.multFlyerElt = void 0;
    this.addFlyerElts = [];
    this.rrepParenLeftElt = void 0;
    this.rrepParenRightElt = void 0;
    state = new State(this);
    state.addVal({
      key: 'positions',
      val: makeArray(this.numRows + 4, this.numCols, [0, 0, 0]),
      copy: deepCopy,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.positions.set('data', val);
        };
      })(this)
    });
    for (j = l = 0, ref1 = this.numCols; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
      for (i = m = 0; m <= 3; i = ++m) {
        state.positions[this.numRows + i][j] = [1000, -1000, 0];
      }
    }
    state.addVal({
      key: 'matWidth',
      val: 0.0
    });
    state.addVal({
      key: 'html',
      val: makeArray(this.numRows + 4, this.numCols, ''),
      copy: deepCopy
    });
    state.addVal({
      key: 'styles',
      val: makeArray(this.numRows + 4, this.numCols, {}),
      copy: deepCopy,
      install: (function(_this) {
        return function(rrmat, val) {
          var app;
          app = function(a, b) {
            var k, v;
            for (k in a) {
              v = a[k];
              if (b[k] !== v) {
                b[k] = v;
              }
            }
            return null;
          };
          return rrmat.onNextFrame(1, function() {
            var o, q, ref2, ref3, ref4, s;
            for (i = o = 0, ref2 = _this.numRows; 0 <= ref2 ? o < ref2 : o > ref2; i = 0 <= ref2 ? ++o : --o) {
              for (j = q = 0, ref3 = _this.numCols; 0 <= ref3 ? q < ref3 : q > ref3; j = 0 <= ref3 ? ++q : --q) {
                app(val[i][j], _this.matrixElts[i][j].style);
              }
            }
            app(val[_this.numRows][0], _this.multFlyerElt.style);
            for (j = s = 0, ref4 = _this.numCols; 0 <= ref4 ? s < ref4 : s > ref4; j = 0 <= ref4 ? ++s : --s) {
              app(val[_this.numRows + 1][j], _this.addFlyerElts[j].style);
            }
            app(val[_this.numRows + 2][0], _this.rrepParenLeftElt.style);
            return app(val[_this.numRows + 3][0], _this.rrepParenRightElt.style);
          });
        };
      })(this)
    });
    empty = {};
    ref2 = this.styleKeys;
    for (o = 0, len = ref2.length; o < len; o++) {
      prop = ref2[o];
      empty[prop] = '';
    }
    empty.transition = '';
    for (j = q = 0, ref3 = this.numCols; 0 <= ref3 ? q < ref3 : q > ref3; j = 0 <= ref3 ? ++q : --q) {
      for (i = s = 0, ref4 = this.numRows + 3; 0 <= ref4 ? s <= ref4 : s >= ref4; i = 0 <= ref4 ? ++s : --s) {
        state.styles[i][j] = deepCopy(empty);
      }
    }
    for (i = t = 0; t <= 3; i = ++t) {
      for (j = u = 0, ref5 = this.numCols; 0 <= ref5 ? u < ref5 : u > ref5; j = 0 <= ref5 ? ++u : --u) {
        state.styles[this.numRows + i][j].opacity = 0;
      }
    }
    state.addVal({
      key: 'matrix',
      val: makeArray(this.numRows, this.rumCols, 0),
      copy: deepCopy
    });
    state.addVal({
      key: 'bracket',
      val: makeArray(4, 2, 0),
      copy: deepCopy,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.bracket.set('data', val);
        };
      })(this)
    });
    state.addVal({
      key: 'swapLine',
      val: makeArray(this.swapLineSamples + 1, 2, 0),
      copy: deepCopy,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.swapLine.set('data', val);
        };
      })(this)
    });
    state.addVal({
      key: 'swapOpacity',
      val: 0.0,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.swapLineGeom.set('opacity', val);
        };
      })(this)
    });
    state.addVal({
      key: 'augment',
      val: [[0, 0], [0, 0]],
      copy: deepCopy,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.augment.set('data', val);
        };
      })(this)
    });
    state.addVal({
      key: 'doAugment',
      val: startAugmented,
      install: (function(_this) {
        return function(rrmat, val) {
          return _this.augmentGeom.set('visible', val);
        };
      })(this)
    });
    state.addVal({
      key: 'caption',
      val: ''
    });
    RRMatrix.__super__.constructor.call(this, name, state, mathbox);
    this.createMathbox();
  }

  RRMatrix.prototype.createMathbox = function() {
    var bracketLeft, bracketRight, dom, html, htmlProps, i, j, l, len, m, o, observer, q, ref, ref1, ref2, ref3, ref4, s, tform;
    this.positions = this.view.matrix({
      data: this.state.positions,
      width: this.numCols,
      height: this.numRows + 4,
      channels: 3,
      classes: [this.name],
      id: this._id('positions')
    });
    this.htmlMatrix(this.state.matrix, this.state.html);
    htmlProps = makeArray(this.numRows + 4, this.numCols, {});
    for (i = l = 0, ref = this.numRows; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
      for (j = m = 0, ref1 = this.numCols; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        htmlProps[i][j] = {
          id: this._id(i + "-" + j),
          className: this.name + " bound-entry matrix-entry"
        };
      }
    }
    htmlProps[this.numRows][0] = {
      id: this._id('multFlyer'),
      className: this.name + " bound-entry mult-flyer"
    };
    for (j = o = 0, ref2 = this.numCols; 0 <= ref2 ? o < ref2 : o > ref2; j = 0 <= ref2 ? ++o : --o) {
      htmlProps[this.numRows + 1][j] = {
        id: this._id("addFlyer-" + j),
        className: this.name + " bound-entry add-flyer"
      };
    }
    htmlProps[this.numRows + 2][0] = {
      id: this._id('rrepParenLeft'),
      className: this.name + " bound-entry rrep-factor"
    };
    htmlProps[this.numRows + 3][0] = {
      id: this._id('rrepParenRight'),
      className: this.name + " bound-entry rrep-factor"
    };
    ref3 = [this.numRows, this.numRows + 2, this.numRows + 3];
    for (q = 0, len = ref3.length; q < len; q++) {
      i = ref3[q];
      for (j = s = 1, ref4 = this.numCols; 1 <= ref4 ? s < ref4 : s > ref4; j = 1 <= ref4 ? ++s : --s) {
        htmlProps[i][j] = {
          style: {
            display: 'none'
          },
          className: this.name
        };
      }
    }
    html = this.view.html({
      width: this.numCols,
      height: this.numRows + 4,
      classes: [this.name],
      live: true,
      expr: (function(_this) {
        return function(emit, el, j, i) {
          return emit(el(_this.domClass, htmlProps[i][j], _this.state.html[i][j]));
        };
      })(this)
    });
    dom = this.view.dom({
      snap: false,
      offset: [0, 0],
      depth: 0,
      zoom: 1,
      outline: 0,
      size: this.fontSize,
      classes: [this.name],
      id: this._id('dom'),
      opacity: 0,
      attributes: {
        style: {
          height: "0px"
        }
      }
    });
    this.bracket = this.view.array({
      channels: 2,
      width: 4,
      classes: [this.name],
      id: this._id('bracket'),
      data: this.state.bracket
    });
    bracketLeft = this.view.line({
      color: "black",
      width: 2,
      classes: [this.name],
      id: this._id('bracketLeft'),
      opacity: 0
    });
    tform = bracketLeft.transform({
      scale: [-1, 1, 1],
      classes: [this.name]
    });
    bracketRight = tform.line({
      color: "black",
      width: 2,
      classes: [this.name],
      id: this._id('bracketRight'),
      opacity: 0
    });
    this.augment = this.view.array({
      channels: 2,
      width: 2,
      classes: [this.name],
      id: this._id('augment'),
      data: this.state.augment
    });
    this.augmentGeom = this.view.line({
      color: "black",
      width: 1,
      classes: [this.name],
      id: this._id('augmentGeom'),
      opacity: 0,
      visible: this.state.doAugment
    });
    this.swapLine = this.view.array({
      channels: 2,
      width: this.swapLineSamples + 1,
      classes: [this.name],
      id: this._id('swapLine'),
      data: this.state.swapLine
    });
    this.swapLineGeom = this.view.line({
      color: "green",
      width: 4,
      start: true,
      end: true,
      opacity: 0,
      id: this._id('swapLineGeom'),
      classes: [this.name]
    });
    this.onNextFrame(1, (function(_this) {
      return function() {
        var ref5, ref6, ref7, row, t, u, w;
        _this.alignBaselines();
        for (i = t = 0, ref5 = _this.numRows; 0 <= ref5 ? t < ref5 : t > ref5; i = 0 <= ref5 ? ++t : --t) {
          row = [];
          for (j = u = 0, ref6 = _this.numCols; 0 <= ref6 ? u < ref6 : u > ref6; j = 0 <= ref6 ? ++u : --u) {
            row.push(document.getElementById(_this.name + "-" + i + "-" + j));
          }
          _this.matrixElts.push(row);
        }
        _this.multFlyerElt = document.getElementById(_this._id('multFlyer'));
        for (j = w = 0, ref7 = _this.numCols; 0 <= ref7 ? w < ref7 : w > ref7; j = 0 <= ref7 ? ++w : --w) {
          _this.addFlyerElts.push(document.getElementById(_this._id("addFlyer-" + j)));
        }
        _this.rrepParenLeftElt = document.getElementById(_this._id('rrepParenLeft'));
        return _this.rrepParenRightElt = document.getElementById(_this._id('rrepParenRight'));
      };
    })(this));
    this.onNextFrame(9, (function(_this) {
      return function() {
        var resize;
        resize = _this.resize();
        _this.anims.push(resize);
        resize.on('stopped', function() {
          return _this.state.install();
        });
        return resize.start();
      };
    })(this));
    this.onNextFrame(10, (function(_this) {
      return function() {
        var anim, anim1, anim2, anim3, anim4, scr;
        scr = {
          0: 0,
          .3: 1
        };
        anim1 = new FadeAnimation(dom, scr);
        anim2 = new FadeAnimation(bracketLeft, scr);
        anim3 = new FadeAnimation(bracketRight, scr);
        anim4 = new FadeAnimation(_this.augmentGeom, scr);
        anim = new SimultAnimations([anim1, anim2, anim3, anim4]);
        _this.anims.push(anim);
        anim.on('stopped', function() {
          var elt, len1, ref5, t;
          ref5 = [dom, bracketLeft, bracketRight, _this.augmentGeom];
          for (t = 0, len1 = ref5.length; t < len1; t++) {
            elt = ref5[t];
            elt.set('opacity', 1);
          }
          return null;
        });
        anim.start();
        _this.loaded = true;
        return _this.trigger({
          type: 'loaded'
        });
      };
    })(this));
    observer = new MutationObserver((function(_this) {
      return function(mutations) {
        var len1, mutation, results, t;
        results = [];
        for (t = 0, len1 = mutations.length; t < len1; t++) {
          mutation = mutations[t];
          results.push(_this.alignBaselines(mutation.target.getElementsByClassName('baseline-detect')));
        }
        return results;
      };
    })(this));
    this.onNextFrame(1, (function(_this) {
      return function() {
        var elt, len1, ref5, results, t;
        ref5 = document.querySelectorAll("." + _this.name + ".bound-entry");
        results = [];
        for (t = 0, len1 = ref5.length; t < len1; t++) {
          elt = ref5[t];
          results.push(observer.observe(elt, {
            childList: true,
            subtree: true,
            characterData: true
          }));
        }
        return results;
      };
    })(this));
    return this;
  };

  RRMatrix.prototype._id = function(element) {
    return this.name + "-" + element;
  };

  RRMatrix.prototype._measureWidth = function(html, fromElement) {
    var div, span, style, width;
    if (this.measurer == null) {
      div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '0px';
      div.style.top = '0px';
      div.style.width = '0px';
      div.style.height = '0px';
      document.body.appendChild(div);
      span = document.createElement('span');
      span.id = 'width-measurer';
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0px';
      span.style.border = 'none';
      span.style.visibility = 'hidden';
      div.appendChild(span);
      this.measurer = span;
    } else {
      span = this.measurer;
    }
    div = span.parentElement;
    style = document.defaultView.getComputedStyle(fromElement);
    span.style.fontStyle = style.getPropertyValue('font-style');
    span.style.fontVariant = style.getPropertyValue('font-variant');
    span.style.fontWeight = style.getPropertyValue('font-weight');
    span.style.fontSize = style.getPropertyValue('font-size');
    span.style.fontFamily = style.getPropertyValue('font-family');
    span.innerHTML = html;
    width = span.getBoundingClientRect().width;
    return width;
  };

  RRMatrix.prototype.computePositions = function(state) {
    var colWidths, diff, elt, i, j, l, m, max, o, q, ref, ref1, ref2, ref3, rowPos, width, x, x1, x2, y, y1, y2;
    state = state.copy();
    state.matWidth = 0;
    colWidths = [];
    for (j = l = 0, ref = this.numCols; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
      max = 0;
      for (i = m = 0, ref1 = this.numRows; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
        elt = this.matrixElts[i][j];
        width = this._measureWidth(state.html[i][j], elt);
        max = Math.max(max, width);
      }
      colWidths.push(max);
      state.matWidth += max;
    }
    state.matWidth += (this.numCols - 1) * this.colSpacing;
    if (state.doAugment) {
      state.matWidth += this.colSpacing / 2;
    }
    y = -this.matHeight / 2 + this.rowHeight;
    for (i = o = 0, ref2 = this.numRows; 0 <= ref2 ? o < ref2 : o > ref2; i = 0 <= ref2 ? ++o : --o) {
      x = -state.matWidth / 2;
      rowPos = [];
      for (j = q = 0, ref3 = this.numCols; 0 <= ref3 ? q < ref3 : q > ref3; j = 0 <= ref3 ? ++q : --q) {
        x += colWidths[j] / 2;
        state.positions[i][j][0] = x;
        state.positions[i][j][1] = -y;
        x += colWidths[j] / 2;
        x += this.colSpacing;
        if ((this.augmentCol != null) && this.augmentCol === j && state.doAugment) {
          x -= this.colSpacing / 4;
          state.augment = [[x, 0], [x, 0]];
          x += 3 * this.colSpacing / 4;
        }
      }
      y += this.rowHeight + this.rowSpacing;
    }
    x1 = -state.matWidth / 2 - this.colSpacing + 7;
    x2 = -state.matWidth / 2 - this.colSpacing;
    y1 = this.matHeight / 2;
    y2 = -(this.matHeight + this.fontSize) / 2;
    state.bracket = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    state.augment[0][1] = y1;
    state.augment[1][1] = y2;
    if ((this.augmentCol != null) && !state.doAugment) {
      diff = this.view.get('scale').y;
      state.augment[0][1] += diff;
      state.augment[1][1] += diff;
    }
    return state;
  };

  RRMatrix.prototype.jumpState = function(nextState) {
    var l, len, ref, timer;
    RRMatrix.__super__.jumpState.call(this, nextState);
    ref = this.timers;
    for (l = 0, len = ref.length; l < len; l++) {
      timer = ref[l];
      clearTimeout(timer);
    }
    return this.timers = [];
  };

  RRMatrix.prototype.htmlMatrix = function(matrix, html) {
    var i, j, l, m, ref, ref1;
    for (j = l = 0, ref = this.numCols; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
      for (i = m = 0, ref1 = this.numRows; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
        html[i][j] = katex.renderToString(texFraction(matrix[i][j]));
      }
    }
    return html;
  };

  RRMatrix.prototype.setMatrix = function(matrix) {
    var resize;
    this.state.matrix = matrix;
    this.htmlMatrix(this.state.matrix, this.state.html);
    if (this.loaded) {
      resize = this.resize();
      this.anims.push(resize);
      resize.on('stopped', (function(_this) {
        return function() {
          return _this.state.install();
        };
      })(this));
      return resize.start;
    }
  };

  RRMatrix.prototype.alignBaselines = function(elts) {
    var elt, l, len, results;
    if (elts == null) {
      elts = document.querySelectorAll("." + this.name + " > .baseline-detect");
    }
    results = [];
    for (l = 0, len = elts.length; l < len; l++) {
      elt = elts[l];
      results.push(elt.parentElement.style.top = -elt.offsetTop + "px");
    }
    return results;
  };

  RRMatrix.prototype.getPivots = function(state) {
    var ent, i, j, l, len, len1, m, pivots, ref, row;
    if (state == null) {
      state = this.state;
    }
    pivots = [];
    ref = state.matrix;
    for (i = l = 0, len = ref.length; l < len; i = ++l) {
      row = ref[i];
      for (j = m = 0, len1 = row.length; m < len1; j = ++m) {
        ent = row[j];
        if (Math.abs(ent) > .00001) {
          pivots.push(j);
          break;
        }
      }
      if (pivots.length <= i) {
        pivots.push(null);
      }
    }
    return pivots;
  };

  RRMatrix.prototype.isREF = function(state) {
    var col, i, l, last, len, len1, len2, m, o, pivots, q, ref, ref1, row, sawZero;
    if (state == null) {
      state = this.state;
    }
    pivots = this.getPivots(state);
    sawZero = false;
    for (l = 0, len = pivots.length; l < len; l++) {
      col = pivots[l];
      if (col === null) {
        sawZero = true;
      } else {
        if (sawZero) {
          return false;
        }
      }
    }
    last = -1;
    for (m = 0, len1 = pivots.length; m < len1; m++) {
      col = pivots[m];
      if (col === null) {
        break;
      }
      if (col <= last) {
        return false;
      }
      last = col;
    }
    for (row = o = 0, len2 = pivots.length; o < len2; row = ++o) {
      col = pivots[row];
      if (col === null) {
        break;
      }
      for (i = q = ref = row + 1, ref1 = this.numRows; ref <= ref1 ? q < ref1 : q > ref1; i = ref <= ref1 ? ++q : --q) {
        if (state.matrix[i][col] !== 0) {
          return false;
        }
      }
    }
    return true;
  };

  RRMatrix.prototype.isRREF = function(state) {
    var col, i, l, len, m, pivots, ref, row;
    if (state == null) {
      state = this.state;
    }
    if (!this.isREF(state)) {
      return false;
    }
    pivots = this.getPivots(state);
    for (row = l = 0, len = pivots.length; l < len; row = ++l) {
      col = pivots[row];
      if (col === null) {
        break;
      }
      for (i = m = 0, ref = row; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
        if (state.matrix[i][col] !== 0) {
          return false;
        }
      }
      if (state.matrix[row][col] !== 1) {
        return false;
      }
    }
    return true;
  };

  RRMatrix.prototype.resize = function(nextState) {
    var anims, equal, i, j, k, l, m, o, play1, play2, play3, ref, ref1;
    if (nextState == null) {
      nextState = this.computePositions(this.state);
    }
    this.state.matWidth = nextState.matWidth;
    equal = true;
    anims = [];
    for (i = l = 0, ref = this.numRows; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
      for (j = m = 0, ref1 = this.numCols; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        for (k = o = 0; o < 1; k = ++o) {
          if (nextState.positions[i][j][k] !== this.state.positions[i][j][k]) {
            equal = false;
          }
          if (!equal) {
            break;
          }
        }
        if (!equal) {
          break;
        }
      }
      if (!equal) {
        break;
      }
    }
    if (!equal) {
      play1 = new MathboxAnimation(this.positions, {
        script: {
          0: {
            props: {
              data: this.state.positions
            }
          },
          0.2: {
            props: {
              data: nextState.positions
            }
          }
        }
      });
      anims.push(play1);
      this.state.positions = nextState.copyVal('positions');
    }
    if (!arraysEqual(nextState.bracket, this.state.bracket)) {
      play2 = new MathboxAnimation(this.bracket, {
        script: {
          0: {
            props: {
              data: this.state.bracket
            }
          },
          0.2: {
            props: {
              data: nextState.bracket
            }
          }
        }
      });
      anims.push(play2);
      this.state.bracket = nextState.copyVal('bracket');
    }
    if ((this.augmentCol != null) && !arraysEqual(nextState.augment, this.state.augment)) {
      play3 = new MathboxAnimation(this.augment, {
        script: {
          0: {
            props: {
              data: this.state.augment
            }
          },
          0.2: {
            props: {
              data: nextState.augment
            }
          }
        }
      });
      anims.push(play3);
      this.state.augment = nextState.copyVal('augment');
    }
    if (anims.length) {
      return new SimultAnimations(anims);
    }
    return new NullAnimation();
  };

  RRMatrix.prototype.slideshow = function() {
    return new RRSlideshow(this);
  };

  RRMatrix.prototype.chain = function(slides) {
    return new SlideChain(slides);
  };

  RRMatrix.prototype.rowSwap = function(row1, row2, opts) {
    var Slide1, Slide2, _swapLinePoints, fadeTime, rrmat, slide1, slide2, speed, swapTime;
    speed = (opts != null ? opts.speed : void 0) || this.defSpeed;
    fadeTime = 0.3 / speed;
    swapTime = 1 / speed;
    rrmat = this;
    _swapLinePoints = (function(_this) {
      return function(top, bot, state) {
        var center, i, lineHeight, points, samples;
        samples = _this.swapLineSamples;
        lineHeight = Math.abs(top - bot);
        center = (top + bot) / 2;
        points = (function() {
          var l, ref, results;
          results = [];
          for (i = l = 0, ref = samples; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
            results.push([Math.sin(π * i / samples) * this.colSpacing * 3 + state.matWidth / 2 + this.colSpacing + 2, Math.cos(π * i / samples) * lineHeight / 2 + center]);
          }
          return results;
        }).call(_this);
        return points;
      };
    })(this);
    Slide1 = (function(superClass1) {
      extend(Slide1, superClass1);

      function Slide1() {
        return Slide1.__super__.constructor.apply(this, arguments);
      }

      Slide1.prototype.start = function() {
        var play, script;
        this._nextState = this.transform(rrmat.state);
        this._nextState.installVal('swapLine');
        script = {};
        script[0] = 0;
        script[fadeTime] = 1;
        play = new FadeAnimation(rrmat.swapLineGeom, script);
        this.anims.push(play);
        play.on('done', (function(_this) {
          return function() {
            rrmat.state = _this._nextState;
            return _this.done();
          };
        })(this));
        play.start();
        return Slide1.__super__.start.apply(this, arguments);
      };

      Slide1.prototype.transform = function(oldState) {
        var bot, nextState, top;
        nextState = oldState.copy();
        nextState.swapOpacity = 1.0;
        top = nextState.positions[row1][0][1] + rrmat.fontSize / 3;
        bot = nextState.positions[row2][0][1] + rrmat.fontSize / 3;
        nextState.swapLine = _swapLinePoints(top, bot, nextState);
        return nextState;
      };

      Slide1.prototype.fastForward = function() {
        return this._nextState.copy();
      };

      return Slide1;

    })(Slide);
    Slide2 = (function(superClass1) {
      extend(Slide2, superClass1);

      function Slide2() {
        return Slide2.__super__.constructor.apply(this, arguments);
      }

      Slide2.prototype.start = function() {
        var anim, bot, center, play1, play2, play3, pos, ref, script, top, transLine, x, y;
        this._nextState = this.transform(rrmat.state);
        pos = deepCopy(rrmat.state.positions);
        ref = [pos[row2], pos[row1]], pos[row1] = ref[0], pos[row2] = ref[1];
        play1 = new MathboxAnimation(rrmat.positions, {
          pace: swapTime,
          script: {
            0: {
              props: {
                data: rrmat.state.positions
              }
            },
            1: {
              props: {
                data: pos
              }
            }
          }
        });
        top = rrmat.state.swapLine[0][1];
        bot = rrmat.state.swapLine[rrmat.swapLineSamples][1];
        center = (top + bot) / 2;
        transLine = (function() {
          var l, len, ref1, ref2, results;
          ref1 = rrmat.state.swapLine;
          results = [];
          for (l = 0, len = ref1.length; l < len; l++) {
            ref2 = ref1[l], x = ref2[0], y = ref2[1];
            results.push([x, -y + 2 * center]);
          }
          return results;
        })();
        play2 = new MathboxAnimation(rrmat.swapLine, {
          pace: swapTime,
          script: {
            0: {
              props: {
                data: rrmat.state.swapLine
              }
            },
            1: {
              props: {
                data: transLine
              }
            }
          }
        });
        script = {};
        script[0] = 1;
        script[swapTime] = 1;
        script[swapTime + fadeTime] = 0;
        play3 = new FadeAnimation(rrmat.swapLineGeom, script);
        anim = new SimultAnimations([play1, play2, play3]);
        this.anims.push(anim);
        anim.on('done', (function(_this) {
          return function() {
            rrmat.state = _this._nextState;
            rrmat.state.installVal('positions');
            rrmat.state.installVal('html');
            rrmat.state.installVal('styles');
            return _this.done();
          };
        })(this));
        anim.start();
        return Slide2.__super__.start.apply(this, arguments);
      };

      Slide2.prototype.transform = function(oldState) {
        var nextState, ref, ref1, ref2;
        nextState = oldState.copy();
        ref = [nextState.matrix[row2], nextState.matrix[row1]], nextState.matrix[row1] = ref[0], nextState.matrix[row2] = ref[1];
        ref1 = [nextState.styles[row2], nextState.styles[row1]], nextState.styles[row1] = ref1[0], nextState.styles[row2] = ref1[1];
        ref2 = [nextState.html[row2], nextState.html[row1]], nextState.html[row1] = ref2[0], nextState.html[row2] = ref2[1];
        nextState.swapOpacity = 0.0;
        return nextState;
      };

      Slide2.prototype.fastForward = function() {
        return this._nextState.copy();
      };

      return Slide2;

    })(Slide);
    slide1 = new Slide1();
    slide2 = new Slide2();
    slide1.data.type = slide2.data.type = "rowSwap";
    slide2.data.shortOp = "s" + row1 + ":" + row2;
    slide2.data.texOp = "R_{" + (row1 + 1) + "} \\leftrightarrow R_{" + (row2 + 1) + "}";
    return {
      slide1: slide1,
      slide2: slide2,
      chain: new SlideChain([slide1, slide2])
    };
  };

  RRMatrix.prototype.rowMult = function(rowNum, factor, opts) {
    var Slide1, Slide2, den, flidx, num, ref, rrmat, slide1, slide2, speed;
    speed = (opts != null ? opts.speed : void 0) || this.defSpeed;
    flidx = this.numRows;
    rrmat = this;
    Slide1 = (function(superClass1) {
      extend(Slide1, superClass1);

      function Slide1() {
        return Slide1.__super__.constructor.apply(this, arguments);
      }

      Slide1.prototype.start = function() {
        var anim;
        this._nextState = this.transform(rrmat.state);
        this._nextState.installVal('positions');
        rrmat.state.html[flidx][0] = this._nextState.html[flidx][0];
        rrmat.multFlyerElt.parentElement.style.width = "0px";
        anim = new TimedAnimation(rrmat.positions[0].clock, function(elapsed) {
          elapsed *= speed;
          if (elapsed >= 0.3) {
            rrmat.multFlyerElt.style.opacity = 1;
            return this.done();
          } else {
            return rrmat.multFlyerElt.style.opacity = elapsed / 0.3;
          }
        });
        this.anims.push(anim);
        anim.on('done', (function(_this) {
          return function() {
            rrmat.state = _this._nextState;
            return _this.done();
          };
        })(this));
        anim.start();
        return Slide1.__super__.start.apply(this, arguments);
      };

      Slide1.prototype.transform = function(oldState) {
        var nextState, rowY, startX;
        nextState = oldState.copy();
        nextState.styles[flidx][0].opacity = 1;
        nextState.html[flidx][0] = katex.renderToString('\\times' + texFraction(factor));
        startX = nextState.matWidth / 2 + rrmat.colSpacing + 10;
        rowY = nextState.positions[rowNum][0][1];
        nextState.positions[flidx][0] = [startX, rowY, 10];
        return nextState;
      };

      Slide1.prototype.fastForward = function() {
        return this._nextState.copy();
      };

      return Slide1;

    })(Slide);
    Slide2 = (function(superClass1) {
      extend(Slide2, superClass1);

      function Slide2() {
        return Slide2.__super__.constructor.apply(this, arguments);
      }

      Slide2.prototype.start = function() {
        var anim, box, callback, elt, l, len, nextState, opacity, past, play, pos, row;
        nextState = this._nextState = this.transform(rrmat.state, false);
        pos = [];
        past = [];
        row = rrmat.matrixElts[rowNum];
        for (l = 0, len = row.length; l < len; l++) {
          elt = row[l];
          box = elt.getBoundingClientRect();
          pos.push((box.left + box.right) / 2);
          past.push(false);
        }
        opacity = (function(_this) {
          return function(distance) {
            return Math.min(Math.pow(distance / (rrmat.fontSize * 2), 3), 1);
          };
        })(this);
        anim = new TimedAnimation(rrmat.positions[0].clock, function(elapsed) {
          var flyerPos, i, len1, m;
          elapsed *= speed;
          box = rrmat.multFlyerElt.getBoundingClientRect();
          flyerPos = (box.left + box.right) / 2;
          for (i = m = 0, len1 = row.length; m < len1; i = ++m) {
            elt = row[i];
            if (flyerPos < pos[i] && !past[i]) {
              past[i] = true;
              rrmat.state.html[rowNum][i] = nextState.html[rowNum][i];
            }
            elt.style.opacity = opacity(Math.abs(flyerPos - pos[i]));
          }
          if (past[0]) {
            rrmat.multFlyerElt.style.opacity = Math.max(1 - (pos[0] - flyerPos) / rrmat.fontSize / 5, 0);
            if (rrmat.multFlyerElt.style.opacity < 0.05) {
              rrmat.multFlyerElt.style.opacity = 0;
              return this.done();
            }
          }
        });
        play = new MathboxAnimation(rrmat.positions, {
          speed: speed,
          script: {
            0: {
              props: {
                data: rrmat.state.positions
              }
            },
            1.75: {
              props: {
                data: this._nextState.positions
              }
            }
          }
        });
        callback = (function(_this) {
          return function() {
            var resize;
            rrmat.state = _this._nextState;
            _this.stopAll();
            rrmat.multFlyerElt.style.opacity = 0;
            resize = rrmat.resize();
            _this.anims.push(resize);
            resize.on('done', function() {
              return _this.done();
            });
            return resize.start();
          };
        })(this);
        anim.on('done', callback);
        play.on('done', callback);
        play.start();
        anim.start();
        this.anims.push(play);
        this.anims.push(anim);
        return Slide2.__super__.start.apply(this, arguments);
      };

      Slide2.prototype.transform = function(oldState, computePos) {
        var nextState, r, rowY;
        if (computePos == null) {
          computePos = true;
        }
        nextState = oldState.copy();
        nextState.matrix[rowNum] = (function() {
          var l, len, ref, results;
          ref = nextState.matrix[rowNum];
          results = [];
          for (l = 0, len = ref.length; l < len; l++) {
            r = ref[l];
            results.push(r * factor);
          }
          return results;
        })();
        rrmat.htmlMatrix(nextState.matrix, nextState.html);
        nextState.styles[flidx][0].opacity = 0;
        rowY = rrmat.state.positions[rowNum][0][1];
        nextState.positions[flidx][0] = [-nextState.matWidth * 2, rowY, 10];
        if (computePos) {
          return rrmat.computePositions(nextState);
        }
        return nextState;
      };

      Slide2.prototype.fastForward = function() {
        return rrmat.computePositions(this._nextState);
      };

      return Slide2;

    })(Slide);
    slide1 = new Slide1();
    slide2 = new Slide2();
    slide1.data.type = slide2.data.type = "rowMult";
    ref = approxFraction(factor), num = ref[0], den = ref[1];
    slide2.data.shortOp = "m" + rowNum + ":" + num;
    if (den !== 1) {
      slide2.data.shortOp += "." + den;
    }
    slide2.data.texOp = ("R_{" + (rowNum + 1) + "} = ") + texFraction(factor) + ("R_{" + (rowNum + 1) + "}");
    return {
      slide1: slide1,
      slide2: slide2,
      chain: new SlideChain([slide1, slide2])
    };
  };

  RRMatrix.prototype.rowRep = function(sourceRow, factor, targetRow, opts) {
    var Slide1, Slide2, den, flidx, lpidx, num, opacity, padding, plus, ref, rpidx, rrmat, slide1, slide2, speed, texString;
    speed = (opts != null ? opts.speed : void 0) || this.defSpeed;
    plus = factor >= 0 ? '+' : '';
    texString = katex.renderToString(plus + texFraction(factor) + '\\,\\bigl(');
    padding = 7;
    flidx = this.numRows + 1;
    lpidx = this.numRows + 2;
    rpidx = this.numRows + 3;
    rrmat = this;
    Slide1 = (function(superClass1) {
      extend(Slide1, superClass1);

      function Slide1() {
        return Slide1.__super__.constructor.apply(this, arguments);
      }

      Slide1.prototype.start = function() {
        var anim, elt, l, len, nextState, play, ref, tmpState;
        nextState = this._nextState = this.transform(rrmat.state);
        rrmat.state.html = nextState.html;
        tmpState = nextState.copy();
        tmpState.styles[lpidx][0].opacity = 0;
        tmpState.styles[rpidx][0].opacity = 0;
        tmpState.installVal('styles');
        ref = [rrmat.rrepParenLeftElt, rrmat.rrepParenRightElt];
        for (l = 0, len = ref.length; l < len; l++) {
          elt = ref[l];
          elt.parentElement.style.width = "0px";
        }
        rrmat.state.positions[flidx] = rrmat.state.positions[sourceRow];
        rrmat.state.positions[lpidx][0] = nextState.positions[lpidx][0];
        rrmat.state.positions[rpidx][0] = nextState.positions[rpidx][0];
        play = new MathboxAnimation(rrmat.positions, {
          speed: speed,
          script: {
            0.0: {
              props: {
                data: rrmat.state.positions
              }
            },
            1.5: {
              props: {
                data: nextState.positions
              }
            }
          }
        });
        this.anims.push(play);
        anim = new TimedAnimation(rrmat.positions[0].clock, function(elapsed) {
          elapsed *= speed;
          if (elapsed < 0.3) {
            rrmat.rrepParenLeftElt.style.opacity = elapsed / 0.3;
            return rrmat.rrepParenRightElt.style.opacity = elapsed / 0.3;
          } else if (elapsed < 1.5) {
            rrmat.rrepParenLeftElt.style.opacity = 1;
            return rrmat.rrepParenRightElt.style.opacity = 1;
          } else {
            return this.done();
          }
        });
        this.anims.push(anim);
        anim.on('done', (function(_this) {
          return function() {
            rrmat.state = _this._nextState;
            return _this.done();
          };
        })(this));
        play.start();
        anim.start();
        return Slide1.__super__.start.apply(this, arguments);
      };

      Slide1.prototype.transform = function(oldState) {
        var i, l, leftParenWidth, leftParenX, matWidth, nextState, offsetX, ref, rowY;
        nextState = oldState.copy();
        nextState.html[lpidx][0] = texString;
        nextState.html[rpidx][0] = katex.renderToString('\\bigr)');
        leftParenWidth = rrmat._measureWidth(texString, rrmat.rrepParenLeftElt);
        rowY = nextState.positions[targetRow][0][1];
        matWidth = nextState.matWidth + padding * 2;
        leftParenX = nextState.matWidth / 2 + rrmat.colSpacing + 10;
        nextState.positions[lpidx][0][0] = leftParenX;
        nextState.positions[lpidx][0][1] = rowY;
        nextState.positions[lpidx][0][2] = 5;
        nextState.positions[rpidx][0][0] = leftParenX + leftParenWidth + matWidth;
        nextState.positions[rpidx][0][1] = rowY;
        nextState.positions[rpidx][0][2] = 5;
        nextState.styles[lpidx][0].opacity = 1;
        nextState.styles[rpidx][0].opacity = 1;
        offsetX = nextState.matWidth + rrmat.colSpacing + 10 + leftParenWidth + padding;
        nextState.styles[flidx] = deepCopy(nextState.styles[sourceRow]);
        nextState.html[flidx] = deepCopy(nextState.html[sourceRow]);
        nextState.positions[flidx] = deepCopy(nextState.positions[sourceRow]);
        for (i = l = 0, ref = rrmat.numCols; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
          nextState.styles[flidx][i].opacity = 1;
          nextState.positions[flidx][i][0] += offsetX;
          nextState.positions[flidx][i][1] = rowY;
          nextState.positions[flidx][i][2] = 10;
        }
        return nextState;
      };

      Slide1.prototype.fastForward = function() {
        return this._nextState.copy();
      };

      return Slide1;

    })(Slide);
    opacity = function(right) {
      if (right < 0) {
        return 0.5;
      }
      return Math.max(0.5, Math.min(right / rrmat.fontSize, 1));
    };
    Slide2 = (function(superClass1) {
      extend(Slide2, superClass1);

      function Slide2() {
        return Slide2.__super__.constructor.apply(this, arguments);
      }

      Slide2.prototype.start = function() {
        var anim, nextState, play, row;
        nextState = this._nextState = this.transform(rrmat.state, false);
        play = new MathboxAnimation(rrmat.positions, {
          speed: speed,
          script: {
            0.0: {
              props: {
                data: rrmat.state.positions
              }
            },
            1.5: {
              props: {
                data: nextState.positions
              }
            }
          }
        });
        this.anims.push(play);
        row = rrmat.matrixElts[targetRow];
        anim = new TimedAnimation(rrmat.positions[0].clock, function(elapsed) {
          var elt, i, l, left, len, len1, len2, len3, len4, len5, len6, m, o, pos, q, ref, ref1, ref2, ref3, right, s, t, u, w;
          elapsed *= speed;
          if (elapsed < 1.5) {
            right = row[rrmat.numCols - 1].getBoundingClientRect().right;
            ref = rrmat.addFlyerElts;
            for (l = 0, len = ref.length; l < len; l++) {
              elt = ref[l];
              pos = elt.getBoundingClientRect().left;
              elt.style.opacity = opacity(pos - right);
            }
            left = rrmat.rrepParenLeftElt.getBoundingClientRect().left;
            for (m = 0, len1 = row.length; m < len1; m++) {
              elt = row[m];
              pos = elt.getBoundingClientRect().right;
              elt.style.opacity = opacity(left - pos);
            }
            return;
          }
          elapsed -= 1.5;
          if (elapsed < 0.3) {
            ref1 = rrmat.addFlyerElts;
            for (o = 0, len2 = ref1.length; o < len2; o++) {
              elt = ref1[o];
              elt.style.opacity = 0.5 - elapsed / (2 * 0.3);
            }
            for (q = 0, len3 = row.length; q < len3; q++) {
              elt = row[q];
              elt.style.opacity = 0.5 - elapsed / (2 * 0.3);
            }
            rrmat.rrepParenLeftElt.style.opacity = 1 - elapsed / 0.3;
            rrmat.rrepParenRightElt.style.opacity = 1 - elapsed / 0.3;
            return;
          }
          ref2 = rrmat.addFlyerElts;
          for (s = 0, len4 = ref2.length; s < len4; s++) {
            elt = ref2[s];
            elt.style.opacity = 0;
          }
          rrmat.rrepParenLeftElt.style.opacity = 0;
          rrmat.rrepParenRightElt.style.opacity = 0;
          elapsed -= 0.3;
          if (elapsed < 0.3) {
            for (i = t = 0, ref3 = rrmat.numCols; 0 <= ref3 ? t < ref3 : t > ref3; i = 0 <= ref3 ? ++t : --t) {
              rrmat.state.html[targetRow][i] = nextState.html[targetRow][i];
            }
            for (u = 0, len5 = row.length; u < len5; u++) {
              elt = row[u];
              elt.style.opacity = elapsed / 0.3;
            }
            return;
          }
          for (w = 0, len6 = row.length; w < len6; w++) {
            elt = row[w];
            elt.style.opacity = 1;
          }
          return this.done();
        });
        this.anims.push(anim);
        anim.on('done', (function(_this) {
          return function() {
            var resize;
            rrmat.state = _this._nextState;
            _this.stopAll();
            resize = rrmat.resize();
            _this.anims.push(resize);
            resize.on('done', function() {
              return _this.done();
            });
            return resize.start();
          };
        })(this));
        anim.start();
        play.start();
        return Slide2.__super__.start.apply(this, arguments);
      };

      Slide2.prototype.transform = function(oldState, computePos) {
        var i, l, leftParenWidth, m, nextState, offsetX, ref, ref1;
        if (computePos == null) {
          computePos = true;
        }
        nextState = oldState.copy();
        for (i = l = 0, ref = rrmat.numCols; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
          nextState.matrix[targetRow][i] += factor * nextState.matrix[sourceRow][i];
        }
        rrmat.htmlMatrix(nextState.matrix, nextState.html);
        leftParenWidth = rrmat._measureWidth(texString, rrmat.rrepParenLeftElt);
        offsetX = nextState.matWidth + rrmat.colSpacing + 10 + leftParenWidth + padding;
        for (i = m = 0, ref1 = rrmat.numCols; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
          nextState.styles[flidx][i].opacity = 0;
          nextState.positions[flidx][i][0] -= offsetX;
        }
        nextState.positions[lpidx][0][0] -= offsetX;
        nextState.positions[rpidx][0][0] -= offsetX;
        nextState.styles[lpidx][0].opacity = 0;
        nextState.styles[rpidx][0].opacity = 0;
        if (computePos) {
          return rrmat.computePositions(nextState);
        }
        return nextState;
      };

      Slide2.prototype.fastForward = function() {
        return rrmat.computePositions(this._nextState);
      };

      return Slide2;

    })(Slide);
    slide1 = new Slide1();
    slide2 = new Slide2();
    slide1.data.type = slide2.data.type = "rowRep";
    plus = factor < 0 ? '' : '+';
    ref = approxFraction(factor), num = ref[0], den = ref[1];
    slide2.data.shortOp = "r" + sourceRow + ":" + num;
    if (den !== 1) {
      slide2.data.shortOp += "." + den;
    }
    slide2.data.shortOp += ":" + targetRow;
    slide2.data.texOp = ("R_{" + (targetRow + 1) + "} = R_{" + (targetRow + 1) + "} " + plus) + texFraction(factor) + ("R_{" + (sourceRow + 1) + "}");
    return {
      slide1: slide1,
      slide2: slide2,
      chain: new SlideChain([slide1, slide2])
    };
  };

  RRMatrix.prototype.unAugment = function(opts) {
    var AugSlide, rrmat, slide, speed;
    speed = (opts != null ? opts.speed : void 0) || this.defSpeed;
    rrmat = this;
    AugSlide = (function(superClass1) {
      extend(AugSlide, superClass1);

      function AugSlide() {
        return AugSlide.__super__.constructor.apply(this, arguments);
      }

      AugSlide.prototype.start = function() {
        var nextState, play;
        nextState = this._nextState = this.transform(rrmat.state, false);
        play = new MathboxAnimation(rrmat.augment, {
          speed: speed,
          script: {
            0: {
              props: {
                data: rrmat.state.augment
              }
            },
            0.5: {
              props: {
                data: nextState.augment
              }
            }
          }
        });
        this.anims.push(play);
        play.on('done', (function(_this) {
          return function() {
            var resize;
            rrmat.state = _this._nextState;
            _this.stopAll();
            rrmat.state.installVal('doAugment');
            resize = rrmat.resize();
            _this.anims.push(resize);
            resize.on('done', function() {
              return _this.done();
            });
            return resize.start();
          };
        })(this));
        play.start();
        return AugSlide.__super__.start.apply(this, arguments);
      };

      AugSlide.prototype.transform = function(oldState, computePos) {
        var diff, nextState;
        if (computePos == null) {
          computePos = true;
        }
        nextState = oldState.copy();
        nextState.doAugment = false;
        diff = rrmat.view.get('scale').y;
        nextState.augment[0][1] += diff;
        nextState.augment[1][1] += diff;
        if (computePos) {
          return rrmat.computePositions(nextState);
        }
        return nextState;
      };

      AugSlide.prototype.fastForward = function() {
        return rrmat.computePositions(this._nextState);
      };

      return AugSlide;

    })(Slide);
    slide = new AugSlide();
    slide.data.type = "unAugment";
    return slide;
  };

  RRMatrix.prototype.reAugment = function(opts) {
    var AugSlide, rrmat, slide, speed;
    speed = (opts != null ? opts.speed : void 0) || this.defSpeed;
    rrmat = this;
    AugSlide = (function(superClass1) {
      extend(AugSlide, superClass1);

      function AugSlide() {
        return AugSlide.__super__.constructor.apply(this, arguments);
      }

      AugSlide.prototype.start = function() {
        var diff, nextState, play, resize, tmpState;
        nextState = this._nextState = this.transform(rrmat.state);
        tmpState = nextState.copy();
        nextState.installVal('doAugment');
        diff = rrmat.view.get('scale').y;
        tmpState.augment[0][1] += diff;
        tmpState.augment[1][1] += diff;
        resize = rrmat.resize(tmpState);
        this.anims.push(resize);
        play = new MathboxAnimation(rrmat.augment, {
          speed: speed,
          script: {
            0: {
              props: {
                data: tmpState.augment
              }
            },
            0.5: {
              props: {
                data: nextState.augment
              }
            }
          }
        });
        resize.on('done', (function(_this) {
          return function() {
            _this.anims = [play];
            return play.start();
          };
        })(this));
        play.on('done', (function(_this) {
          return function() {
            _this.anims = [];
            rrmat.state = _this._nextState;
            return _this.done();
          };
        })(this));
        resize.start();
        return AugSlide.__super__.start.apply(this, arguments);
      };

      AugSlide.prototype.transform = function(oldState) {
        var nextState;
        nextState = oldState.copy();
        nextState.doAugment = true;
        nextState = rrmat.computePositions(nextState);
        return nextState;
      };

      AugSlide.prototype.fastForward = function() {
        return this._nextState.copy();
      };

      return AugSlide;

    })(Slide);
    slide = new AugSlide();
    slide.data.type = "reAugment";
    return slide;
  };

  StyleSlide = (function(superClass1) {
    extend(StyleSlide, superClass1);

    function StyleSlide(transitions1, rrmat1, opts) {
      this.transitions = transitions1;
      this.rrmat = rrmat1;
      this.transform = bind(this.transform, this);
      this.speed = (opts != null ? opts.speed : void 0) || this.rrmat.defSpeed;
      this.transitions = this._initTransitions(this.transitions);
      StyleSlide.__super__.constructor.apply(this, arguments);
    }

    StyleSlide.prototype._initTransitions = function(transitions) {
      var l, len, len1, m, prop, ref, trans;
      this.totalTime = 0;
      if (!(transitions instanceof Array)) {
        transitions = [transitions];
      }
      for (l = 0, len = transitions.length; l < len; l++) {
        trans = transitions[l];
        if (trans.duration == null) {
          trans.duration = 0.0;
        }
        trans.duration /= this.speed;
        if (trans.delay == null) {
          trans.delay = 0.0;
        }
        trans.delay /= this.speed;
        if (trans.timing == null) {
          trans.timing = 'ease';
        }
        this.totalTime = Math.max(this.totalTime, trans.duration + trans.delay);
        trans.props = [];
        ref = this.rrmat.styleKeys;
        for (m = 0, len1 = ref.length; m < len1; m++) {
          prop = ref[m];
          if (trans[prop] != null) {
            trans.props.push(prop);
          }
        }
      }
      return transitions;
    };

    StyleSlide.prototype._setStyle = function(i, j, trans) {
      var elt, k, l, len, p, prop, ref, results, style, transition, v;
      if (trans.duration) {
        transition = ((function() {
          var l, len, ref, results;
          ref = trans.props;
          results = [];
          for (l = 0, len = ref.length; l < len; l++) {
            p = ref[l];
            results.push(p + " " + trans.duration + "s " + trans.timing);
          }
          return results;
        })()).join(', ');
      } else {
        transition = "";
      }
      style = {
        transition: transition
      };
      ref = trans.props;
      for (l = 0, len = ref.length; l < len; l++) {
        prop = ref[l];
        style[prop] = trans[prop];
      }
      elt = rrmat.matrixElts[i][j];
      results = [];
      for (k in style) {
        v = style[k];
        results.push(elt.style[k] = v);
      }
      return results;
    };

    StyleSlide.prototype.start = function() {
      var callback, l, len, ref, timeout, timer, trans;
      this._nextState = this.transform(rrmat.state);
      ref = this.transitions;
      for (l = 0, len = ref.length; l < len; l++) {
        trans = ref[l];
        callback = (function(_this) {
          return function(trans) {
            return function() {
              var entry, len1, m, ref1;
              ref1 = trans.entries;
              for (m = 0, len1 = ref1.length; m < len1; m++) {
                entry = ref1[m];
                _this._setStyle(entry[0], entry[1], trans);
              }
              return null;
            };
          };
        })(this)(trans);
        if (trans.delay === 0) {
          rrmat.onNextFrame(1, callback);
        } else {
          timer = setTimeout(callback, trans.delay * 1000);
          rrmat.timers.push(timer);
        }
      }
      callback = (function(_this) {
        return function() {
          rrmat.state = _this._nextState;
          return _this.done();
        };
      })(this);
      timeout = setTimeout(callback, this.totalTime * 1000);
      rrmat.timers.push(timeout);
      return StyleSlide.__super__.start.apply(this, arguments);
    };

    StyleSlide.prototype.transform = function(oldState) {
      var ent, i, j, k, l, last, len, len1, len2, m, nextState, o, prop, q, ref, ref1, ref2, ref3, ref4, s, style, trans, v;
      nextState = oldState.copy();
      for (i = l = 0, ref = rrmat.numRows; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        for (j = m = 0, ref1 = rrmat.numCols; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
          last = 0.0;
          style = {};
          ref2 = this.transitions;
          for (o = 0, len = ref2.length; o < len; o++) {
            trans = ref2[o];
            if (trans.delay >= last) {
              ref3 = trans.entries;
              for (q = 0, len1 = ref3.length; q < len1; q++) {
                ent = ref3[q];
                if (ent[0] === i && ent[1] === j) {
                  ref4 = trans.props;
                  for (s = 0, len2 = ref4.length; s < len2; s++) {
                    prop = ref4[s];
                    style[prop] = trans[prop];
                  }
                  last = trans.delay;
                  break;
                }
              }
            }
          }
          for (k in style) {
            v = style[k];
            nextState.styles[i][j][k] = v;
          }
        }
      }
      return nextState;
    };

    StyleSlide.prototype.fastForward = function() {
      return this._nextState.copy();
    };

    return StyleSlide;

  })(Slide);

  RRMatrix.prototype.setStyle = function(transitions, opts) {
    var slide;
    slide = new StyleSlide(transitions, this, opts);
    slide.data.type = "setStyle";
    return slide;
  };

  RRMatrix.prototype.highlightPivots = function(opts) {
    var PivotSlide, color, duration, rrmat, slide;
    color = (opts != null ? opts.color : void 0) || "red";
    if ((opts != null ? opts.duration : void 0) != null) {
      duration = opts.duration;
    } else {
      duration = 0.3;
    }
    rrmat = this;
    PivotSlide = (function(superClass1) {
      extend(PivotSlide, superClass1);

      function PivotSlide() {
        PivotSlide.__super__.constructor.call(this, [], rrmat, opts);
      }

      PivotSlide.prototype.transform = function(oldState) {
        var col, ent, entries, entries2, i, isPivot, j, l, len, len1, m, nextState, o, pivots, q, ref, ref1, row, transition1, transition2;
        nextState = oldState.copy();
        pivots = rrmat.getPivots(nextState);
        entries = [];
        for (row = l = 0, len = pivots.length; l < len; row = ++l) {
          col = pivots[row];
          if (col === null) {
            continue;
          }
          entries.push([row, col]);
        }
        transition1 = {
          color: color,
          duration: duration,
          entries: entries
        };
        entries2 = [];
        for (i = m = 0, ref = rrmat.numRows; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
          for (j = o = 0, ref1 = rrmat.numCols; 0 <= ref1 ? o < ref1 : o > ref1; j = 0 <= ref1 ? ++o : --o) {
            isPivot = false;
            for (q = 0, len1 = entries.length; q < len1; q++) {
              ent = entries[q];
              if (ent[0] === i && ent[1] === j) {
                isPivot = true;
                break;
              }
            }
            if (!isPivot) {
              entries2.push([i, j]);
            }
          }
        }
        transition2 = {
          color: "black",
          duration: duration,
          entries: entries2
        };
        this.transitions = this._initTransitions([transition1, transition2]);
        return PivotSlide.__super__.transform.call(this, nextState);
      };

      return PivotSlide;

    })(StyleSlide);
    slide = new PivotSlide();
    slide.data.type = "highlightPivots";
    return slide;
  };

  return RRMatrix;

})(Controller);

RRMatrix.texFraction = texFraction;

RRMatrix.approxFraction = approxFraction;

RRMatrix.arraysEqual = arraysEqual;

window.RRMatrix = RRMatrix;

// ---
// generated by coffee-script 1.9.2