const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'signup.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function page(config, selected = 'large') {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const nodes = Object.fromEntries(ids.map(id => [id, { textContent: '', href: '' }]));
  const inputs = ['small', 'medium', 'large'].map(value => ({
    value, checked: value === selected, events: {},
    addEventListener(name, handler) { this.events[name] = handler; }
  }));
  const window = { JUMPSHOT_CHECKOUT: config, events: {}, addEventListener(name, handler) { this.events[name] = handler; } };
  const document = {
    getElementById(id) { assert.ok(nodes[id], `Element #${id} must exist in index.html`); return nodes[id]; },
    querySelectorAll(selector) { assert.equal(selector, 'input[name="plan"]'); return inputs; },
    querySelector(selector) { assert.equal(selector, 'input[name="plan"]:checked'); return inputs.find(input => input.checked) || null; }
  };
  vm.runInNewContext(source, { window, document, URL });
  return {
    nodes, window, inputs,
    select(value, fireChange = true) {
      inputs.forEach(input => { input.checked = input.value === value; });
      if (fireChange) inputs.find(input => input.checked)?.events.change();
    }
  };
}

test('all approved sizes preserve their monthly prices and phone fallback', () => {
  const app = page({});
  for (const [size, price] of [['small', 100], ['medium', 125], ['large', 150], ['small', 100]]) {
    app.select(size);
    assert.equal(app.nodes['selected-size'].textContent, size[0].toUpperCase() + size.slice(1) + ' subscription');
    assert.equal(app.nodes['selected-price'].textContent, `$${price}/month`);
    assert.equal(app.nodes['signup-button'].href, 'tel:+19033523443');
    assert.equal(app.nodes['next-step-title'].textContent, 'Sign up by phone');
    assert.equal(app.nodes['signup-label'].textContent, 'Call to sign up');
  }
});

test('default selection remains large', () => {
  const app = page({});
  assert.equal(app.nodes['selected-size'].textContent, 'Large subscription');
  assert.equal(app.nodes['selected-price'].textContent, '$150/month');
  assert.match(html, /value="large" checked/);
});

test('valid configured plan goes to checkout; other sizes stay on the phone path', () => {
  const url = 'https://checkout.example.test/approved-small?plan=small';
  const app = page({ small: url });
  app.select('small');
  assert.equal(app.nodes['signup-button'].href, url);
  assert.equal(app.nodes['signup-label'].textContent, 'Continue with Small');
  assert.equal(app.nodes['next-step-title'].textContent, 'Continue to checkout');
  assert.match(app.nodes['signup-help'].textContent, /cancellation terms/);
  app.select('medium');
  assert.equal(app.nodes['signup-button'].href, 'tel:+19033523443');
  assert.equal(app.nodes['next-step-title'].textContent, 'Sign up by phone');
});

test('invalid or credential-bearing checkout links always fall back to phone', () => {
  for (const url of ['', 'not a url', 'http://example.test', 'javascript:alert(1)', '//example.test', 'https://user:pass@example.test', 'https://user@example.test', null, undefined]) {
    const app = page({ small: url }, 'small');
    assert.equal(app.nodes['signup-button'].href, 'tel:+19033523443', String(url));
  }
});

test('missing checkout config does not break selection', () => {
  const app = page(undefined, 'medium');
  assert.equal(app.nodes['selected-price'].textContent, '$125/month');
  assert.equal(app.nodes['signup-button'].href, 'tel:+19033523443');
});

test('restored browser selection is synced on pageshow', () => {
  const app = page({ small: 'https://checkout.example.test/small' });
  app.select('small', false);
  app.window.events.pageshow();
  assert.equal(app.nodes['selected-size'].textContent, 'Small subscription');
  assert.equal(app.nodes['signup-button'].href, 'https://checkout.example.test/small');
});

test('missing or unknown radio selection is ignored without crashing', () => {
  const app = page({}, null);
  app.window.events.pageshow();
  app.inputs[0].value = 'unexpected';
  app.select('unexpected');
  assert.equal(app.nodes['selected-price'].textContent, '');
});

test('static fallback has correct prices, contact links, and accessible controls', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  assert.equal((html.match(/type="radio" name="plan"/g) || []).length, 3);
  for (const [size, price] of [['small', 100], ['medium', 125], ['large', 150]]) {
    assert.match(html, new RegExp(`value="${size}"[^]*?<span class="price">\\$${price}<small>/ month</small>`));
  }
  assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(html, /id="signup-button"[^>]+href="tel:\+19033523443"/);
  assert.match(html, /734\+S\+Fleishel\+Ave\+Tyler\+TX\+75701/);
  assert.match(html, /Make it <em>a Jumpshot\.<\/em>/);
  assert.doesNotMatch(html, /<form\b/);
  assert.doesNotMatch(source, /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage/);
});

test('production config remains unconfigured and no payment links were added', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'config.js'), 'utf8'), context);
  assert.equal(JSON.stringify(context.window.JUMPSHOT_CHECKOUT), JSON.stringify({ small: '', medium: '', large: '' }));
});
