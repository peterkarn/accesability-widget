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

  function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .focusable {
        transition: transform 0.2s ease-in-out;
        transform-origin: bottom left;
      }

      .focusable:focus-visible {
        position: relative;
        display: block;
        outline: 5px solid yellow !important;
        background: #0F60B6 !important;
        color: #fff !important;
        transform: scale(1.5);
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);
  }
  injectStyles();

  class DoubleEndedElementSwitcher {
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
      this.arr[0].scrollIntoView({
        block: 'center',
      });
    }

    switchElement() {
      try {
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
      } catch(err) {
        alert('No such elements on page')
      }
    }
  }

  let headings = new DoubleEndedElementSwitcher([...getLandmarks().headings], isFirstHeadingInput);
  let links = new DoubleEndedElementSwitcher([...getLandmarks().anchors], isFirstLinkInput);
  let marks = new DoubleEndedElementSwitcher([...getLandmarks().landmarks], isFirstMarkInput);
  
  function doubleEndedSwitcher(elements) {
    elements.switchElement();
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.nodeName.toLowerCase() !== 'input') {
      switch (e.key) {
        case 'h': 
          doubleEndedSwitcher(headings);
          break;
        case 'l':
          doubleEndedSwitcher(links);
          break;
        case 'm':
          doubleEndedSwitcher(marks);
          break;
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    e.key === 'ArrowUp' ? isReversed = true : null;
    e.key === 'ArrowDown' ? isReversed = false : null;
  });
})();
