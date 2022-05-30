(function () {
  let isReversed = false;

  let currentHeading;
  let currentLink;
  let currentMark;

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

  function arrayIterator(arr, currentIndex, isFirstInput) {

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

    if (isFirstInput) {
      if (isReversed) { 
         return arr.length - 1;
      }
      return 0;
    }

    return currentIndex;
  }

  function setElementFocus(arrayOfAlements, currentIndex) {
    arrayOfAlements[currentIndex].focus();
    arrayOfAlements[currentIndex].scrollIntoView({
      block: 'center'
    });
  }

  function switchHeadings() {
    try {
      const { headings } = getLandmarks();
      currentHeading = arrayIterator(headings, currentHeading, isFirstHeadingInput);
      isFirstHeadingInput = false;
      setElementFocus(headings, currentHeading);
    } catch (error) {
      alert('No headings found. Theeir devs are lazy.');
    }
  }

  function switchLinks() {
    try {
      const { anchors } = getLandmarks();
      currentLink = arrayIterator(anchors, currentLink, isFirstLinkInput);
      isFirstLinkInput = false;
      setElementFocus(anchors, currentLink);
    } catch (error) {
      alert('No links found');
    }
  }

  function switchMark() {
    try {
      const { landmarks } = getLandmarks();
      currentMark = arrayIterator(landmarks, currentMark, isFirstMarkInput);
      isFirstMarkInput = false;
      setElementFocus(landmarks, currentMark);
    } catch (error) {
      alert('No landmarks found');
    }
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