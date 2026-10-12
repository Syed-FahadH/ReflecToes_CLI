/* Tidy review text: the review feed stores titles as **Title** with no space before the body. */
(function () {
  var pattern = /\*\*([^*]+)\*\*/g;

  function tidy(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    var hits = [];
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf('**') !== -1) hits.push(node);
    }
    hits.forEach(function (n) {
      n.nodeValue = n.nodeValue.replace(pattern, function (m, title) {
        title = title.trim();
        return title + (/[.!?]$/.test(title) ? ' ' : '. ');
      });
    });
  }

  function start() {
    var app = document.getElementById('opinew_product_plugin_app');
    if (!app) return;
    var busy = false;
    var mo = new MutationObserver(function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () {
        tidy(app);
        busy = false;
      });
    });
    mo.observe(app, { childList: true, subtree: true });
    tidy(app);
    setTimeout(function () { mo.disconnect(); }, 60000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
