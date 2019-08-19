import { baseUrl } from '../config';

const tools = {};

tools.leftB = function (s, n) {
  var s2 = s.slice(0, n),
      i = s2.replace(/[^\x00-\xff]/g, "**").length;
  if (i <= n) {
    return s2;
  }
  i -= s2.length;
  switch (i) {
    case 0:
      return s2;
    case n:
      return s.slice(0, n >> 1);
    default:
      var k = n - i,
          s3 = s.slice(k, n),
          j = s3.replace(/[\x00-\xff]/g, "").length;
      return j ? s.slice(0, k) + tools.leftB(s3, j) : s.slice(0, k);
  }
};

tools.cut = function (s, n, a, b) {
  var r = b ? s.substr(0, n) : tools.leftB(s, n);
  return r == s ? r : r + (typeof a === 'undefined' ? '…' : a);
};

tools.getBlob = function(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    callback(xhr.response)
  }
  xhr.send()
}

tools.imgUpload = function (url, file_type = '', cb) {
  if(/blob:/.test(url)){
    this.getBlob(url, (file)=>{
      const img = new File([file], 'img', {type: file_type, lastModified: Date.now()});
      const fd = new FormData();
      fd.append('img', img);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("post",`${baseUrl}/api/v1/upload/upload`, true);
      xmlHttp.send(fd);
      xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState==4){
            if(xmlHttp.status==200){
                var data = JSON.parse(xmlHttp.responseText);
                cb(data);
            }
        }
      }
    })
  } else{
    cb({data: {img_url: url}})
  }
}


export default tools
