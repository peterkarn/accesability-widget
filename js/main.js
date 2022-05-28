//https://www.npmjs.com/package/double-ended-queue
// stack
// queue

(function () {
  const keyTags = ['main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'anchor'];
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const anchors = document.querySelectorAll('a');
  const landmarks = document.querySelectorAll('main, banner, complementary, contentinfo, form, main, navigation, search, anchor, [role]');
  let isReversed = false;

  let currentHeading = 0;
  let currentLink = 0;
  let currentMark = 0;

  let observer = new MutationObserver(getLandmarks);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterDataOldValue: true
  });

  const filteredLandmarks = [...document.querySelectorAll('*')].filter(landmark => {
    return keyTags.includes(landmark.tagName.toLowerCase()) || landmark.getAttribute('role');
  });

  filteredLandmarks.forEach(landmark => {
    landmark.setAttribute('tabindex', '0');
    landmark.classList.add('focusable');
  });

  function getLandmarks() {
    console.log('recalculate landmarks');
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
    const headings = filteredLandmarks.filter(landmark => {
      return headingTags.includes(landmark.tagName.toLowerCase())
    });
    currentHeading = arrayIterator(headings, currentHeading);
    headings[currentHeading].focus();
  }

  function switchLinks() {
    currentLink = arrayIterator(anchors, currentLink);
    anchors[currentLink].focus();
  }

  function switchMark() {
    currentMark = arrayIterator(landmarks, currentMark);
    landmarks[currentMark].focus();
  }

  //key handlers

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