var scaling = false;

var displays = [];
chrome.system.display.getInfo(function(ds) {
  for (var display of ds) {
    displays.push(display.bounds);
  }
});

function initWin(win) {
  for (var display of displays) {
    if (win.left >= display.left && win.left <= display.left + display.width &&
      win.top >= display.top && win.top <= display.top + display.height) {
      win.left = display.left;
      win.top = display.top;
      win.width = display.width;
      win.height = display.height;
      originalWins[win.id] = win;
      break;
    }
  }
}

var originalWins = {};
chrome.windows.getAll({}, function(winArr) {
  for (var win of winArr) {
    initWin(win);
  }
});

chrome.windows.onCreated.addListener(function(win) {
  initWin(win);
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type == 'scroll' && sender.tab.active) {
    var scale = msg.top / msg.height;
    if (!scaling) {
      scaleWindow(sender.tab.windowId, scale);

    }
  }
});

function scaleWindow(windowId, scale) {
  scaling = true;

  var original = originalWins[windowId];

  var newWidth = Math.round(original.width - original.width * scale);
  var params = {
    left: Math.round((original.width - newWidth) / 2),
    width: newWidth,
    height: Math.round(original.height - original.height * scale)
  };
  if (newWidth < 400) {
    delete params.left;
  }

  chrome.windows.update(windowId, params, function(win) {
    scaling = false;
  });
}

// var isFocused;
//
// chrome.windows.getCurrent({}, function(win) {
//   isFocused = win.focused;
//   toBlur(isFocused);
//   init();
// });
//
//
// function init() {
//   chrome.windows.onFocusChanged.addListener(function(windowId) {
//     if (windowId == -1) {
//       isFocused = false;
//       toBlur(false);
//     } else {
//       isFocused = true;
//       toBlur(true);
//     }
//   });
//
//   chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//     if (msg == 'load') {
//       toBlur(isFocused);
//     }
//   });
// }
//
// function toBlur(bool) {
//
// }
//
chrome.tabs.query({}, function(tabs) {
  for (var i = 0; i < tabs.length; ++i) {
    chrome.tabs.sendMessage(tabs[i].id, "5px");
  }
});

/*
  only blur selected window, unblur background windows even if chrome is in focus
*/
