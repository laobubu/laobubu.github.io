/**
 * APA Another Pico Assistant
 * 
 * inspired by https://github.com/pepsin/Ase/blob/master/public/js/app.js
 * 
 * @author laobubu
 * 
 * Patch NodeList with these methods:
 *  + on(event_name, func, capture?)
 *  + forEach(func)
 *  + attrs(pairs)
 *  + style(pairs)
 *  + addClass(class_name)
 *  + removeClass(class_name)
 *  + toggleClass(class_name, force)
 * 
 * Patch Array with these methods:
 *  + remove(item)
 */

var apa;

apa = apa || (function () {
  var apa = function(selector){
    return document.querySelectorAll(selector);
  };
  
  /**
   * make a one-time function
   */
  apa.once = function (func) {
    var status = true;
    return function () {
      if (status) {
        status = false;
        return func.apply(this, arguments);
      }
    };
  };

  /**
   * ajax("get", "http://foo.bar/1.txt", (text) => {})
   * ajax("get", {url, data, success, error})
   * 
   * data shall be a JSON object or string
   */
  apa.ajax = function (method, pack, success) {
    if (typeof (pack) === "string") {
      pack = { url: pack, success: success };
    }
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var callbackNotExecuted = true;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && callbackNotExecuted) {
        callbackNotExecuted = false;
        if ((/20[01]/.test(xmlhttp.status)) && pack.success) {
          pack.success(xmlhttp.responseText);
        } else if (pack.failed) {
          pack.failed(xmlhttp.responseText);
        };
      }
    };
    xmlhttp.open(method, pack.url, true);
    if (pack.data) {
      var payload = pack.data;
      var payloadType = 'application/x-www-form-urlencoded';
      if (typeof payload !== "string") {
        payload = JSON.stringify(payload);
        payloadType = 'application/json';
      }
    } else {
      xmlhttp.send();
    }
    return xmlhttp;
  };
  
  apa.get  = function(pack, success) { return apa.ajax("get",  pack, success) }
  apa.post = function(pack, success) { return apa.ajax("post", pack, success) }

  NodeList.prototype.on = function (event_name, func, capture) {
    var nodes = this;
    for (var i = 0; i < nodes.length; i++) {
      (nodes[i].nodeType === 1) && (nodes[i].addEventListener(event_name, func, capture ? true : false));
    };
    return nodes;
  };

  NodeList.prototype.forEach = function (func) {
    var nodes = this;
    for (var i = 0; i < nodes.length; i++) {
      func(nodes[i], i);
    }
    return nodes;
  }

  NodeList.prototype.attrs = function (pairs) {
    var nodes = this;
    var attrNames = Object.keys(pairs);
    var attrName;
    while (attrName = attrNames.shift()) {
      for (var i = 0; i < nodes.length; i++) {
        (nodes[i].nodeType === 1) && nodes[i].setAttribute(attrName, pairs[attrName]);
      }
    }
    return nodes;
  };

  NodeList.prototype.style = function (pairs) {
    var nodes = this;
    var attrs = Object.keys(pairs);
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      for (var j = 0; j < nodes.length; j++) {
        (nodes[j].style) && (nodes[j].style[attr] = pairs[attr]);
      }
    }
    return nodes;
  }

  NodeList.prototype.addClass = function (class_name) {
    return this.forEach(function (node) {
      node.classList && node.classList.add(class_name);
    })
  }

  NodeList.prototype.removeClass = function (class_name) {
    return this.forEach(function (node) {
      node.classList && node.classList.remove(class_name);
    })
  }

  NodeList.prototype.toggleClass = function (class_name, condition) {
    return this.forEach(function (node) {
      node.classList && node.classList.toggle.apply(node.classList, arguments);
    })
  }

  Array.prototype.remove = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === item) {
        this.splice(i, 1);
        break;
      }
    }
    return this;
  }
  
  return apa;
})();