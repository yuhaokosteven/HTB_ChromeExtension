$(window).scroll(function(e) {
  var top = $(window).scrollTop();
  var height = $(document).height();
  chrome.runtime.sendMessage({
    type: 'scroll',
    top: top,
    height: height
  });

  function createRemap(inMin, inMax, outMin, outMax) {
    return function remaper(x) {
      return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };
  }
  var h = window.innerHeight;
  // var h = document.body.scrollTop;
  var f2c = createRemap(0, h, 0, 255);
  document.body.style.backgroundColor = 'rgb(' + f2c(h) + ',' + f2c(h) + ',' + f2c(h) + ')';
  // document.body.style.filter = 'blur(5px)';
  // debugger;


});


// $(function() {
//   chrome.runtime.sendMessage('load');
//
//   chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//     console.log(msg);
//     if (msg) {
//       // var b = "blur(" + msg + ")";
//       // document.body.style.filter = b;
//
//     } else {
//       //   document.body.style.filter = '';
//     }
//   });
// });
