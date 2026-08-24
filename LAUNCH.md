# Fortitudo Studios Drama — Launch Guide

**Positioning:** online-only, live on Microsoft Teams, nationwide.
Everything in this folder replaces the current contents of
`github.com/Beastslayer2600/fortitudostudios-Drama`.

---

## The four steps to being live

Roughly an hour of work, most of it waiting for DNS.

### Step 1 — Push to GitHub

From the folder containing these files:

```bash
git add -A
git commit -m "Online-only relaunch: Teams coaching, pricing, How It Works, checklist"
git push origin main
```

Vercel auto-deploys from `main`. The build takes about 30 seconds.

### Step 2 — Make the site publicly visible  ⚠️ THIS IS THE ACTUAL LAUNCH

**Right now the site is invisible to the public.** Vercel Authentication is
enabled on the project with scope `all_except_custom_domains`, so anyone
visiting `fortitudostudios-drama.vercel.app` is asked to log into Vercel.
A parent would see a login wall, not your site.

Custom domains are exempt from that wall — so completing Step 3 fixes this
automatically. If you would also like the raw `.vercel.app` URL to work
publicly, go to Vercel → project → Settings → Deployment Protection → Vercel
Authentication → **Disabled**.

### Step 3 — Point the subdomain at it

You already own `fortitudostudios.site` and already run `studio.` as a
subdomain on the multipage project, so this is the same pattern.

1. Vercel → **fortitudostudios-drama** → Settings → **Domains**
2. Add `drama.fortitudostudios.site`
3. At your registrar's DNS, add the record Vercel shows you:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `drama` | `cname.vercel-dns.com` |

4. SSL is issued automatically once DNS propagates — usually minutes.

Every canonical URL, the sitemap, robots.txt and all the social preview tags
already point at `drama.fortitudostudios.site`.

### Step 4 — Give the enquiry form its own inbox

The form currently reuses the **exact EmailJS service and template from your
financial-advisory site** (`service_j5nb1ym` / `template_5lecm3j`). It works
immediately, but drama enquiries will land mixed in with your Liberty leads.

