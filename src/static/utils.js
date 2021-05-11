// 获取系统当前的日期和时间等信息
//  var dt = new Date().format("yyyy年MM月dd日-");
Date.prototype.format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }       
  }
  return fmt;
}

// 同步设置 TEXTAREA 编辑框内容
function setNativeValue(element, value) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {}
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    throw new Error('指定的元素没有 setter.');
  }
}
// 把指定内容写入 TEXTAREA
function fillTextArea(textarea_id, contents) {
  var element = document.getElementById(textarea_id);
  setNativeValue(element, contents);
  element.dispatchEvent(new Event('input', { bubbles: true }));
}
// 读取本地文件内容并做处理
function readLocalFile(e) {
  var file = e.target.files[0];
  var textarea_id = e.target.textarea_id;
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var opml_text = e.target.result;
    var escaped_opml_text = opmlTextEscape(opml_text);
    var json_obj = OPML2JSON(escaped_opml_text);
    var markdown_str = JSON2Markdown(json_obj);
    // 读取出文件内容立即写入 TEXTAREA 区域
    fillTextArea(textarea_id, markdown_str);
  };
  reader.readAsText(file);
}
// 对文本内容中的 > < 等符号做编码处理
function encodeHTML(text) {
  var textarea = document.createElement("textarea");
  textarea.textContent = text;
  return textarea.innerHTML;
}
// 对文本内容中的 &gt; &lt; 等符号做解码处理
function decodeHTML(html) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}
// 点击下载按钮后，利用此方法创建文件并唤起下载动作
function download(file_ext, text) {
  var pom = document.createElement('a');
  var markdown_box = document.getElementById('markdown');
  var filename = getFileName(markdown_box.value);
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename + file_ext);
  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
}

