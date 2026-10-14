# Jumpshot Coffee signup flyer

Compact, mobile-friendly subscription signup page inspired by the selection-to-signup layout of `burchdad/whs-signups`. This is a focused adaptation, not a copy of the WHS volunteer application or its customer data.

## Current behavior

- Small $100/month, medium $125/month, large $150/month.
- Selecting a size updates the subscription summary.
- Add-ons and extras cost additional.
- Signup currently calls Jumpshot at (903) 352-3443.
- Address links to directions for 734 S Fleishel Ave, Tyler, TX 75701.
- No contact information is collected, stored, or sent by this page.

## Activate online signup

Set the three approved hosted subscription checkout URLs in `config.js`. The selected plan will then link directly to its checkout. Only HTTPS URLs are accepted. Customers enter contact and payment information with the checkout provider.

Before activating, configure the correct monthly recurring prices with Jumpshot's payment provider and include the approved drink allowance, redemption rules, renewal/cancellation terms, and any taxes at checkout. No live subscriptions or products have been created by this repository.

No speculative savings or Starbucks prices are published. A savings comparison needs the actual drink price and confirmed allowance.

## Hosting

Serve this repository as a static site. No build or dependencies are required. For Vercel, import this repository with the Other framework preset, no build command, and the project root as output. No deployment has been performed as part of this initial source setup.

For local viewing: `python -m http.server 8080` from this directory.

The supplied logo is preserved within `brand.svg` as an embedded PNG. No WHS credentials, database connection, volunteer information, or payment settings are included.

## Review and verification

The page now separates choosing a size from the phone signup step. Choosing a radio option does not enroll a customer. Existing prices, the supplied logo, phone/address, and unconfigured checkout links are preserved. Phone signup stays available without JavaScript. When approved checkout URLs are configured, the heading, button, and supporting copy switch together for the selected plan. Returning from checkout resynchronizes any browser-restored selection.

Run the dependency-free checks with Node.js 18 or newer:

```
node --check signup.js
node --test tests/*.test.cjs
```

These checks cover prices, repeated selection, mixed configured/unconfigured plans, invalid URL fallback, browser-restored selection, and static fallback markup. They do not submit a signup, prove payment completion, or replace visual browser checks.

For UI review, check 320px, 375px, and 390px mobile widths, a desktop width, keyboard selection and focus, 200% zoom, and the call/directions destinations. Do not place test calls, create subscriptions, or submit payment information as part of layout testing.
