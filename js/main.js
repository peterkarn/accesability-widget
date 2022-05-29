(function () {
  let isReversed = false;

  let isFirstHeadingInput = true;
  let isFirstLinkInput = true;
  let isFirstMarkInput = true;

  let observer = new MutationObserver(() => getLandmarks());

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  function getLandmarks() {
    const keyMarks = {
      anchors: document.querySelectorAll('a'),
      headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
      landmarks: document.querySelectorAll('header, main, nav, footer, search, [role="*"]')
    }

    for (let key in keyMarks) {
      keyMarks[key].forEach(tag => {
        tag.setAttribute('tabindex', '0');
        tag.classList.add('focusable');
      })
    }
    return keyMarks
  }

  class DoubleEndedQueue {
    constructor(arr, isFirstInput) {
      this.arr = arr;
      this.isFirstInput = isFirstInput;
    }

    firstToEnd() {
      const el = this.arr.shift();
      this.arr.push(el);
    }

    lastToStart() {
      const el = this.arr.pop();
      this.arr.unshift(el);
    }

    focusAndShow() {
      this.arr[0].focus();
      this.arr[0].scrollIntoView();
    }

    switchElement() {
      if (this.isFirstInput && !isReversed) {
        this.isFirstInput = false;
        this.focusAndShow();
        return
      }
      if (!isReversed) { 
        this.firstToEnd();
      }
      if (isReversed) {
        this.lastToStart();
      }
      this.focusAndShow();
    }
  }

  let deHeadings = new DoubleEndedQueue([...getLandmarks().headings], isFirstHeadingInput);
  let deLinks = new DoubleEndedQueue([...getLandmarks().anchors], isFirstLinkInput);
  let deMarks = new DoubleEndedQueue([...getLandmarks().landmarks], isFirstMarkInput);
  
  function doubleEndedSwitcher(elements) {
    elements.switchElement();
  }
 
  // ========= double ended queue implementation =============

  document.addEventListener('keydown', (e) => {
    if (e.target.nodeName.toLowerCase() !== 'input') {
      switch (e.key) {
        case 'h': 
          doubleEndedSwitcher(deHeadings);
          break;
        case 'l':
          doubleEndedSwitcher(deLinks);
          break;
        case 'm':
          doubleEndedSwitcher(deMarks);
          break;
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    e.key === 'ArrowUp' ? isReversed = true : null;
    e.key === 'ArrowDown' ? isReversed = false : null;
  });
})();