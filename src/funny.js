(function(){
function dec(normal, i18n, link) {
  if (!normal) return;
  var index = ~~(Math.random() * sentences.length);
  sentences.splice(index, 0, { text: [normal], link: link, fun: true });
  var langs = Object.keys(i18n || {});
  var lang, key = normal.toLowerCase();
  while (lang = langs.shift()) {
    var t = i18ns[lang.toLowerCase()];
    if (t) t[key] = i18n[lang];
  }
  return index;
}

dec("17 muscles engaged when a person smiles.", { "zh-CN": "当一个人笑时，有17条肌肉参与" })
dec("Human DNA contains 80,000 genes.", { "zh-CN": "人类DNA含有八百万个基因" })
dec("It is impossible to sneeze with your eyes open.", { "zh-CN": "眼睛睁着的时候无法打喷嚏" })

dec("Napoleion Bonaparte was afraid of cats.", { "zh-CN": "拿破仑害怕猫" })
dec("Most toilets flush in E flat.", { "zh-CN": "多数马桶的抽水音调是降E" })
dec("Elvis failed his music class in school.", { "zh-CN": "猫王在学校的音乐成绩不及格" })
dec("A single violin is made of seventy separate pieces of wood.", { "zh-CN": "一个小提琴由70块木头组成" })

dec("Click the white cat and it will dance.", { "zh-CN": "点击那只白猫，它会跳舞" })
dec("When your cursor hovers here, the text will not change.", { "zh-CN": "鼠标放在这里时，这里的文字不会变" })
dec("", { "zh-CN": "" })

sentences.push({
  text: ["There are %1 strings in total and you've read all of them.", ""+sentences.length],
  fun: true
})

})();