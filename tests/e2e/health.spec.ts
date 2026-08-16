import { expect, test } from "@playwright/test";

test("health endpoint responds with the public envelope", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  expect(body.ok).toBe(true);
  expect(typeof body.data.status).toBe("string");
  expect(typeof body.data.database).toBe("string");
  expect(typeof body.data.version).toBe("string");
});

test("public pages send the baseline browser security policy", async ({ request }) => {
  const response = await request.get("/");

  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers()["content-security-policy"]).toContain(
    "object-src 'none'",
  );
  const scriptPolicy = response.headers()["content-security-policy"]
    .split(";")
    .find((directive) => directive.trim().startsWith("script-src "));
  expect(scriptPolicy).toContain("'nonce-");
  expect(scriptPolicy).not.toContain("'unsafe-inline'");
});

test("preloader stays on the landing entry and route transitions release promptly", async ({ page }) => {
  await page.goto("/scan");
  await expect(page.locator("[data-site-preloader]")).toHaveCount(0);

  await page.goto("/");
  await expect(page.locator("[data-site-preloader]")).toBeVisible();
  await expect(page.locator("[data-site-preloader]")).toHaveCount(0, { timeout: 4_000 });

  const overlay = page.locator("[data-transition-overlay]");
  await page.evaluate(() => {
    const tracedWindow = window as Window & { __transitionTrace?: string[] };
    const target = document.querySelector<HTMLElement>("[data-transition-overlay]");
    tracedWindow.__transitionTrace = [];
    if (!target) return;
    const record = () => {
      const state = target.dataset.transitionState;
      const layer = target.querySelector<HTMLElement>(".transition-layer:last-child");
      const bounds = layer?.getBoundingClientRect();
      const coversViewport = Boolean(
        bounds &&
        Math.abs(bounds.left) < 1 &&
        Math.abs(bounds.top) < 1 &&
        Math.abs(bounds.right - window.innerWidth) < 1 &&
        Math.abs(bounds.bottom - window.innerHeight) < 1,
      );
      tracedWindow.__transitionTrace?.push(
        `${state}:${window.location.pathname}:${coversViewport}`,
      );
    };
    record();
    new MutationObserver(record).observe(target, {
      attributes: true,
      attributeFilter: ["data-transition-state"],
    });
  });
  const transitionLink = page.getByRole("link", { name: /^Periksa/ }).first();
  const transitionStartedAt = Date.now();
  await transitionLink.click();
  await expect(overlay).toHaveAttribute("data-transition-state", "covering");
  await page.waitForTimeout(120);
  expect(new URL(page.url()).pathname).toBe("/");
  await page.waitForURL(/\/scan$/, { timeout: 1_500 });
  expect(Date.now() - transitionStartedAt).toBeLessThan(1_500);
  await expect(overlay).toHaveAttribute("data-transition-state", "idle");
  const trace = await page.evaluate(() => (
    (window as Window & { __transitionTrace?: string[] }).__transitionTrace ?? []
  ));
  expect(trace).toContain("covered:/:true");
  expect(trace).toContain("revealing:/scan:true");
  await expect(page.getByRole("tab", { name: "Pesan" })).toBeVisible();
});

test("core product pages render and connect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Pesan mencurigakan/i }))
    .toBeVisible();
  await page.getByRole("link", { name: /^Periksa/ }).first().click();
  await expect(page).toHaveURL(/\/scan$/);
  await expect(page.getByRole("tab", { name: "Pesan" })).toBeVisible();

  await page.goto("/simulator");
  await expect(page.getByRole("heading", { name: /Latih refleks amanmu/i }))
    .toBeVisible();
  await expect(
    page.getByRole("button", { name: "Keluarga, nomor baru, dan suara mirip" }),
  ).toBeVisible();

  await page.goto("/respond");
  await expect(page.getByRole("heading", { name: /Sudah terlanjur/i }))
    .toBeVisible();
  await page.getByRole("button", { name: /Uang sudah terkirim/i }).click();
  await expect(
    page.getByRole("heading", { name: /Hubungi bank atau e-wallet sekarang/i }),
  ).toBeVisible();

  await page.goto("/scan/conversation");
  await expect(page.getByRole("heading", { name: /Baca urutannya/i }))
    .toBeVisible();
  await expect(page.getByRole("button", { name: /Analisis percakapan/i }))
    .toBeVisible();

  await page.goto("/benchmark");
  await expect(page.getByRole("heading", { name: /Lihat kemampuan dan batas AmanKlik/i }))
    .toBeVisible();
});

