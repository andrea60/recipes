let startingX: number | undefined;
let endX: number | undefined;
let lastSwipeTime: Date | undefined;

const reset = () => {
  startingX = undefined;
  endX = undefined;
};

export const gestureDetector = {
  startListening() {
    document.ontouchstart = (e) => {
      const startPos = e.targetTouches[0].clientX;
      if (startPos > 50) {
        reset();
        return;
      }
      startingX = startPos;
    };

    document.ontouchmove = (e) => (endX = e.targetTouches[0].clientX);

    const minSwipeDistance = 50;
    document.ontouchend = (e) => {
      if (!startingX || !endX) {
        reset();
        return;
      }
      const distance = startingX - endX;
      const isLeftSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe) {
        lastSwipeTime = new Date();
        // alert("This is a swipe!!");
      }

      reset();
    };
  },

  hasSwipedInLast(milliseconds: number) {
    if (!lastSwipeTime) return false;

    const deltaTime = new Date().valueOf() - lastSwipeTime.valueOf();

    return deltaTime <= milliseconds;
  },
};
