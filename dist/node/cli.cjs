#!/usr/bin/env node
"use strict";
const index = require("../shared/index.cjs");
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function once(func) {
  let executed = false;
  return function(...args2) {
    if (executed) {
      return void 0;
    }
    executed = true;
    return func(...args2);
  };
}
function debounce(func, delay, mustRunDelay = Infinity) {
  let timer = null;
  let startTime = null;
  return function(...args2) {
    const currentTime = Date.now();
    if (timer) {
      clearTimeout(timer);
    }
    if (!startTime) {
      startTime = currentTime;
    }
    if (currentTime - startTime >= mustRunDelay) {
      func(...args2);
      startTime = currentTime;
    } else {
      timer = window.setTimeout(() => {
        func(...args2);
      }, delay);
    }
  };
}
class BrowserPangu extends index.Pangu {
  constructor() {
    super();
    __publicField(this, "isAutoSpacingPageExecuted");
    __publicField(this, "autoSpacingPageObserver");
    __publicField(this, "cjkObserver");
    __publicField(this, "blockTags");
    __publicField(this, "ignoredTags");
    __publicField(this, "presentationalTags");
    __publicField(this, "spaceLikeTags");
    __publicField(this, "spaceSensitiveTags");
    __publicField(this, "ignoredClass");
    this.isAutoSpacingPageExecuted = false;
    this.autoSpacingPageObserver = null;
    this.cjkObserver = null;
    this.blockTags = /^(div|p|h1|h2|h3|h4|h5|h6)$/i;
    this.ignoredTags = /^(code|pre|script|style|textarea|iframe|input)$/i;
    this.presentationalTags = /^(b|code|del|em|i|s|strong|kbd)$/i;
    this.spaceLikeTags = /^(br|hr|i|img|pangu)$/i;
    this.spaceSensitiveTags = /^(a|del|pre|s|strike|u)$/i;
    this.ignoredClass = "no-pangu-spacing";
  }
  hasCjk(sampleSize = 1e3) {
    if (index.ANY_CJK.test(document.title)) {
      return true;
    }
    const bodyText = document.body.textContent || "";
    const sample = bodyText.substring(0, sampleSize);
    return index.ANY_CJK.test(sample);
  }
  autoSpacingPage({ pageDelayMs = 1e3, nodeDelayMs = 500, nodeMaxWaitMs = 2e3 } = {}) {
    if (!(document.body instanceof Node)) {
      return;
    }
    if (this.isAutoSpacingPageExecuted) {
      return;
    }
    this.isAutoSpacingPageExecuted = true;
    const spacingPageOnceOnly = once(() => {
      this.spacingPage();
    });
    const videos = document.getElementsByTagName("video");
    if (videos.length === 0) {
      setTimeout(() => {
        spacingPageOnceOnly();
      }, pageDelayMs);
    } else {
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if (video.readyState === 4) {
          setTimeout(() => {
            spacingPageOnceOnly();
          }, 3e3);
          break;
        }
        video.addEventListener("loadeddata", () => {
          setTimeout(() => {
            spacingPageOnceOnly();
          }, 4e3);
        });
      }
    }
    this.setupAutoSpacingPageObserver(nodeDelayMs, nodeMaxWaitMs);
  }
  smartAutoSpacingPage({ pageDelayMs = 1e3, nodeDelayMs = 500, nodeMaxWaitMs = 2e3, sampleSize = 1e3, cjkObserverMaxWaitMs = 3e4 } = {}) {
    if (!this.hasCjk(sampleSize)) {
      console.log("[pangu.js] No CJK content detected, setting up observer");
      this.setupCjkObserver({ pageDelayMs, nodeDelayMs, nodeMaxWaitMs, sampleSize, cjkObserverMaxWaitMs });
      return;
    }
    this.autoSpacingPage({ pageDelayMs, nodeDelayMs, nodeMaxWaitMs });
  }
  spacingPage() {
    this.spacingPageTitle();
    this.spacingPageBody();
  }
  spacingPageTitle() {
    const xPathQuery = "/html/head/title/text()";
    this.spacingNodeByXPath(xPathQuery, document);
  }
  spacingPageBody() {
    let xPathQuery = "/html/body//*/text()[normalize-space(.)]";
    for (const tag of ["script", "style", "textarea"]) {
      xPathQuery = `${xPathQuery}[translate(name(..),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")!="${tag}"]`;
    }
    this.spacingNodeByXPath(xPathQuery, document);
  }
  spacingNode(contextNode) {
    let xPathQuery = ".//*/text()[normalize-space(.)]";
    if (contextNode instanceof Element && contextNode.children && contextNode.children.length === 0) {
      xPathQuery = ".//text()[normalize-space(.)]";
    }
    this.spacingNodeByXPath(xPathQuery, contextNode);
  }
  spacingElementById(idName) {
    const xPathQuery = `id("${idName}")//text()`;
    this.spacingNodeByXPath(xPathQuery, document);
  }
  spacingElementByClassName(className) {
    const xPathQuery = `//*[contains(concat(" ", normalize-space(@class), " "), "${className}")]//text()`;
    this.spacingNodeByXPath(xPathQuery, document);
  }
  spacingElementByTagName(tagName) {
    const xPathQuery = `//${tagName}//text()`;
    this.spacingNodeByXPath(xPathQuery, document);
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  spacingNodeByXPath(xPathQuery, contextNode) {
    if (!(contextNode instanceof Node) || contextNode instanceof DocumentFragment) {
      return;
    }
    const textNodes = document.evaluate(xPathQuery, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let currentTextNode;
    let nextTextNode = null;
    for (let i = textNodes.snapshotLength - 1; i > -1; --i) {
      currentTextNode = textNodes.snapshotItem(i);
      if (!currentTextNode) {
        continue;
      }
      if (currentTextNode.parentNode && this.isSpecificTag(currentTextNode.parentNode, this.presentationalTags) && !this.isInsideSpecificTag(currentTextNode.parentNode, this.ignoredTags)) {
        const elementNode = currentTextNode.parentNode;
        if (elementNode.previousSibling) {
          const { previousSibling } = elementNode;
          if (previousSibling.nodeType === Node.TEXT_NODE) {
            const testText = previousSibling.data.slice(-1) + currentTextNode.data.charAt(0);
            const testNewText = this.spacingText(testText);
            if (testText !== testNewText) {
              previousSibling.data = `${previousSibling.data} `;
            }
          }
        }
        if (elementNode.nextSibling) {
          const { nextSibling } = elementNode;
          if (nextSibling.nodeType === Node.TEXT_NODE) {
            const testText = currentTextNode.data.slice(-1) + nextSibling.data.charAt(0);
            const testNewText = this.spacingText(testText);
            if (testText !== testNewText) {
              nextSibling.data = ` ${nextSibling.data}`;
            }
          }
        }
      }
      if (this.canIgnoreNode(currentTextNode)) {
        nextTextNode = currentTextNode;
        continue;
      }
      if (currentTextNode instanceof Text) {
        const newText = this.spacingText(currentTextNode.data);
        if (currentTextNode.data !== newText) {
          currentTextNode.data = newText;
        }
      }
      if (nextTextNode) {
        if (currentTextNode.nextSibling && this.spaceLikeTags.test(currentTextNode.nextSibling.nodeName)) {
          nextTextNode = currentTextNode;
          continue;
        }
        if (!(currentTextNode instanceof Text) || !(nextTextNode instanceof Text)) {
          continue;
        }
        const testText = currentTextNode.data.slice(-1) + nextTextNode.data.slice(0, 1);
        const testNewText = this.spacingText(testText);
        if (testNewText !== testText) {
          let nextNode = nextTextNode;
          while (nextNode.parentNode && !this.spaceSensitiveTags.test(nextNode.nodeName) && this.isFirstTextChild(nextNode.parentNode, nextNode)) {
            nextNode = nextNode.parentNode;
          }
          let currentNode = currentTextNode;
          while (currentNode.parentNode && !this.spaceSensitiveTags.test(currentNode.nodeName) && this.isLastTextChild(currentNode.parentNode, currentNode)) {
            currentNode = currentNode.parentNode;
          }
          if (currentNode.nextSibling) {
            if (this.spaceLikeTags.test(currentNode.nextSibling.nodeName)) {
              nextTextNode = currentTextNode;
              continue;
            }
          }
          if (!this.blockTags.test(currentNode.nodeName)) {
            if (!this.spaceSensitiveTags.test(nextNode.nodeName)) {
              if (!this.ignoredTags.test(nextNode.nodeName) && !this.blockTags.test(nextNode.nodeName)) {
                if (nextTextNode.previousSibling) {
                  if (!this.spaceLikeTags.test(nextTextNode.previousSibling.nodeName)) {
                    if (nextTextNode instanceof Text) {
                      nextTextNode.data = ` ${nextTextNode.data}`;
                    }
                  }
                } else {
                  if (!this.canIgnoreNode(nextTextNode)) {
                    if (nextTextNode instanceof Text) {
                      nextTextNode.data = ` ${nextTextNode.data}`;
                    }
                  }
                }
              }
            } else if (!this.spaceSensitiveTags.test(currentNode.nodeName)) {
              if (currentTextNode instanceof Text) {
                currentTextNode.data = `${currentTextNode.data} `;
              }
            } else {
              const panguSpace = document.createElement("pangu");
              panguSpace.innerHTML = " ";
              if (nextNode.parentNode) {
                if (nextNode.previousSibling) {
                  if (!this.spaceLikeTags.test(nextNode.previousSibling.nodeName)) {
                    nextNode.parentNode.insertBefore(panguSpace, nextNode);
                  }
                } else {
                  nextNode.parentNode.insertBefore(panguSpace, nextNode);
                }
              }
              if (!panguSpace.previousElementSibling) {
                if (panguSpace.parentNode) {
                  panguSpace.parentNode.removeChild(panguSpace);
                }
              }
            }
          }
        }
      }
      nextTextNode = currentTextNode;
    }
  }
  stopAutoSpacingPage() {
    if (this.autoSpacingPageObserver) {
      this.autoSpacingPageObserver.disconnect();
      this.autoSpacingPageObserver = null;
    }
    if (this.cjkObserver) {
      this.cjkObserver.disconnect();
      this.cjkObserver = null;
    }
    this.isAutoSpacingPageExecuted = false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isContentEditable(node) {
    return node.isContentEditable || node.getAttribute && node.getAttribute("g_editable") === "true";
  }
  isSpecificTag(node, tagRegex) {
    return node && node.nodeName && tagRegex.test(node.nodeName);
  }
  isInsideSpecificTag(node, tagRegex, checkCurrent = false) {
    let currentNode = node;
    if (checkCurrent) {
      if (this.isSpecificTag(currentNode, tagRegex)) {
        return true;
      }
    }
    while (currentNode.parentNode) {
      currentNode = currentNode.parentNode;
      if (this.isSpecificTag(currentNode, tagRegex)) {
        return true;
      }
    }
    return false;
  }
  hasIgnoredClass(node) {
    if (node instanceof Element && node.classList.contains(this.ignoredClass)) {
      return true;
    }
    if (node.parentNode && node.parentNode instanceof Element && node.parentNode.classList.contains(this.ignoredClass)) {
      return true;
    }
    return false;
  }
  canIgnoreNode(node) {
    let currentNode = node;
    if (currentNode && (this.isSpecificTag(currentNode, this.ignoredTags) || this.isContentEditable(currentNode) || this.hasIgnoredClass(currentNode))) {
      return true;
    }
    while (currentNode.parentNode) {
      currentNode = currentNode.parentNode;
      if (currentNode && (this.isSpecificTag(currentNode, this.ignoredTags) || this.isContentEditable(currentNode))) {
        return true;
      }
    }
    return false;
  }
  isFirstTextChild(parentNode, targetNode) {
    const { childNodes } = parentNode;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) {
        return childNode === targetNode;
      }
    }
    return false;
  }
  isLastTextChild(parentNode, targetNode) {
    const { childNodes } = parentNode;
    for (let i = childNodes.length - 1; i > -1; i--) {
      const childNode = childNodes[i];
      if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) {
        return childNode === targetNode;
      }
    }
    return false;
  }
  setupAutoSpacingPageObserver(nodeDelayMs, nodeMaxWaitMs) {
    if (this.autoSpacingPageObserver) {
      this.autoSpacingPageObserver.disconnect();
      this.autoSpacingPageObserver = null;
    }
    const queue = [];
    const debouncedSpacingTitle = debounce(
      () => {
        this.spacingPageTitle();
      },
      nodeDelayMs,
      nodeMaxWaitMs
    );
    const debouncedSpacingNode = debounce(
      () => {
        while (queue.length) {
          const node = queue.shift();
          if (node) {
            this.spacingNode(node);
          }
        }
      },
      nodeDelayMs,
      nodeMaxWaitMs
    );
    this.autoSpacingPageObserver = new MutationObserver((mutations) => {
      var _a;
      let titleChanged = false;
      for (const mutation of mutations) {
        if (((_a = mutation.target.parentNode) == null ? void 0 : _a.nodeName) === "TITLE" || mutation.target.nodeName === "TITLE") {
          titleChanged = true;
          continue;
        }
        switch (mutation.type) {
          case "characterData":
            const { target: node } = mutation;
            if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
              queue.push(node.parentNode);
            }
            break;
          case "childList":
            for (const node2 of mutation.addedNodes) {
              if (node2.nodeType === Node.ELEMENT_NODE) {
                queue.push(node2);
              } else if (node2.nodeType === Node.TEXT_NODE && node2.parentNode) {
                queue.push(node2.parentNode);
              }
            }
            break;
        }
      }
      if (titleChanged) {
        debouncedSpacingTitle();
      }
      debouncedSpacingNode();
    });
    this.autoSpacingPageObserver.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true
    });
    this.autoSpacingPageObserver.observe(document.head, {
      characterData: true,
      childList: true,
      subtree: true
      // Need subtree to observe text node changes inside title
    });
  }
  setupCjkObserver({ nodeDelayMs = 500, nodeMaxWaitMs = 2e3, cjkObserverMaxWaitMs = 1e3 * 30 }) {
    if (this.cjkObserver) {
      this.cjkObserver.disconnect();
      this.cjkObserver = null;
    }
    const startTime = Date.now();
    this.cjkObserver = new MutationObserver(() => {
      if (Date.now() - startTime > cjkObserverMaxWaitMs) {
        if (this.cjkObserver) {
          this.cjkObserver.disconnect();
          this.cjkObserver = null;
        }
        console.log("[pangu.js] CJK observer timeout reached, stopping observer");
        return;
      }
      if (this.hasCjk()) {
        if (this.cjkObserver) {
          this.cjkObserver.disconnect();
          this.cjkObserver = null;
        }
        console.log("[pangu.js] CJK content detected, starting auto spacing");
        this.isAutoSpacingPageExecuted = false;
        this.autoSpacingPage({ pageDelayMs: 0, nodeDelayMs, nodeMaxWaitMs });
      }
    });
    this.cjkObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}
