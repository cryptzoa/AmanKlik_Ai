import { parse as parseDomain } from "tldts";

import { ValidationError } from "@/lib/errors";
import type { RiskSignal, UrlAnalysis } from "@/types/analysis";

const SHORTENER_DOMAINS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "is.gd",
  "s.id",
]);

const SENSITIVE_SUBDOMAIN_TOKENS = new Set([
  "account",
  "bank",
  "brand",
  "claim",
  "confirm",
  "secure",
  "support",
  "verify",
  "wallet",
]);

function signal(input: Omit<RiskSignal, "source">): RiskSignal {
  return { ...input, source: "url" };
}

function safeDisplayUrl(url: URL): string {
  return `${url.protocol}//${url.hostname}${url.pathname || "/"}`;
}

function brandSlug(brand: string): string {
  return brand.toLocaleLowerCase("id-ID").replace(/[^a-z0-9]/g, "");
}

export function analyzeUrl(input: string, claimedBrand?: string | null): UrlAnalysis {
  const displayInput = input.trim();
  let parsed: URL;

  try {
    parsed = new URL(displayInput);
  } catch {
    throw new ValidationError("Format tautan belum valid.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ValidationError("AmanKlik hanya menerima tautan HTTP atau HTTPS.");
  }

  const domainParts = parseDomain(parsed.hostname);
  const hostname = parsed.hostname.toLocaleLowerCase("id-ID");
  const domain = domainParts.domain;
  const subdomain = domainParts.subdomain;
  const signals: RiskSignal[] = [];

  if (domainParts.isIp) {
    signals.push(
      signal({
        id: "url-ip-host",
        category: "ip_host",
        label: "Alamat menggunakan IP langsung",
        severity: "high",
        weight: 22,
        evidence: hostname,
        explanation: "Tautan memakai deretan angka sebagai alamat, bukan nama situs yang mudah dikenali.",
      }),
    );
  }

  if (hostname.includes("xn--")) {
    signals.push(
      signal({
        id: "url-punycode",
        category: "url_obfuscation",
        label: "Nama situs memakai format khusus",
        severity: "high",
        weight: 20,
        evidence: hostname,
        explanation: "Format khusus ini dapat membuat nama situs terlihat mirip dengan nama lain.",
      }),
    );
  }

  if (parsed.username || parsed.password) {
    signals.push(
      signal({
        id: "url-credentials",
        category: "url_obfuscation",
        label: "Ada teks sebelum tanda @ pada tautan",
        severity: "high",
        weight: 18,
        explanation: "Teks sebelum tanda @ dapat mengalihkan perhatian dari alamat tujuan yang sebenarnya.",
      }),
    );
  }

  if (parsed.protocol === "http:") {
    signals.push(
      signal({
        id: "url-plain-http",
        category: "plain_http",
        label: "Tautan tidak menggunakan HTTPS",
        severity: "medium",
        weight: 8,
        evidence: "http:",
        explanation: "Koneksi HTTP tidak memberi perlindungan enkripsi seperti HTTPS.",
      }),
    );
  }

  if (domain && SHORTENER_DOMAINS.has(domain)) {
    signals.push(
      signal({
        id: "url-shortener",
        category: "shortener",
        label: "Tautan memakai layanan pemendek",
        severity: "medium",
        weight: 8,
        evidence: domain,
        explanation: "Tujuan akhir tidak terlihat dari alamat pendek ini, jadi perlu diperiksa melalui sumber lain.",
      }),
    );
  }

  const subdomainLabels = subdomain?.split(".").filter(Boolean) ?? [];
  if (subdomainLabels.length >= 3) {
    signals.push(
      signal({
        id: "url-excessive-subdomain",
        category: "excessive_subdomain",
        label: "Bagian depan alamat terlalu panjang",
        severity: "medium",
        weight: 6,
        evidence: subdomain ?? undefined,
        explanation: "Banyak bagian sebelum alamat utama dapat membuat tujuan sebenarnya lebih sulit dikenali.",
      }),
    );
  }

  if ((hostname.match(/-/g) ?? []).length >= 3) {
    signals.push(
      signal({
        id: "url-many-hyphens",
        category: "url_obfuscation",
        label: "Nama situs memiliki banyak tanda hubung",
        severity: "low",
        weight: 5,
        evidence: hostname,
        explanation: "Pola nama yang rumit dapat membuat alamat utama lebih sulit dikenali.",
      }),
    );
  }

  if (/%[0-9a-f]{2}/i.test(displayInput)) {
    signals.push(
      signal({
        id: "url-encoded-pattern",
        category: "url_obfuscation",
        label: "Alamat memuat karakter yang disamarkan",
        severity: "medium",
        weight: 8,
        explanation: "Karakter yang diubah ke format khusus dapat menyamarkan bagian penting dari tautan.",
      }),
    );
  }

  const sensitiveSubdomain = subdomainLabels.some((part) => SENSITIVE_SUBDOMAIN_TOKENS.has(part));
  if (sensitiveSubdomain && domain) {
    signals.push(
      signal({
        id: "url-sensitive-subdomain",
        category: "brand_domain_mismatch",
        label: "Kata sensitif berada sebelum alamat utama",
        severity: "medium",
        weight: 24,
        evidence: subdomain ?? undefined,
        explanation: `Kata di bagian depan tidak mengubah alamat utama: ${domain}.`,
      }),
    );
  }

  if (claimedBrand && domain) {
    const claimed = brandSlug(claimedBrand);
    const normalizedDomain = domain.replace(/[^a-z0-9]/gi, "").toLocaleLowerCase("id-ID");

    if (claimed && !normalizedDomain.includes(claimed)) {
      signals.push(
        signal({
          id: "url-claimed-brand-mismatch",
          category: "brand_domain_mismatch",
          label: "Nama yang disebut tidak sama dengan alamat utama",
          severity: "high",
          weight: 30,
          evidence: `${claimedBrand} / ${domain}`,
          explanation: `Pesan menyebut ${claimedBrand}, sementara alamat utamanya ${domain}.`,
        }),
      );
    }
  }

  const structuralScore = Math.min(
    100,
    signals.reduce((total, current) => total + (current.weight ?? 0), 0),
  );
  const safeUrl = safeDisplayUrl(parsed);

  return {
    normalizedUrl: safeUrl,
    displayUrl: safeUrl,
    protocol: parsed.protocol,
    hostname,
    subdomain: subdomain || null,
    domain: domain || null,
    publicSuffix: domainParts.publicSuffix || null,
    path: parsed.pathname || "/",
    isIpHost: Boolean(domainParts.isIp),
    claimedBrand: claimedBrand ?? null,
    signals,
    structuralScore,
  };
}
