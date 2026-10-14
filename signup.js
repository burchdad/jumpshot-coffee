(function () {
  'use strict';

  const prices = { small: 100, medium: 125, large: 150 };
  const title = size => size.charAt(0).toUpperCase() + size.slice(1);

  function update(size) {
    if (!Object.hasOwn(prices, size)) return;
    document.getElementById('selected-size').textContent = title(size) + ' subscription';
    document.getElementById('selected-price').textContent = '$' + prices[size] + '/month';

    let checkout;
    try {
      const url = new URL((window.JUMPSHOT_CHECKOUT || {})[size]);
      if (url.protocol === 'https:' && !url.username && !url.password) checkout = url.href;
    } catch (_) {
      // Missing or invalid links always fall back to the shop phone.
    }

    document.getElementById('signup-button').href = checkout || 'tel:+19033523443';
    document.getElementById('signup-label').textContent = checkout ? 'Continue with ' + title(size) : 'Call to sign up';
    document.getElementById('next-step-title').textContent = checkout ? 'Continue to checkout' : 'Sign up by phone';
    document.getElementById('signup-intro').textContent = checkout
      ? 'Choose your size, then review the details at checkout.'
      : 'Choose a size, then call our team to sign up.';
    document.getElementById('signup-help').textContent = checkout
      ? 'Review included drinks, redemption limits, renewal and cancellation terms, and any taxes at checkout. Add-ons cost extra.'
      : 'Call our team to confirm included drinks, redemption limits, and renewal and cancellation terms before signing up.';
  }

  function syncSelection() {
    const selected = document.querySelector('input[name="plan"]:checked');
    if (selected) update(selected.value);
  }

  document.querySelectorAll('input[name="plan"]').forEach(input => {
    input.addEventListener('change', syncSelection);
  });
  // Browsers can restore a radio selection when returning from checkout.
  window.addEventListener('pageshow', syncSelection);
  syncSelection();
})();
