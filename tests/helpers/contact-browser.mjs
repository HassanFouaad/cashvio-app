import assert from "node:assert/strict";
import { chromium } from "playwright";

const CONTACT_FIXTURE_URL = "http://127.0.0.1:9/v1/public/contact";

export async function runContactBrowser({
  marketingOrigin,
  locale,
  width,
  rateLimited,
  forward,
}) {
  const browser = await chromium.launch({ headless: true });
  const requests = [];
  const browserErrors = [];
  const subject = `Browser contact ${locale}-${width}${rateLimited ? " cooldown" : ""}`;
  let acceptedId;

  try {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: "block",
    });
    await context.route("**/*", async (route) => {
      const { origin } = new URL(route.request().url());
      if (origin === marketingOrigin) await route.continue();
      else await route.abort();
    });
    const page = await context.newPage();
    if (rateLimited) await page.clock.install();
    page.on("pageerror", (error) => browserErrors.push(error.message));
    await page.routeWebSocket("**/*", (socket) => socket.close());

    await page.route(CONTACT_FIXTURE_URL, async (route) => {
      const request = route.request();
      const method = request.method();
      const headers = request.headers();
      const body = request.postData();
      if (method === "OPTIONS") {
        await route.fulfill(await forward({ method, headers, body }));
        return;
      }
      assert.equal(method, "POST");
      assert.ok(headers["idempotency-key"]);
      assert.equal(headers.cookie, undefined);
      requests.push({ key: headers["idempotency-key"], body });

      if (rateLimited && requests.length === 1) {
        await route.fulfill({
          status: 429,
          headers: {
            "Retry-After": "7",
            "Access-Control-Allow-Origin": marketingOrigin,
            "Access-Control-Expose-Headers": "Retry-After",
          },
          // A gateway can return a non-JSON error body.
          body: "Synthetic rate limit",
        });
        return;
      }

      const response = await forward({ method, headers, body });
      assert.equal(response.status, 201);
      const { data } = JSON.parse(response.body);
      assert.ok(data?.id);
      if (acceptedId) assert.equal(data.id, acceptedId);
      acceptedId = data.id;
      if (requests.length === 1) {
        if (locale === "ar") {
          // A gateway may lose the original acceptance and still return an
          // opaque 400. The saved key must survive it and the translated
          // request feedback.
          await route.fulfill({ status: 400, body: "Bad gateway" });
        } else {
          await route.abort("failed");
        }
      } else {
        await route.fulfill(response);
      }
    });

    await page.goto(
      `${marketingOrigin}${locale === "ar" ? "/ar/contact" : "/contact"}`,
      { waitUntil: "load" },
    );
    const form = page.locator("form:has(#subject)");
    const submit = form.locator('button[type="submit"]');
    await form.locator("#name").fill("Synthetic browser visitor");
    await form.locator("#email").fill("browser@example.test");
    await form.locator("#subject").fill(subject);
    await form
      .locator("#message")
      .fill("Please help with this synthetic browser contact question.");
    await context.addCookies([
      { name: "cv_attribution", value: "%", url: marketingOrigin },
    ]);
    await submit.evaluate((button) => {
      button.click();
      button.click();
    });

    const retry = form.getByRole("button", {
      name:
        locale === "ar" ? "إعادة محاولة الطلب المحفوظ" : "Retry saved request",
      exact: true,
    });
    await retry.waitFor();
    if (locale === "ar") {
      await form.getByText(/راجع بيانات التواصل وأعد المحاولة/).waitFor();
    }
    assert.equal(requests.length, 1);
    if (rateLimited) {
      assert.equal(await retry.isDisabled(), true);
      assert.equal(await submit.isDisabled(), true);
      await page.clock.fastForward(6000);
      assert.equal(await retry.isDisabled(), true);
      await page.clock.fastForward(2000);
    } else {
      await form
        .locator("#subject")
        .fill("Edited draft after uncertain receipt");
      await submit.click();
      await form
        .getByText(
          locale === "ar"
            ? /قد يكون الطلب السابق/
            : /previous request may already/,
        )
        .waitFor();
      assert.equal(requests.length, 1);
    }

    const acceptance = page.waitForResponse(
      (response) =>
        response.url() === CONTACT_FIXTURE_URL && response.status() === 201,
    );
    await retry.click({ timeout: 3000 });
    await acceptance;
    assert.ok(acceptedId);
    await page.getByRole("status").filter({ hasText: acceptedId }).waitFor();
    assert.equal(requests.length, 2);
    assert.deepEqual(requests[1], requests[0]);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    assert.deepEqual(browserErrors, []);
    return { acceptedId, subject };
  } finally {
    await browser.close();
  }
}
