const reveals = document.querySelectorAll('.reveal');

const regions = {
  ae: { price: '29 AED', phone: '971565592944', displayPhone: '+971 56 559 2944' },
  in: { price: '₹299', phone: '917736342089', displayPhone: '+91 77363 42089' }
};

const regionFromUrl = new URLSearchParams(window.location.search).get('region');

function applyRegion(regionCode) {
  const region = regions[regionCode] || regions.ae;
  document.querySelectorAll('[data-price]').forEach((element) => {
    element.textContent = region.price;
  });
  document.querySelectorAll('[data-order-link]').forEach((link) => {
    const message = encodeURIComponent(`Hi ECOSOLE, I'd like to order the shoe cleaning foam for ${region.price}.`);
    link.href = `https://wa.me/${region.phone}?text=${message}`;
  });
  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = `https://wa.me/${region.phone}`;
    link.textContent = region.displayPhone;
  });
}

async function detectRegion() {
  if (regionFromUrl) {
    applyRegion(regionFromUrl.toLowerCase());
    return;
  }
  try {
    const response = await fetch('https://ipapi.co/country/', { signal: AbortSignal.timeout(2500) });
    const countryCode = (await response.text()).trim().toLowerCase();
    applyRegion(countryCode === 'in' ? 'in' : 'ae');
  } catch {
    applyRegion('ae');
  }
}

detectRegion();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element) => revealObserver.observe(element));
