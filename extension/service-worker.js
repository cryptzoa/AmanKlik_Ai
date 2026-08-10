const MENU_SELECTION = "amanklik-selection";
const MENU_LINK = "amanklik-link";
const MENU_PAGE = "amanklik-page";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: MENU_SELECTION, title: "Periksa teks dengan AmanKlik", contexts: ["selection"] });
  chrome.contextMenus.create({ id: MENU_LINK, title: "Periksa tautan dengan AmanKlik", contexts: ["link"] });
  chrome.contextMenus.create({ id: MENU_PAGE, title: "Periksa alamat halaman dengan AmanKlik", contexts: ["page"] });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => undefined);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || ![MENU_SELECTION, MENU_LINK, MENU_PAGE].includes(String(info.menuItemId))) return;
  const pendingScan = info.menuItemId === MENU_SELECTION
    ? { mode: "text", value: info.selectionText ?? "", source: "Teks yang dipilih" }
    : { mode: "url", value: info.linkUrl ?? info.pageUrl ?? "", source: info.menuItemId === MENU_LINK ? "Tautan yang dipilih" : "Alamat halaman" };
  await chrome.storage.session.set({ pendingScan });
  await chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "AMANKLIK_GET_SELECTION") return false;
  (async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return sendResponse({ ok: false, value: "" });
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString().trim() ?? "",
      });
      sendResponse({ ok: true, value: typeof result?.result === "string" ? result.result : "", url: tab.url ?? "" });
    } catch {
      sendResponse({ ok: false, value: "", url: tab.url ?? "" });
    }
  })();
  return true;
});