test("landing stays readable with reduced motion and on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Pesan mencurigakan/i }))
    .toBeVisible();
  await expect(page.getByRole("heading", { name: /Satu pesan/i }))
    .toBeVisible();
  await expect(page.getByRole("heading", { name: /Nama merek bisa ditempel/i }))
    .toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Tidak hanya mengandalkan tebakan AI/i }),
  ).toBeVisible();

  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(width.scroll).toBe(width.client);
  const menuButton = page.locator(
    'button[aria-controls="mobile-navigation-overlay"]',
  );
  await expect(menuButton).toHaveAccessibleName("Buka Menu");
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(menuButton).toHaveAccessibleName("Tutup Menu");
  const mobileOverlay = page.getByRole("dialog", { name: "Menu navigasi" });
  await expect(mobileOverlay).toBeVisible();
  const mobileNavigation = page.getByRole("navigation", {
    name: "Navigasi seluler",
  });
  await expect(mobileNavigation).toBeVisible();
  await expect(
    mobileNavigation.getByRole("link", { name: "Bandingkan", exact: true }),
  ).toBeVisible();
  await expect(
    mobileNavigation.getByRole("link", { name: "Pelajari", exact: true }),
  ).toBeVisible();
  await expect(
    mobileNavigation.getByRole("link", { name: "Riwayat", exact: true }),
  ).toBeVisible();
  const firstMobileLink = mobileNavigation.getByRole("link", {
    name: "Periksa",
    exact: true,
  });
  await expect(firstMobileLink).toBeFocused();
  await expect(page.locator('[inert][aria-hidden="true"]').first())
    .toBeAttached();
  await page.keyboard.press("Shift+Tab");
  await expect(menuButton).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    mobileOverlay.getByRole("link", { name: /Mulai Periksa/i }),
  ).toBeFocused();
  await expect.poll(() =>
    page.evaluate(() => {
      const overlay = document.querySelector<HTMLElement>(
        "#mobile-navigation-overlay",
      );
      if (!overlay) return false;
      const bounds = overlay.getBoundingClientRect();
      return bounds.top === 0 && bounds.left === 0 &&
        Math.abs(bounds.width - window.innerWidth) < 1 &&
        bounds.height >= window.innerHeight;
    })
  ).toBe(true);
  await expect.poll(() =>
    page.evaluate(() => getComputedStyle(document.documentElement).overflow)
  ).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(mobileOverlay).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test("animated mobile navigation covers the viewport without leaking into the page", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/");

  const menuButton = page.locator(
    'button[aria-controls="mobile-navigation-overlay"]',
  );
  const mobileOverlay = page.getByRole("dialog", { name: "Menu navigasi" });

  await menuButton.click();
  await expect(mobileOverlay).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigasi seluler" }).getByRole(
      "link",
      { name: "Riwayat", exact: true },
    ),
  ).toBeVisible();

  await expect.poll(() =>
    page.evaluate(() => {
      const overlay = document.querySelector<HTMLElement>(
        "#mobile-navigation-overlay",
      );
      const bottomLayer = document.elementFromPoint(
        1,
        window.innerHeight - 1,
      );
      if (!overlay || !bottomLayer) return false;

      const bounds = overlay.getBoundingClientRect();
      return bounds.top === 0 && bounds.left === 0 &&
        Math.abs(bounds.width - window.innerWidth) < 1 &&
        bounds.height >= window.innerHeight && overlay.contains(bottomLayer);
    })
  ).toBe(true);

  await page.getByRole("button", { name: "Tutup Menu" }).click();
  await expect(mobileOverlay).toBeHidden();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("landing and interior pages share one complete navigation", async ({ page }) => {
  for (const route of ["/", "/scan"]) {
    await page.goto(route);

    const primary = page.getByRole("navigation", { name: "Navigasi utama" });
    await expect(primary.getByRole("link", { name: "Periksa", exact: true }))
      .toBeVisible();
    await expect(primary.getByRole("link", { name: "Tindakan", exact: true }))
      .toBeVisible();
    await expect(primary.getByRole("link", { name: "Latihan", exact: true }))
      .toBeVisible();

    await primary.getByText("Lainnya", { exact: true }).click();
    const secondary = page.getByRole("navigation", {
      name: "Navigasi tambahan",
    });
    await expect(
      secondary.getByRole("link", { name: "Bandingkan", exact: true }),
    ).toBeVisible();
    await expect(secondary.getByRole("link", { name: "Pelajari", exact: true }))
      .toBeVisible();
    await expect(secondary.getByRole("link", { name: "Riwayat", exact: true }))
      .toBeVisible();
  }

  await expect(
    page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", {
      name: "Periksa",
      exact: true,
    }),
  )
    .toHaveAttribute("aria-current", "page");
});

