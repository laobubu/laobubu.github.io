var startTime = +new Date();

var navMain = document.getElementById("nav-main");
var marquee = document.getElementById("marquee");

var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
if (iOS) {
  navMain.style.paddingTop = "20px"; //for gods sake
}

function WaveShow(canvas, options) {
  var ctx = canvas.getContext("2d");
  var opt = {
    circleCount: 5,
    radiusMax: 70,
    radiusMin: 30,
    centerX: 0,
    centerY: 0,
    centerRadius: 50,
    lifeTimeMax: 2000,
    lifeTimeMin: 200,
    colors: ['#CDDC39', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#4CAF50', '#4DD0E1', '#9575CD', '#F44336']
  };
  var playing = false;
  options && (opt = Object.assign(opt, options));

  var circles = [];

  function emit(force) {
    if (!force && (circles.length >= opt.circleCount)) return null;
    var color = opt.colors[~~(Math.random() * opt.colors.length)];
    var cmatch = /^#(..)(..)(..)$/.exec(color);
    cmatch && (color = cmatch.slice(1).map(function (hex) { return parseInt(hex, 16) }).join(','));

    var n = {
      color: color, //format: "255, 0, 255"
      x: opt.centerX + (Math.random() - 0.5) * 2 * opt.centerRadius,
      y: opt.centerY + (Math.random() - 0.5) * 2 * opt.centerRadius,
      radius: opt.radiusMin + Math.random() * (opt.radiusMax - opt.radiusMin),
      lifeTime: opt.lifeTimeMin + Math.random() * (opt.lifeTimeMax - opt.lifeTimeMin),
      createdTime: +new Date()
    };
    circles.push(n);
    return n;
  }

  function drawCircle(circle, timestamp) {
    var lifeTime = (timestamp - circle.createdTime) / circle.lifeTime;
    if (lifeTime >= 1) return false;
    lifeTime = Math.pow(lifeTime, 0.5);
    var radius = circle.radius * lifeTime;
    var color = 'rgba(' + circle.color + ',' + (1 - lifeTime) + ')';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, radius, 0, 6.2832, false);
    ctx.fillStyle = color;
    ctx.fill();
    return true;
  }

  function start() {
    playing = true;
    emit();
    repaint();
  }

  function stop() {
    playing = false;
  }

  function repaint() {
    var w = canvas.width, h = canvas.height;
    var timestamp = +new Date();
    var i;
    ctx.clearRect(0, 0, w, h);
    if (!circles.length) return;
    for (i = 0; i < circles.length; i++) {
      if (!drawCircle(circles[i], timestamp)) {
        circles.splice(i, 1);
        i--;
      }
    }
    while (playing && (i++ < opt.circleCount)) {
      emit();
    }
    requestAnimationFrame(repaint);
  }

  return {
    circles: circles,
    options: opt,
    emit: emit,
    start: start,
    repaint: repaint,
    stop: stop
  }
}

var cat = document.getElementById('marquee-cjw-cat');

try {
  var _dance_interval_val = 0;
  var beat = 60000 / 80;
  var music = document.createElement("audio");
  music.innerHTML = '<source src="./static/8bittry.mp3" type="audio/mpeg" /><source src="./static/8bittry.ogg" type="audio/ogg" />';
  music.setAttribute("loop", "true");
  music.loop = true;
  music.style.opacity = "0";
  music.style.position = "absolute";
  music.addEventListener("play", function () {
    music.currentTime = 0;
    _dance_interval();
    _dance_interval_val && clearInterval(_dance_interval_val);
    _dance_interval_val = setInterval(_dance_interval, beat);
  })
  music.addEventListener("pause", function () {
    _dance_interval_val && clearInterval(_dance_interval_val);
    _dance_interval_val = 0;
  })
  music.load();
  document.body.appendChild(music);
  var can = document.createElement("canvas");
  can.id = "marquee-animation";
  document.getElementById("marquee").appendChild(can);
  var waveShow = WaveShow(can, {
    circleCount: 0,
    lifeTimeMax: beat,
    lifeTimeMin: beat / 2,
    radiusMax: 200,
    radiusMin: 100
  });
  function _dance_interval() {
    var i = 10;
    while (i--) waveShow.emit(true);
    waveShow.repaint();
    if (music.currentTime >= 60) {
      music.currentTime = 0;
      music.play();
    }
  }
  function dance() {
    waveShow.start();
    cat.className = "cjwJmp";
    music.play();
  }
  function undance() {
    waveShow.stop();
    cat.className = "";
    music.pause();
  }
  var nyanTooltip = document.querySelector("#marquee-cjw .tooltip")
  cat.addEventListener("mouseover", function (ev) {
    nyanTooltip.style.display = "block";
    nyanTooltip.style.left = (cat.offsetLeft + cat.offsetWidth / 3) + 'px';
    nyanTooltip.style.top = (cat.offsetTop - nyanTooltip.offsetHeight - 10) + 'px';
  }, false);
  cat.addEventListener("mouseout", function (ev) {
    nyanTooltip.style.display = "none";
  }, false);
  cat.addEventListener("click", function (ev) {
    nyanTooltip.style.display = "none";
    cat.className ? undance() : dance();
  }, false);

  var resized = function () {
    can.width = can.offsetWidth;
    can.height = can.offsetHeight;
    waveShow.options.centerX = cat.offsetLeft + cat.parentElement.offsetLeft + cat.offsetWidth / 2;
    waveShow.options.centerY = cat.offsetTop + cat.parentElement.offsetTop + cat.offsetHeight / 2;
    waveShow.options.centerRadius = Math.min(window.innerWidth, window.innerHeight) / 2;
  }
  window.onresize = resized;
  cat.onload = resized;
  setTimeout(resized, 0);
} catch (er) {
}

