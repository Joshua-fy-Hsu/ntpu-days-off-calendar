const calendarBaseUrl = "https://joshua-fy-hsu.github.io/ntpu-days-off-calendar";

const translations = {
  zh: {
    htmlLang: "zh-Hant", pageTitle: "臺北大學放假日曆", feed: "ntpu-115-zh.ics",
    title: "臺北大學放假日曆", coverage: "115 學年度 · 2026/08/01—2027/07/31",
    lead: "只收錄真正影響上課的日子：國定假日、補假與全校停課日。", subscribe: "加入 Apple 行事曆", download: "下載中文版 .ics",
    factsLabel: "行事曆摘要", events: "個事件", languageValue: "中文", titles: "顯示", none: "無", alerts: "提醒通知",
    includedTitle: "收錄內容", included1: "國定假日與補假", included2: "臺北大學全校停課日", included3: "校慶與運動會補假",
    excluded: "不另外標示一般週六、週日，也不收錄寒暑假、考試週或只有部分師生適用的活動。",
    howTitle: "如何訂閱", step1: "點選「加入 Apple 行事曆」。", step2: "在系統視窗中選擇「訂閱」。", step3: "之後更新會自動同步，不需重新下載。",
    manualTitle: "手動訂閱網址", manualHelp: "若按鈕沒有開啟行事曆，請複製以下網址，並在 Apple 行事曆中新增訂閱行事曆：",
    source: "資料來源：國立臺北大學 115 學年度行事曆", disclaimer: "此為非官方便利工具；如有差異，以校方最新公告為準。",
  },
  en: {
    htmlLang: "en", pageTitle: "NTPU Days-Off Calendar", feed: "ntpu-115-en.ics",
    title: "NTPU Days-Off Calendar", coverage: "Academic Year 115 · Aug 1, 2026—Jul 31, 2027",
    lead: "Only dates that affect classes: public holidays, observed holidays, and university-wide no-class days.", subscribe: "Add to Apple Calendar", download: "Download English .ics",
    factsLabel: "Calendar summary", events: "events", languageValue: "English", titles: "titles", none: "No", alerts: "alerts",
    includedTitle: "What is included", included1: "Public and observed holidays", included2: "NTPU-wide no-class days", included3: "Compensatory holidays for anniversary and sports day",
    excluded: "Ordinary weekends, summer and winter vacations, exam weeks, and events affecting only some students or staff are not included.",
    howTitle: "How to subscribe", step1: "Select “Add to Apple Calendar.”", step2: "Choose “Subscribe” in the system dialog.", step3: "Future updates sync automatically—no need to download again.",
    manualTitle: "Manual subscription URL", manualHelp: "If the button does not open Calendar, copy this URL and add it as a subscribed calendar:",
    source: "Source: NTPU Academic Year 115 Calendar", disclaimer: "This is an unofficial convenience tool. NTPU’s latest announcement takes precedence.",
  },
};

const applyLanguage = (language, updateUrl = true) => {
  const selected = translations[language] ?? translations.zh;
  const feedUrl = `${calendarBaseUrl}/${selected.feed}`;

  document.documentElement.lang = selected.htmlLang;
  document.title = selected.pageTitle;
  document.querySelectorAll("[data-copy]").forEach((element) => { element.textContent = selected[element.dataset.copy]; });
  document.querySelectorAll("[data-aria-copy]").forEach((element) => { element.setAttribute("aria-label", selected[element.dataset.ariaCopy]); });
  document.querySelectorAll("[data-language]").forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.language === language)); });

  document.querySelector("#subscribe-link").href = feedUrl.replace("https://", "webcal://");
  document.querySelector("#download-link").href = selected.feed;
  document.querySelector("#manual-url").textContent = feedUrl;
  localStorage.setItem("ntpu-calendar-language", language);

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
  }
};

document.querySelectorAll("[data-language]").forEach((button) => { button.addEventListener("click", () => applyLanguage(button.dataset.language)); });

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const savedLanguage = localStorage.getItem("ntpu-calendar-language");
applyLanguage(["zh", "en"].includes(requestedLanguage) ? requestedLanguage : savedLanguage ?? "zh", false);
