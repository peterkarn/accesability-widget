(function () {
  let isReversed = false;

  let currentHeading = 0;
  let currentLink = 0;
  let currentMark = 0;

  let observer = new MutationObserver(() => getLandmarks());

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterDataOldValue: true
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

  function arrayIterator(arr, currentIndex) {
    if (isReversed) {
      if (currentIndex === 0) {
        currentIndex = arr.length - 1;
      } else {
        currentIndex--;
      }
    }

    if (!isReversed) {
      if (currentIndex === arr.length - 1) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
    }
    return currentIndex;
  }

  function switchHeadings() {
    const { headings } = getLandmarks();
    currentHeading = arrayIterator(headings, currentHeading);
    headings[currentHeading].focus();
  }

  function switchLinks() {
    const {anchors} = getLandmarks();
    currentLink = arrayIterator(anchors, currentLink);
    anchors[currentLink].focus();
  }

  function switchMark() {
    const { landmarks } = getLandmarks();
    currentMark = arrayIterator(landmarks, currentMark);
    landmarks[currentMark].focus();
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.nodeName.toLowerCase() !== 'input') {
      switch (e.key) {
        case 'h':
          switchHeadings();
          break;
        case 'l':
          switchLinks();
          break;
        case 'm':
          switchMark();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    e.key === 'ArrowUp' ? isReversed = true : null;
    e.key === 'ArrowDown' ? isReversed = false : null;
  });
})();