1. [EmailJS dashboard](https://dashboard.emailjs.com) → Email Templates → New
2. Duplicate the existing one, retitle it "Fortitudo Studios Drama enquiry"
3. Variables used: `{{name}}`, `{{email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`
4. Deliver to `gertjiefourie@icloud.com`
5. **Add a second template** for checklist requests that replies automatically
   with the PDF link:
   `https://drama.fortitudostudios.site/assets/Eisteddfod-Preparation-Checklist.pdf`
6. Copy the new template ID into `script.js`:

```js
const EMAILJS = {
  PUBLIC_KEY: "N7BQYsyCGc0luSO4R",
  SERVICE_ID: "service_j5nb1ym",
  TEMPLATE_ID: "template_5lecm3j"   // ← replace with the drama template ID
};
```

These are EmailJS *public* keys and are safe in client-side code — that is how
EmailJS is designed to work.

> **The checklist still works if you skip this.** On successful submission the
> form now reveals a "Download it now" button, and `guides.html` carries a
> direct download link. Nobody is left waiting on an email that may not arrive.

---

## Test before you advertise

- [ ] Open the site on your own phone. Tap the hamburger. All six links work.
- [ ] Submit the contact form with your own address. Confirm it arrives.
- [ ] Submit the checklist form. Confirm the "Download it now" button appears.
- [ ] Open the PDF and check it prints cleanly on A4.
- [ ] Tap the green WhatsApp button — should open a chat to 072 243 6950, pre-filled.
- [ ] Ask someone **not logged into Vercel** to open the site. A login screen means Step 2 or 3 is incomplete.
- [ ] Paste the URL into WhatsApp and check the preview card renders.
- [ ] Do a dry-run Teams session with a friend's child. Check your camera framing, lighting and audio before a paying parent sees it.

---

## What changed in this version

| Area | Before | Now |
|---|---|---|
| Positioning | Gauteng in-person + online | **Online only**, live on Microsoft Teams, nationwide |
| Services | Six (incl. in-person, schools on-site, workshops) | **Three**: private R420/hr, small groups R590/month, speech packages R1,350 |
| Vetting claim | "Fully vetted & insured" — **not true yet** | Replaced with accurate claims: adjudicator, since age eight, online nationwide, English & Afrikaans |
| Objection handling | None | New **How It Works** page: setup, the hour minute-by-minute, what online can and cannot do |
| Schools page | In main nav, promised on-site delivery | Out of nav but still live and indexed; rewritten as online support with vetting stated as *in progress* |
| Lead magnet | Form with nothing to send | **3-page Eisteddfod Preparation Checklist PDF**, instant download on submit |
| Mobile nav | Broken — `display:none` under 900px | Working hamburger menu |
| Contact form | `mailto:` to a non-existent address | EmailJS, validated, honeypot, graceful failure |

**Pages:** Home · Coaching & Fees · Speaking & Debate · How It Works · Guides ·
Contact · Schools (unlisted) · Integrity · Privacy · 404

---

## Pricing as published

| Service | Price | Notes |
|---|---|---|
| Private coaching | **R420/hour** | Online, recorded, written notes after each session |
| Block of six | **R2,400** | Saves R120; use within four months |
| Small group class | **R590/month** | Weekly 45 min, max 6 learners, billed Feb–Nov |
| Speech & debate package | **R1,350** | Two live sessions plus written draft feedback |

Still benchmarked estimates, not verified market rates. Three competitor
quotes will confirm or correct them — worth doing in the first fortnight.

---

## Two things the site now says that you must make true

1. **"Applications in progress"** for police clearance, NRSO and NCPR appears
   on the Schools page. Get those applications in this week so the statement
   stays honest.
2. **Recording every session.** The privacy notice and How It Works page both
   promise recordings are shared privately, stored with two-factor
   authentication, and deleted at term end. Set that folder structure up before
   your first paying session.

---

## Once you are live

1. **Google Search Console** — add `drama.fortitudostudios.site`, submit `sitemap.xml`.
2. **Your adjudication network first.** Personal messages to teachers and convenors you actually know. Free, and it converts far better than advertising. Online delivery means every contact in every province is now reachable, which is exactly the advantage this positioning buys you.
3. **Post the checklist, not the sales pitch.** In eisteddfod parent groups, a genuinely useful free PDF from an adjudicator will travel further than any advert. The coaching offer is on page three where it belongs.
4. Paid advertising last, and only once the site is converting.

---

## File map

```
index.html            Home — online-first, three services, the "can you teach drama on a screen" answer
classes.html          Coaching & Fees — three services, terms, block pricing, FAQ
speaking.html         Speaking & debate — the "coach, don't ghost-write" position
how-it-works.html     Setup, the hour minute-by-minute, what you get afterwards, practicalities
guides.html           Six free guides + direct checklist download
contact.html          EmailJS enquiry form, WhatsApp, phone
schools.html          Online school support (unlisted in nav, still indexed)
integrity.html        Published adjudication & conflict-of-interest policy
privacy.html          POPIA notice, incl. session recordings and children's information
404.html              Not-found page
assets/Eisteddfod-Preparation-Checklist.pdf   The lead magnet
styles.css            Original styles + ~700 lines of new components
script.js             Mobile nav, sticky header, EmailJS, checklist download reveal
vercel.json           Security headers, clean URLs, asset caching
sitemap.xml           All 9 public pages
```

---

## One judgement call worth revisiting

`integrity.html` publishes your conflict-of-interest policy in full, including
the commitment that you will not adjudicate any section a student of yours
competes in. It is linked from every footer and from two FAQs.

This is deliberate. No competitor can publish that page, because no competitor
has the credential that makes it necessary. But it does commit you publicly.
Read it once more before you push, and make sure every line is one you will
actually hold to.
