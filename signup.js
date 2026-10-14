(function () {
  'use strict';
  const prices = { small: 100, medium: 125, large: 150 };
  const title = size => size.charAt(0).toUpperCase() + size.slice(1);
  function update(size) {
    if (!Object.hasOwn(prices, size)) return;
    document.getElementById('selected-size').textContent = title(size) + ' subscription';
    document.getElementById('selected-price').textContent = '$' + prices[size] + '/month';
    const button = document.getElementById('signup-button');
    const help = document.getElementById('signup-help');
    let checkout;
    try {
      const url = new URL((window.JUMPSHOT_CHECKOUT || {})[size]);
      if (url.protocol === 'https:') checkout = url.href;
    } catch (_) { /* Unconfigured checkout falls back to the shop phone. */ }
    button.href = checkout || 'tel:+19033523443';
    button.replaceChildren(document.createTextNode(checkout ? 'Sign up for ' + title(size) + ' ' : 'Call to sign up '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; button.appendChild(arrow);
    help.textContent = checkout ? 'Review the included drinks, redemption limits, and subscription terms at checkout. Add-ons cost extra.' : 'Ask our team about included drinks, redemption limits, and subscription terms.';
  }
  document.querySelectorAll('input[name="plan"]').forEach(input => input.addEventListener('change', () => update(input.value)));
  update(document.querySelector('input[name="plan"]:checked').value);
})();