////////////TYPEWRITE

var typeContainer = document.getElementById("wtf");
var cursor = document.getElementById("wtf_cursor");
var cursorShown = 0;
var wipeOutSpeed = 20;
var pauseTime = 550;
var inputSpeed = 30;
setInterval(function () {
  cursor.style.visibility = cursorShown ? "visible" : "hidden";
  cursorShown ^= 1;
}, 300);
/**
 * delete all chars then type in texts
 * option = {
 *  //callbacks
 *    emptied
 *    ended
 * }
 */
function showSentence(text, option, phase2) {
  if (!phase2) {
    var s = getText(typeContainer);
    if (s.length) {
      setText(typeContainer, s.substr(0, s.length - 1))
      cursorShown = 0;
      setTimeout(function () { showSentence(text, option) }, wipeOutSpeed);
    } else {
      (typeof option.emptied === "function") && option.emptied();
      setTimeout(function () { showSentence(text, option, 1) }, pauseTime);
    }
    return;
  }
  setText(typeContainer, text.substr(0, phase2));
  cursorShown = 0;
  if (phase2 === text.length) {
    (typeof option.ended === "function") && option.ended();
  } else {
    setTimeout(function () { showSentence(text, option, phase2 + 1) }, inputSpeed);
  }
}

var wtf_link = document.getElementById('wtf_link');

var sentences = [
  { text: ["Welcome to %1", "laobubu.net"] }
];
sentences[0].fun = true;

function _t_s(str) {
  return (typeof _t === "function") ? _t(str) : str;
}

(function () {
  function release() {
    this.element.className = "";
    this.release = null;
  }
  var walls = document.querySelectorAll('#wtf_out .linkwall');
  for (var i = walls.length - 1; i >= 0; i--) {
    var wall = walls[i];
    var eles = wall.childNodes;
    for (var j = eles.length - 1; j >= 0; j--) {
      var ele = eles[j];
      if (ele.nodeType === 1) {
        var link = ele.href;
        var text = getText(ele).split(" : ", 2);
        ele.innerHTML = "<span data-translate>" + text.join("</span> : <span data-translate>") + "</span>";
        text.unshift(ele.parentElement.getAttribute("data-format"));
        var sentence = {
          text: text,
          link: link,
          element: ele,
          parent: wall
        };
        sentence.release = release.bind(sentence);
        sentence.element.className = "hidden";
        sentences.push(sentence)
      } else 
      wall.removeChild(ele);
    }
  }
})();

var sentences_i = 0;
var sentenceKeepTime = 2500;

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
sentences = shuffleArray(sentences);

var funnyCounter = 0;
var wtf_container = document.getElementById('wtf_container');
var freezed = false;
wtf_container.onmouseover = function () { freezed = true; }
wtf_container.onmouseout = function () { freezed = false; }

function showLine(firstInit) {
  if (freezed || (typeof _t !== "function")) {
    setTimeout(function () { showLine(firstInit) }, 200);
    return;
  }
  if (firstInit) {
    var script = document.createElement('script');
    script.src = "funny.js";
    document.body.appendChild(script);
  }
  var sentence = sentences.splice(sentences_i, 1)[0];
  var text = _t.apply(window, sentence.text);
  if (Math.random() < funnyCounter) {
    var time = (+new Date() - startTime) / 1000;
    text = _t("You've been here for %1 sec.", time);
    sentences.splice(sentences_i, 0, sentence);
    sentence = { text: text, fake: true, fun: true };
    sentences_i--;
    funnyCounter = -0.5;
  } else {
    funnyCounter = (funnyCounter * 3 + 0.3) / 4;
  }

  function emptied() {
    wtf_link.style.display = sentence.link ? "inline" : "none";
  }

  function ended() {
    if (sentence.link) {
      wtf_link.href = sentence.link || "#";
      wtf_link.className = "";
    }
    if (!sentence.shown) {
      sentence.release && sentence.release();
      sentence.shown = true;
    }
    if (!sentence.fake) sentences.splice(sentences_i, 0, sentence);
    if (++sentences_i === sentences.length) sentences_i = 0;
    setTimeout(showLine, sentenceKeepTime + 70 * text.split(/\w+|[\W]/g).length);
  }

  wtf_link.className = "hidden";
  showSentence(text, {
    emptied: emptied,
    ended: ended
  });
}
setText(typeContainer, "Hello World")
wtf_link.className = "hidden";
showLine(true);

document.getElementById('marquee-bala').onclick = function(){
  document.getElementById('wtf_out').className  ="active";
}