const pangu = new BrowserPangu();
const usage = `
usage: pangu [-h] [-v] [-t] [-f] text_or_path

pangu.js -- Paranoid text spacing for good readability, to automatically
insert whitespace between CJK and half-width characters (alphabetical letters,
numerical digits and symbols).

positional arguments:
  text_or_path   the text or file path to apply spacing

optional arguments:
  -h, --help     show this help message and exit
  -v, --version  show program's version number and exit
  -t, --text     specify the input value is a text
  -f, --file     specify the input value is a file path
`.trim();
const [, , ...args] = process.argv;
function printSpacingText(text) {
  if (typeof text === "string") {
    console.log(pangu.spacingText(text));
  } else {
    console.log(usage);
    process.exit(1);
  }
}
function printSpacingFile(path) {
  if (typeof path === "string") {
    console.log(pangu.spacingFileSync(path));
  } else {
    console.log(usage);
    process.exit(1);
  }
}
if (args.length === 0) {
  console.log(usage);
} else {
  switch (args[0]) {
    case "-h":
    case "--help":
      console.log(usage);
      break;
    case "-v":
    case "--version":
      console.log(pangu.version);
      break;
    case "-t":
      printSpacingText(args[1]);
      break;
    case "-f":
      printSpacingFile(args[1]);
      break;
    default:
      printSpacingText(args[0]);
  }
}
process.exit(0);
//# sourceMappingURL=cli.cjs.map