test("desktop Lainnya cursor and dropdown animation stay aligned", async ({ page }) => {
  await page.goto("/scan");

  const shell = page.locator("[data-header-shell]");
  await expect(shell).toHaveAttribute("data-header-entry-state", "ready");
  const primary = page.getByRole("navigation", { name: "Navigasi utama" });
  const more = primary.getByLabel("Lainnya", { exact: true });
  await more.hover();

  await expect(more).toHaveCSS("color", "rgb(99, 91, 255)");
  await expect.poll(() =>
    page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>("[data-desktop-nav]");
      const cursor = nav?.querySelector<HTMLElement>("[data-nav-cursor]");
      const item = nav?.querySelector<HTMLElement>(
        '[data-nav-link][aria-label="Lainnya"]',
      );
      if (!cursor || !item) return false;

      const cursorBounds = cursor.getBoundingClientRect();
      const itemBounds = item.getBoundingClientRect();
      return Math.abs(cursorBounds.left - itemBounds.left) < 2 &&
        Math.abs(cursorBounds.width - itemBounds.width) < 2;
    })
  ).toBe(true);

  await page.mouse.move(20, 180);
  await expect(primary.locator("[data-nav-cursor]")).toHaveCSS("opacity", "1");
  await expect.poll(() =>
    page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>("[data-desktop-nav]");
      const cursor = nav?.querySelector<HTMLElement>("[data-nav-cursor]");
      const activeItem = nav?.querySelector<HTMLElement>(
        '[data-nav-link][data-active="true"]',
      );
      if (!cursor || !activeItem) return false;

      const cursorBounds = cursor.getBoundingClientRect();
      const itemBounds = activeItem.getBoundingClientRect();
      return Math.abs(cursorBounds.left - itemBounds.left) < 2 &&
        Math.abs(cursorBounds.width - itemBounds.width) < 2;
    })
  ).toBe(true);

  await more.hover();
  await more.click();
  const secondary = page.getByRole("navigation", {
    name: "Navigasi tambahan",
  });
  await expect(secondary).toHaveCSS("opacity", "1");

  await more.click();
  await expect(secondary).toBeHidden();
});

test("landing navbar merges with the hero at the top and becomes a pill on scroll", async ({ page }) => {
  await page.goto("/");

  const shell = page.locator("[data-header-shell]");
  await expect(shell).toHaveAttribute("data-header-mode", "top");
  await expect(page.locator("[data-desktop-nav]")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );

  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "auto" }));
  await expect.poll(() => shell.getAttribute("data-header-mode")).toBe(
    "scrolled",
  );
  await expect.poll(() =>
    page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>("[data-desktop-nav]");
      return nav
        ? getComputedStyle(nav).backgroundColor !== "rgba(0, 0, 0, 0)"
        : false;
    })
  ).toBe(true);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await expect.poll(() => shell.getAttribute("data-header-mode")).toBe("top");
});

test("primary CTA uses the fluid accent hover and magnetic exit state", async ({ page }) => {
  await page.goto("/");

  const cta = page.locator("[data-hero-cta]");
  await expect(cta.locator(".motion-button__icon")).toBeVisible();
  await cta.hover();
  await expect(cta).toHaveClass(/is-hovering/);
  await expect.poll(() =>
    page.evaluate(() => {
      const button = document.querySelector<HTMLElement>("[data-hero-cta]");
      return button ? getComputedStyle(button).backgroundColor : "";
    })
  ).toBe("rgb(17, 17, 17)");
  await expect.poll(() =>
    page.evaluate(() => {
      const button = document.querySelector<HTMLElement>("[data-hero-cta]");
      if (!button) return false;
      const buttonRadius = getComputedStyle(button).borderTopLeftRadius;
      const fluidRadius =
        getComputedStyle(button, "::before").borderTopLeftRadius;
      return buttonRadius === fluidRadius;
    })
  ).toBe(true);

  await page.mouse.move(20, 700);
  await expect(cta).toHaveClass(/is-leaving/);
  await expect.poll(() => cta.getAttribute("class") ?? "").not.toMatch(
    /is-leaving/,
  );
});

test("scanner can load every kind of synthetic fixture", async ({ page }) => {
  await page.goto("/scan");

  await page.getByRole("button", { name: /T2 · Ancaman/i }).click();
  await expect(page.getByLabel("Tempel pesan yang ingin diperiksa"))
    .toHaveValue(/kode OTP/);

  await page.getByRole("tab", { name: "Tautan" }).click();
  await page.getByRole("button", { name: /U2 · Host/i }).click();
  await expect(page.getByLabel("Tautan yang ingin diperiksa")).toHaveValue(
    "http://192.0.2.10/verify-account",
  );

  await page.getByRole("tab", { name: "Tangkapan layar" }).click();
  await page.getByRole("button", { name: /IMG_T1/i }).click();
  await expect(page.getByAltText("Pratinjau tangkapan layar yang dipilih"))
    .toBeVisible();
});

