export function initializeWindow() {
  const windows = document.querySelectorAll('.window-modal');

  windows.forEach(window => {
    const header = window.querySelector('.window-header') as HTMLElement;
    const closeBtn = window.querySelector('.close');
    const maximizeBtn = window.querySelector('.maximize');
    const minimizeBtn = window.querySelector('.minimize');

    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;

    // Dragging functionality
    header.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    // Window controls
    closeBtn?.addEventListener('click', () => {
      window.setAttribute('data-open', 'false');
    });

    maximizeBtn?.addEventListener('click', () => {
      window.classList.toggle('maximized');
    });

    minimizeBtn?.addEventListener('click', () => {
      window.classList.toggle('minimized');
    });

    function startDragging(e: MouseEvent) {
      isDragging = true;
      initialX = e.clientX - (window as HTMLElement).offsetLeft;
      initialY = e.clientY - (window as HTMLElement).offsetTop;
    }

    function drag(e: MouseEvent) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        (window as HTMLElement).style.left = `${currentX}px`;
        (window as HTMLElement).style.top = `${currentY}px`;
      }
    }

    function stopDragging() {
      isDragging = false;
    }
  });
} 