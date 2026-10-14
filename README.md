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