test("every product surface reflows without clipped headings or horizontal overflow", async ({ page }) => {
  const surfaces = [
    ["/scan", /Apa yang ingin kamu periksa/i],
    ["/simulator", /Latih refleks amanmu/i],
    ["/learn", /Kenali polanya sendiri/i],
    ["/history", /Pemeriksaan sebelumnya/i],
    ["/respond", /Sudah terlanjur/i],
    ["/scan/conversation", /Baca urutannya/i],
    ["/investigate", /Temukan pola yang muncul di beberapa hasil/i],
    ["/benchmark", /Lihat kemampuan dan batas AmanKlik/i],
    ["/connect", /Periksa pesan langsung dari browser/i],
    ["/privacy", /Apa yang terjadi pada data yang kamu kirim/i],
    ["/alamat-yang-tidak-ada", /Jalurnya berhenti di sini/i],
  ] as const;

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 800 : 844 });

    for (const [route, heading] of surfaces) {
      await page.goto(route);
      const title = page.getByRole("heading", { name: heading });
      await expect(title).toBeVisible();
      const layout = await page.evaluate(() => {
        const h1 = document.querySelector("h1")?.getBoundingClientRect();
        return {
          client: document.documentElement.clientWidth,
          headingLeft: h1?.left ?? -1,
          headingRight: h1?.right ?? Number.POSITIVE_INFINITY,
          scroll: document.documentElement.scrollWidth,
        };
      });
      expect(layout.scroll, `${route} overflow pada ${width}px`).toBe(
        layout.client,
      );
      expect(layout.headingLeft, `${route} h1 terpotong di kiri pada ${width}px`)
        .toBeGreaterThanOrEqual(0);
      expect(layout.headingRight, `${route} h1 terpotong di kanan pada ${width}px`)
        .toBeLessThanOrEqual(layout.client);
    }
  }
});

test("intermediate product layouts and link CTAs keep their visual states", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 870 });

  for (const route of ["/investigate", "/learn"]) {
    await page.goto(route);
    const layout = await page.evaluate(() => {
      const heading = document.querySelector("h1")?.getBoundingClientRect();
      return {
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        headingLeft: heading?.left ?? -1,
        headingRight: heading?.right ?? Number.POSITIVE_INFINITY,
      };
    });
    expect(layout.scroll).toBe(layout.client);
    expect(layout.headingLeft).toBeGreaterThanOrEqual(0);
    expect(layout.headingRight).toBeLessThanOrEqual(layout.client);
  }

  const learnSource = page.locator(".product-source-link").first();
  await learnSource.hover();
  await expect.poll(() =>
    learnSource.evaluate((element) => getComputedStyle(element).color)
  ).toBe("rgb(255, 255, 255)");

  const headerCta = page.locator("[data-header-cta]");
  await headerCta.hover();
  await expect(headerCta).toHaveClass(/is-hovering/);
  await expect.poll(() =>
    headerCta.evaluate((element) =>
      getComputedStyle(element, "::before").opacity
    )
  ).toBe("1");

  await page.goto("/history");
  const linkCta = page.locator("a.product-button").first();
  await linkCta.hover();
  await expect.poll(() =>
    linkCta.evaluate((element) =>
      getComputedStyle(element, "::before").backgroundColor
    )
  ).toBe("rgb(99, 91, 255)");
});

test("shared footer, hero surface, and Lenis stay consistent across public routes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.goto("/");
  const landingFooter = await page.locator("footer").evaluate((element) => ({
    variant: element.getAttribute("data-footer-variant"),
    links: Array.from(element.querySelectorAll("a")).map((link) => ({
      href: link.getAttribute("href"),
      text: link.textContent,
    })),
    wordmark: element.querySelector('[aria-hidden="true"]')?.textContent,
  }));
  const landingHeroSurface = await page.locator(".reference-hero").evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );

  await page.goto("/scan");
  await expect.poll(() => page.locator("footer").evaluate((element) => ({
    variant: element.getAttribute("data-footer-variant"),
    links: Array.from(element.querySelectorAll("a")).map((link) => ({
      href: link.getAttribute("href"),
      text: link.textContent,
    })),
    wordmark: element.querySelector('[aria-hidden="true"]')?.textContent,
  }))).toEqual(landingFooter);
  await expect(page.locator(".product-intro")).toHaveCSS(
    "background-color",
    landingHeroSurface,
  );

  for (const route of ["/", "/scan", "/learn"]) {
    await page.goto(route);
    await expect.poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("lenis"))
    ).toBe(true);
    await expect(page.locator("[data-scroll-progress-bar]")).toHaveCount(
      route === "/" ? 1 : 0,
    );
  }
});

test("Lenis remains disabled when a visitor requests reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/scan");

  await expect.poll(() =>
    page.evaluate(() => document.documentElement.classList.contains("lenis"))
  ).toBe(false);
});
