(() => {
  const cube = document.querySelector('#workflow-cube');
  const scene = document.querySelector('#cube-scene');
  const description = document.querySelector('#workflow-description');
  const link = document.querySelector('#workflow-link');
  const controls = [...document.querySelectorAll('.workflow-control')];
  if (!cube || !scene || !description || !link) return;
  document.querySelectorAll('.cube-face img').forEach(image => { image.draggable = false; });

  const workflows = {
    platform: { x:-30, y:45, text:'One focused desktop platform for the jobs that usually send you looking for another app.', href:'/downloads.html', label:'Explore Quantaflex' },
    flexcam: { x:-18, y:-62, text:'Edit, format, and prepare social video without passing the work through a chain of disconnected tools.', href:'/features/flexcam', label:'Explore FlexCam' },
    cam2cam: { x:-18, y:118, text:'Private, direct video calls with a clear room-code flow and no meeting-platform clutter.', href:'/features/cam2cam', label:'Explore Cam2Cam' },
    learning: { x:72, y:28, text:'Present slides, guide tutorials, and keep the teaching experience in one focused space.', href:'/features/pro-online-learning', label:'Explore Pro Learning' },
    encoder: { x:-108, y:28, text:'Prepare media precisely with high-quality encoding options that live beside the rest of your workflow.', href:'/features/advanced-encoder', label:'Explore Advanced Encoder' },
    kineplex: { x:-18, y:208, text:'Give local media the home-cinema treatment, with robust playback that keeps your files on your machine.', href:'/features/kineplex', label:'Explore Kineplex' },
    inspector: { x:-18, y:28, text:'Inspect the technical detail inside your media before it becomes a problem further down the workflow.', href:'/features/media-inspector', label:'Explore Media Inspector' }
  };
  let current = 'platform', rx = -30, ry = 45, dragging = false, startX, startY, startRx, startRy, pressedModule, moved;
  const render = () => cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  const select = key => {
    const item = workflows[key]; if (!item) return;
    current = key; rx = item.x; ry = item.y; render();
    description.textContent = item.text; link.href = item.href; link.firstChild.textContent = item.label + ' ';
    controls.forEach(button => { const active = button.dataset.workflow === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', active); });
  };
  controls.forEach(button => button.addEventListener('click', () => select(button.dataset.workflow)));
  document.querySelectorAll('.cube-face').forEach(face => face.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.assign(workflows[face.dataset.module].href); }
  }));
  scene.addEventListener('pointerdown', event => { event.preventDefault(); dragging = true; moved = false; pressedModule = event.target.closest('.cube-face')?.dataset.module; startX = event.clientX; startY = event.clientY; startRx = rx; startRy = ry; scene.setPointerCapture(event.pointerId); scene.classList.add('is-dragging'); });
  scene.addEventListener('pointermove', event => { if (!dragging) return; const dx = event.clientX - startX; const dy = event.clientY - startY; if (Math.abs(dx) > 7 || Math.abs(dy) > 7) moved = true; ry = startRy + dx * .45; rx = Math.max(-75, Math.min(75, startRx - dy * .35)); render(); });
  const finish = () => { if (dragging && pressedModule && !moved) window.location.assign(workflows[pressedModule].href); dragging = false; pressedModule = undefined; scene.classList.remove('is-dragging'); };
  scene.addEventListener('pointerup', finish); scene.addEventListener('pointercancel', finish);
  scene.addEventListener('dragstart', event => event.preventDefault());
  render();
})();
