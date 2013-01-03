/*

  Bearhug

  By Ryan James

  Bearhug adds a CSS class to an element when it's bigger than a comparison element.

  https://github.com/ryanjames/bearhug/

*/

(function() {

  this.Bear = (function() {

    function Bear() {}

    Bear.hugs = {};

    /* 
      Build a new hug
    */

    Bear.hug = function(params) {

      var small_elements = this._small_element_properties(params.small),
          big_element = this._find_elements(params.big)[0], 
          small_class = params.small_class, 
          big_class = params.big_class, 
          offset = params.offset,
          _hug;

      if(small_elements && small_elements.length > 0) {
        _hug_name = params.small;
        if(!this.hugs[_hug_name]) {
          this.hugs[_hug_name] = [];
          _hug = new Hug(small_elements,
                         big_element,
                         small_class != null ? small_class : 'small-hug',
                         big_class != null ? big_class : 'small-hug',
                         offset != null ? offset : 0);
          this.hugs[_hug_name].push(_hug);

          this._update();

          if (!this._listening) {
            this._listen();
          }

          return this.hugs;

        } else { this._error(1, params.small); }
      } else { this._error(0, params.small) };

    }

    Bear.release = function(params) {

    }

    /* 
      Update class assignments
    */

    Bear._update = function() {

      var _has_class = function (ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
      }
      var _add_class = function (ele,cls) {
        if (!_has_class(ele,cls)) ele.className += " "+cls;
      }
      var _remove_class = function(ele,cls) {
        if (_has_class(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,'');
        }
      }

      for(i in this.hugs) {
        var _hug = this.hugs[i][0],
            _small_elements = _hug.small_elements;
            _big_element = _hug.big_element;
            _small_class = _hug.small_class;
            _big_class = _hug.big_class;
            _offset = _hug.offset;

        for(i=0;i<_small_elements.length;i++) {
          _element = _small_elements[i];
          if((_big_element.offsetWidth - _offset) <= _element.maxWidth) {
            _add_class(_element, _small_class);
            _add_class(_big_element, _big_class);
          } else {
            _remove_class(_element, _small_class);
            _remove_class(_big_element, _big_class);
          }
        }
      }

    }


    /* 
      Listen for browser resizing
    */

    Bear._listen = function() {
      var evt, _this = this;
      var evt = window.addEventListener || window.attachEvent;
      evt('resize', function() {
        _this._update();
      });
      return this._listening = true;
    }

    /* 
      Errors
    */
    Bear._error = function(message_id, option) {
      _option_array = [];
      if(option && option.length > 0) {
        _option_array = option;
      };
      var _error_definitions = {
        0: "No nodes matched the specified element '" + option + ".'",
        1: "You've already made an instance of Bearhug with the '" + option + "' element."
      };
      throw new Error(_error_definitions[message_id]);
    }


    // Utility classes below.

    /* 
      Get elements and their properties
    */

    Bear._small_element_properties = function(selector) {

      // Find all the elements
      var small_elements = this._find_elements(selector);

      // Assign maximum widths to all the elements and return
      return this._get_element_maxwidths(small_elements);

    }

    /* 
      Distinquish how elements are selected (class, id or tag name).
      Select elements, throw them into an array.
    */

    Bear._find_elements = function(selector, is_single) {

      var _selector_text = selector.replace(/[.#]/g, ''),
          _doc = document

      if(selector.indexOf('.') != -1) {
        _elements = _doc.getElementsByClassName(_selector_text);
      } else if(selector.indexOf('#') != -1) {
        _elements = new Array(_doc.getElementById(_selector_text));
      } else {
        _elements = _doc.getElementsByTagName(_selector_text);
      }

      return (is_single) ? _elements[0] : _elements;

    }

    /* 
      Get the maxwidths of each element.
    */

    Bear._get_element_maxwidths = function(selector) {

      var elements = [].slice.call(selector, 0,selector.length),
          _frag = document.createDocumentFragment(),
          _frag_space = document.createElement('div'),
          _container = document.createElement('div'),
          _frag_target,
          _element_clones = [],
          _limbo,
          _big_element_clone;

      // Build fragment structure and populate with cloned elements.
      _frag_space.setAttribute("style","width:0;height:0;overflow:hidden;");
      _container.setAttribute("style","width:3000px;overflow:hidden;");
      _frag.appendChild(_frag_space);
      _frag_target = _frag.firstChild;
      for(i=0;i<elements.length;i++) {
        _element_clones[i] = elements[i].cloneNode(true);
        _frag_target.appendChild(_container.cloneNode(true));
        _frag_target.lastChild.appendChild(_element_clones[i]);
      }

      // Add cloned small elements to the DOM as a single fragment
      document.documentElement.appendChild(_frag);
      
      // Get and set small element maxwidths
      for(i=0;i<elements.length;i++) {
        if(elements[i].offsetWidth > _element_clones[i].offsetWidth) {
          elements[i].maxWidth = elements[i].offsetWidth;
        } else {
          elements[i].maxWidth = _element_clones[i].offsetWidth;
        }
      }

      // Remove fragment from the dom
      _limbo = document.createElement('div');
      _limbo.appendChild(_frag_space);
      _limbo.removeChild(_frag_space);

      return elements;

    }

    return Bear;

  })();

  /* 
    Hug constructor.
  */

  Hug = (function(small_elements, big_element, small_class, big_class, offset) {
    function Hug(small_elements, big_element, small_class, big_class, offset) {
      this.small_elements = small_elements;
      this.big_element = big_element;
      this.small_class = small_class;
      this.big_class = big_class;
      this.offset = offset;
    }
    return Hug;
  })();

})();
