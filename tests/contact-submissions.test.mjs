import assert from "node:assert/strict";
import { test } from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const types = loadModule("src/lib/http/types.ts");
const loadSubmission = (crypto) =>
  loadModule(
    "src/lib/http/contact-submission.ts",
    { crypto },
    { "./types": types },
  );
const request = () => ({
  name: "Synthetic visitor",
  email: "visitor@example.test",
  subject: "Synthetic question",
  message: "Please help with this synthetic question.",
  type: types.InquiryType.SUPPORT,
  locale: "en",
});

test("bounded attribution excludes selectors, query paths and invalid cookie values", () => {
  const helper = loadSubmission({});
  const source = helper.buildContactSource(
    "CONTACT",
    {
      utmSource: "x".repeat(100),
      utmCampaign: "c".repeat(200),
      utmMedium: { invalid: true },
      landingPage: "/features?secret=fixture",
      referrer: "https://remote.example/?secret=fixture",
      firstTouchAt: "not-a-date",
      tenantId: "claimed-tenant",
      authToken: "synthetic-not-a-credential",
    },
    "/contact",
  );
  assert.equal(source.formId, "CONTACT");
  assert.equal(source.submissionPath, "/contact");
  assert.equal(source.firstTouch.utmSource.length, 64);
  assert.equal(source.firstTouch.utmCampaign.length, 128);
  assert.equal(source.firstTouch.utmMedium, undefined);
  assert.equal(source.firstTouch.landingPage, undefined);
  assert.equal(source.firstTouch.referrer, undefined);
  assert.equal(source.firstTouch.firstTouchAt, undefined);
  assert.equal(JSON.stringify(source).includes("tenantId"), false);
  assert.equal(JSON.stringify(source).includes("authToken"), false);
});

test("a retry intent snapshots source and fields rather than reading later mutations", () => {
  let generations = 0;
  const helper = loadSubmission({
    randomUUID() {
      generations += 1;
      return "11111111-1111-4111-8111-111111111111";
    },
  });
  const payload = {
    ...request(),
    source: {
      formId: "CONTACT",
      submissionPath: "/contact",
      firstTouch: { utmSource: "first" },
    },
  };
  const intent = helper.createContactIntent(payload);
  payload.subject = "Later draft";
  payload.source.firstTouch.utmSource = "later";
  assert.equal(intent.key, "11111111-1111-4111-8111-111111111111");
  assert.equal(intent.request.subject, "Synthetic question");
  assert.equal(intent.request.source.firstTouch.utmSource, "first");
  assert.equal(generations, 1);
  assert.equal(
    helper.hasSameContactDetails(intent.request, {
      ...request(),
      locale: "ar",
      source: { formId: "DEMO" },
    }),
    true,
  );
  assert.equal(
    helper.hasSameContactDetails(intent.request, {
      ...request(),
      message: "Edited message",
    }),
    false,
  );
});

test("secure randomness fallback emits a valid v4 key and missing crypto fails before admission", () => {
  const helper = loadSubmission({
    getRandomValues(bytes) {
      bytes.fill(17);
      return bytes;
    },
  });
  const intent = helper.createContactIntent(request());
  assert.match(
    intent.key,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.equal(loadSubmission(undefined).createContactIntent(request()), null);
  assert.equal(
    loadSubmission({
      randomUUID() {
        throw new Error("Synthetic crypto failure");
      },
    }).createContactIntent(request()),
    null,
  );
});

test("contact HTTP service sends the stable key/source and omits auth cookies", async () => {
  const calls = [];
  const client = loadModule(
    "src/lib/http/client.ts",
    {
      fetch: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          status: 201,
          json: async () => ({
            success: true,
            data: { id: "22222222-2222-4222-8222-222222222222" },
          }),
        };
      },
    },
    {
      "@/config/env": { env: { api: { url: "http://127.0.0.1:9/v1" } } },
      "./types": types,
      "./retry-after": loadModule("src/lib/http/retry-after.ts"),
    },
  );
  const service = loadModule(
    "src/lib/http/services/contact.service.ts",
    {},
    { "../client": client },
  );
  const payload = {
    ...request(),
    source: { formId: "CONTACT", submissionPath: "/ar/contact" },
  };
  const response = await service.contactService.submit(
    payload,
    { locale: "ar" },
    "33333333-3333-4333-8333-333333333333",
  );
  assert.equal(response.id, "22222222-2222-4222-8222-222222222222");
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].options.headers["Idempotency-Key"],
    "33333333-3333-4333-8333-333333333333",
  );
  assert.equal(calls[0].options.headers["Accept-Language"], "ar");
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(
    JSON.parse(calls[0].options.body).source.submissionPath,
    "/ar/contact",
  );
});

