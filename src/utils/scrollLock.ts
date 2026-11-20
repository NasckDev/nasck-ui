let locks = 0;
let previous = { overflow: '', paddingRight: '' };

/** Prevents the page behind a modal from scrolling; returns the unlock function. Reference counted. */
export const lockScroll = (): (() => void) => {
  if (locks === 0) {
    const { body } = document;
    previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      document.body.style.overflow = previous.overflow;
      document.body.style.paddingRight = previous.paddingRight;
    }
  };
};
