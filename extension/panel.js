const elements = {
  settings: document.querySelector("#settings"), settingsToggle: document.querySelector("#settings-toggle"),
  baseUrl: document.querySelector("#base-url"), token: document.querySelector("#token"), saveSettings: document.querySelector("#save-settings"), settingsStatus: document.querySelector("#settings-status"),
  scanner: document.querySelector("#scanner"), input: document.querySelector("#scan-input"), inputLabel: document.querySelector("#input-label"), capture: document.querySelector("#capture-selection"), useUrl: document.querySelector("#use-page-url"), scan: document.querySelector("#scan-button"), scanStatus: document.querySelector("#scan-status"),
  result: document.querySelector("#result"), riskLabel: document.querySelector("#risk-label"), riskScore: document.querySelector("#risk-score"), summary: document.querySelector("#result-summary"), uncertainty: document.querySelector("#result-uncertainty"), indicators: document.querySelector("#indicator-list"), actions: document.querySelector("#action-list"), openResult: document.querySelector("#open-result"), reset: document.querySelector("#reset"),
};

let mode = "text";
let resultUrl = "";

function normalizeBaseUrl(value) { return value.trim().replace(/\/$/, ""); }
function setStatus(element, value) { element.textContent = value; }

async function loadSettings() {
  const saved = await chrome.storage.local.get(["baseUrl", "integrationToken"]);
  elements.baseUrl.value = saved.baseUrl ?? "";
  elements.token.value = saved.integrationToken ?? "";
  const { pendingScan } = await chrome.storage.session.get("pendingScan");
  if (pendingScan?.value) {
    selectMode(pendingScan.mode === "url" ? "url" : "text");
    elements.input.value = pendingScan.value;
    elements.inputLabel.textContent = pendingScan.source ?? "Input terpilih";
    await chrome.storage.session.remove("pendingScan");
  }
  if (!saved.baseUrl || !saved.integrationToken) toggleSettings(true);
}

function toggleSettings(open) {
  elements.settings.hidden = !open;
  elements.settingsToggle.setAttribute("aria-expanded", String(open));
}

function selectMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll("[data-mode]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.mode === mode)));
  elements.inputLabel.textContent = mode === "url" ? "URL yang ingin diperiksa" : "Pesan yang ingin diperiksa";
  elements.input.placeholder = mode === "url" ? "https://contoh.com/akun" : "Blok pesan di halaman, atau tempel di sini.";
}

async function saveSettings() {
  const baseUrl = normalizeBaseUrl(elements.baseUrl.value);
  const integrationToken = elements.token.value.trim();
  try {
    const parsedBaseUrl = new URL(baseUrl);
    const permissionPattern = `${parsedBaseUrl.protocol}//${parsedBaseUrl.hostname}/*`;
    if (!integrationToken.startsWith("akx_")) throw new Error("Token harus diawali akx_.");
    const granted = await chrome.permissions.request({ origins: [permissionPattern] });
    if (!granted) throw new Error("Izin koneksi ke Base URL belum diberikan.");
    await chrome.storage.local.set({ baseUrl, integrationToken });
    setStatus(elements.settingsStatus, "Koneksi tersimpan.");
    toggleSettings(false);
  } catch (error) { setStatus(elements.settingsStatus, error instanceof Error ? error.message : "Konfigurasi belum valid."); }
}

async function captureSelection() {
  const response = await chrome.runtime.sendMessage({ type: "AMANKLIK_GET_SELECTION" });
  if (response?.ok && response.value) { selectMode("text"); elements.input.value = response.value; setStatus(elements.scanStatus, "Teks terpilih dimuat. Periksa preview sebelum mengirim."); }
  else setStatus(elements.scanStatus, "Tidak ada teks yang dipilih pada tab aktif.");
}

async function usePageUrl() {
  const response = await chrome.runtime.sendMessage({ type: "AMANKLIK_GET_SELECTION" });
  if (response?.url?.startsWith("http")) { selectMode("url"); elements.input.value = response.url; setStatus(elements.scanStatus, "Alamat tab dimuat. AmanKlik tidak akan membuka URL ini."); }
  else setStatus(elements.scanStatus, "Alamat tab ini tidak dapat diperiksa.");
}

function addResultItems(container, items, className) {
  container.replaceChildren();
  for (const item of items) {
    const wrapper = document.createElement("div"); wrapper.className = className;
    const title = document.createElement("strong"); title.textContent = item.label ?? item.title;
    const body = document.createElement("span"); body.textContent = item.explanation ?? item.body;
    wrapper.append(title, body); container.append(wrapper);
  }
}

async function scan() {
  const value = elements.input.value.trim();
  const settings = await chrome.storage.local.get(["baseUrl", "integrationToken"]);
  if (!settings.baseUrl || !settings.integrationToken) { toggleSettings(true); setStatus(elements.scanStatus, "Hubungkan extension terlebih dahulu."); return; }
  if ((mode === "text" && value.length < 8) || !value) { setStatus(elements.scanStatus, "Input masih terlalu pendek."); return; }
  elements.scan.disabled = true; setStatus(elements.scanStatus, "Menganalisis…");
  try {
    const response = await fetch(`${settings.baseUrl}/api/integrations/scan`, { method: "POST", headers: { "Authorization": `Bearer ${settings.integrationToken}`, "Content-Type": "application/json" }, body: JSON.stringify(mode === "url" ? { mode, url: value } : { mode, text: value }) });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.error?.message ?? "Pemeriksaan belum berhasil.");
    const result = body.data.result; resultUrl = body.data.resultUrl;
    elements.riskLabel.textContent = result.riskLevel.replace("_", " "); elements.riskScore.textContent = String(result.finalScore); elements.summary.textContent = result.summary; elements.uncertainty.textContent = result.uncertainty;
    addResultItems(elements.indicators, result.indicators, "indicator"); addResultItems(elements.actions, result.actions, "action");
    elements.scanner.hidden = true; elements.result.hidden = false; setStatus(elements.scanStatus, "");
  } catch (error) { setStatus(elements.scanStatus, error instanceof Error ? error.message : "Pemeriksaan belum berhasil."); }
  finally { elements.scan.disabled = false; }
}

elements.settingsToggle.addEventListener("click", () => toggleSettings(elements.settings.hidden));
elements.saveSettings.addEventListener("click", saveSettings);
elements.capture.addEventListener("click", captureSelection);
elements.useUrl.addEventListener("click", usePageUrl);
elements.scan.addEventListener("click", scan);
elements.openResult.addEventListener("click", () => { if (resultUrl) chrome.tabs.create({ url: resultUrl }); });
elements.reset.addEventListener("click", () => { elements.result.hidden = true; elements.scanner.hidden = false; resultUrl = ""; });
document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => selectMode(button.dataset.mode)));
loadSettings();
