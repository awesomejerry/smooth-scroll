export default function smoothScrollTo(node, endScrollTop) {
  function scrolling(direction, diff, time, resolve, reject) {
    const now = Date.now();
    const n = node;
    let step;
    if (time - now > 300) {
      step = Math.abs(diff / 30);
    } else if (time - now > 500) {
      step = Math.abs(diff / 50);
    } else if (time - now > 700) {
      step = Math.abs(diff / 70);
    } else {
      step = Math.abs(diff / 100);
    }

    let needScroll = false;
    let lastScrollTop;
    if (direction === 'up') {
      lastScrollTop = n.scrollTop;
      if (lastScrollTop - endScrollTop < step) {
        n.scrollTop = endScrollTop;
        needScroll = false;
      } else {
        n.scrollTop -= step;
        if (n.scrollTop === lastScrollTop) {
          needScroll = false;
        } else if (n.scrollTop > endScrollTop) {
          needScroll = true;
        }
      }
    } else {
      lastScrollTop = n.scrollTop;
      if (endScrollTop - lastScrollTop < step) {
        n.scrollTop = endScrollTop;
        needScroll = false;
      } else {
        n.scrollTop += step;
        if (n.scrollTop === lastScrollTop) {
          needScroll = false;
        } else if (n.scrollTop < endScrollTop) {
          needScroll = true;
        }
      }
    }

    if (needScroll) {
      setTimeout(scrolling, 9, direction, diff, time, resolve, reject);
    } else {
      resolve(true);
    }
  }

  return new Promise((resolve, reject) => {
    const startScrollTop = node.scrollTop;
    const diff = endScrollTop - startScrollTop;
    let direction = null;
    if (diff > 0) {
      direction = 'down';
    } else if (diff < 0) {
      direction = 'up';
    }
    let time;
    if (direction) {
      time = Date.now() + (1000 * 2);
      setTimeout(scrolling, 9, direction, diff, time, resolve, reject);
    } else {
      reject(true);
    }
  });
}
