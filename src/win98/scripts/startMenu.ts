export function initializeStartMenu() {
  const startBtn = document.getElementById('startBtn');
  const startMenu = document.getElementById('startMenu');
  let isMenuOpen = false;

  startBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    startMenu?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!startBtn?.contains(target) && 
        !startMenu?.contains(target)) {
      startMenu?.classList.remove('active');
      isMenuOpen = false;
    }
  });
} 