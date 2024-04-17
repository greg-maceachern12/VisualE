// gradBG.js
export function initGradientBackground() {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
  
    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(() => {
        move();
      });
    }
  
    function handleMouseMove(event) {
      tgX = event.clientX;
      tgY = event.clientY;
    }
  
    window.addEventListener('mousemove', handleMouseMove);
    move();
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }