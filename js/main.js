function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasHoverPointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function enableReveal() {
  var elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    Array.prototype.forEach.call(elements, function (element) {
      element.classList.add('is-visible');
    });
    return;
  }

  Array.prototype.forEach.call(elements, function (element) {
    element.classList.add('can-reveal');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12
  });

  Array.prototype.forEach.call(elements, function (element) {
    var rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      element.classList.add('is-visible');
      return;
    }

    observer.observe(element);
  });
}

function enablePointerField() {
  if (prefersReducedMotion() || !hasHoverPointer()) {
    return;
  }

  window.addEventListener('pointermove', function (event) {
    var x = Math.round((event.clientX / window.innerWidth) * 100);
    var y = Math.round((event.clientY / window.innerHeight) * 100);
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
  }, { passive: true });
}

function enableTiltCards() {
  if (prefersReducedMotion() || !hasHoverPointer()) {
    return;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.tilt-card'), function (card) {
    card.addEventListener('pointermove', function (event) {
      var rect = card.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) - 0.5;
      var y = ((event.clientY - rect.top) / rect.height) - 0.5;

      card.style.setProperty('--card-x', Math.round((x + 0.5) * 100) + '%');
      card.style.setProperty('--card-y', Math.round((y + 0.5) * 100) + '%');
      card.style.setProperty('--tilt-x', (x * 4).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (y * -4).toFixed(2) + 'deg');
    }, { passive: true });

    card.addEventListener('pointerleave', function () {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--card-x');
      card.style.removeProperty('--card-y');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  enableReveal();
  enablePointerField();
  enableTiltCards();
});