test("only actual UUID references confirm the receipt view", () => {
  const helper = loadSubmission({});
  assert.equal(
    helper.isContactReference("44444444-4444-4444-8444-444444444444"),
    true,
  );
  assert.equal(helper.isContactReference(""), false);
  assert.equal(helper.isContactReference("accepted-without-reference"), false);
});

test("Unicode hint bounds preserve complete characters and drop JSON-incompatible values", () => {
  const helper = loadSubmission({});
  const source = helper.buildContactSource(
    "CONTACT",
    {
      utmCampaign: "x".repeat(127) + "😀",
      utmSource: "bad\ud800",
      landingPage: "/bad\u0000path",
      ref: "bad\u0000value",
    },
    "/contact",
  );
  assert.equal(source.firstTouch.utmCampaign, "x".repeat(127) + "😀");
  assert.equal(Array.from(source.firstTouch.utmCampaign).length, 128);
  assert.equal(source.firstTouch.utmSource, undefined);
  assert.equal(source.firstTouch.landingPage, undefined);
  assert.equal(source.firstTouch.ref, undefined);
});

test("malformed cookie decoding cannot become an acceptance dependency", () => {
  const attribution = loadModule(
    "src/lib/analytics/attribution.ts",
    {},
    {
      "@/lib/utils/cross-app-sync": {
        getSharedCookie() {
          throw new URIError("Synthetic malformed percent encoding");
        },
      },
      "./config": { GA_CONFIG: { isEnabled: false } },
    },
  );
  assert.equal(attribution.getAttribution(), null);
});

test("stalled requests time out and the saved key remains retryable", async () => {
  const seen = [];
  const retry = loadModule("src/lib/http/retry-after.ts");
  const client = loadModule(
    "src/lib/http/client.ts",
    {
      fetch: (_url, options) => {
        seen.push(options.headers["Idempotency-Key"]);
        if (seen.length === 1) {
          return new Promise((_, reject) => {
            options.signal.addEventListener(
              "abort",
              () => {
                const error = new Error("Synthetic deadline");
                error.name = "AbortError";
                reject(error);
              },
              { once: true },
            );
          });
        }
        return Promise.resolve({
          ok: true,
          status: 201,
          json: async () => ({
            success: true,
            data: { id: "22222222-2222-4222-8222-222222222222" },
          }),
        });
      },
    },
    {
      "@/config/env": { env: { api: { url: "http://127.0.0.1:9/v1" } } },
      "./types": types,
      "./retry-after": retry,
    },
  );
  const service = loadModule(
    "src/lib/http/services/contact.service.ts",
    {},
    { "../client": client },
  );
  const key = "33333333-3333-4333-8333-333333333333";
  await assert.rejects(
    service.contactService.submit(request(), { timeoutMs: 1 }, key),
    (error) => error.statusCode === 408,
  );
  const response = await service.contactService.submit(request(), {}, key);
  assert.equal(response.id, "22222222-2222-4222-8222-222222222222");
  assert.deepEqual(seen, [key, key]);
});

test("429 responses expose a bounded Retry-After interval without losing the request key", async () => {
  const retry = loadModule("src/lib/http/retry-after.ts");
  assert.equal(retry.parseRetryAfter("20", 0), 20000);
  assert.equal(retry.parseRetryAfter("9999999", 0), 300000);
  assert.equal(retry.parseRetryAfter("invalid", 0), undefined);
  let headers;
  const client = loadModule(
    "src/lib/http/client.ts",
    {
      fetch: async (_url, options) => {
        headers = options.headers;
        return {
          ok: false,
          status: 429,
          headers: { get: () => "20" },
          json: async () => ({
            success: false,
            error: { code: "throttled", message: "Synthetic rate limit" },
          }),
        };
      },
    },
    {
      "@/config/env": { env: { api: { url: "http://127.0.0.1:9/v1" } } },
      "./types": types,
      "./retry-after": retry,
    },
  );
  const service = loadModule(
    "src/lib/http/services/contact.service.ts",
    {},
    { "../client": client },
  );
  await assert.rejects(
    service.contactService.submit(
      request(),
      {},
      "33333333-3333-4333-8333-333333333333",
    ),
    (error) => {
      assert.equal(error.statusCode, 429);
      assert.equal(error.retryAfterMs, 20000);
      assert.equal(
        headers["Idempotency-Key"],
        "33333333-3333-4333-8333-333333333333",
      );
      return true;
    },
  );
});
