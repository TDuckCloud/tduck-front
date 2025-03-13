(() => {
  let className = "math-tex";
  if (document.currentScript) {
    let urlParts = document.currentScript.getAttribute("src").split("?");
    if (urlParts[1]) {
      let queryParams = urlParts[1].split("&");
      for (let i = 0; i < queryParams.length; i++) {
        let param = queryParams[i].split("=");
        if (param[0] == "class") {
          className = param[1];
          break;
        }
      }
    }
  }
  MathJax = {
    options: {
      processHtmlClass: className + "|" + className + "-original",
      ignoreHtmlClass: ".*"
    }
  };
})();
