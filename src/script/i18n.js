function ___a(){
  var words = ["鼓捣过", "爱过", "折腾过", "玩过", "感受过", "怕过", "体验过"]
  return words[~~(Math.random() * words.length)] + " %1";
}

var i18n = {};
var i18ns = {
  "zh-cn": {
    "blog": "博客",
    "twitter": "微博",
    "showcase": "作品展示",
    "buy me a coffee": "帮我买杯咖啡",
    "nyan": "喵",
    "learn more": "了解详情",
    "the %1 of %2": "%2的%1",
    "author": "作者",
    "translator": "翻译者",
    "student": "学生",
    "member": "成员",
    "copter": "四轴飞行器",
    "mcu": "单片机",
    "welcome to %1": "欢迎访问 %1",
    "you've been here for %1 sec.": "你已经在这里呆了 %1 秒",
    "have been working on %1": ___a,
    'have been working on:': '鼓捣过',
    'the ... of ...': '头衔与经历',
    'show all': '显示全部',
    "there are %1 strings in total and you've read all of them.": "这里总共有 %1 条句子，你已经都看过一次了"
  }
}
var _t = (function () {
  var subchoose = navigator.language || navigator.userLanguage || navigator.systemLanguage || "en-US";
  var langs = navigator.languages || [];
  if (!langs.length) langs.push(subchoose);
  
  for (var i = 0; i < langs.length; i++) {
    var tt = i18ns[langs[i].toLowerCase()];
    if (tt) {
      i18n = tt;
      break;
    }
  }
  if (i18n.__url__ && location.pathname != i18n.__url__) {
    location.href = i18n.__url__ + location.search + location.hash;
    return;
  }

try{
  var items = document.querySelectorAll("[data-translate]");
  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    var text = item.textContent || item.innerText;
    text = i18n[text.trim().toLowerCase()] || text;
    item.innerText ? (item.innerText = text) : (item.textContent = text);
  }
} catch (er){}
  
  return function _t(text) {
    text = ""+text;
    var str = i18n[text.toLowerCase()] || text;
    var ar = arguments;
    if (typeof str === "function") str = str();
    str = str.replace(/%(\d+)/g, function(_,i){return _t(ar[i])});
    return str;
  }
})();