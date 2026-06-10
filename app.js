const quoteTextEl = document.getElementById("quote-text");
const quoteAuthorEl = document.getElementById("quote-author");
const todayDateEl = document.getElementById("today-date");
const newQuoteBtn = document.getElementById("new-quote-btn");
const copyBtn = document.getElementById("copy-btn");
const copyFeedbackEl = document.getElementById("copy-feedback");

let quotes = [];
let currentQuote = null;

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hashDate(date) {
  const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickDailyQuote(list) {
  const index = hashDate(new Date()) % list.length;
  return list[index];
}

function pickRandomQuote(list, exclude) {
  if (list.length <= 1) return list[0];

  let quote;
  do {
    quote = list[Math.floor(Math.random() * list.length)];
  } while (quote === exclude);

  return quote;
}

function renderQuote(quote) {
  currentQuote = quote;
  quoteTextEl.textContent = quote.text;
  quoteAuthorEl.textContent = quote.author;
}

function showError() {
  quoteTextEl.textContent = "Could not load quotes. Please try again later.";
  quoteAuthorEl.textContent = "";
}

async function loadQuotes() {
  try {
    const response = await fetch("quotes.json");
    if (!response.ok) throw new Error("Failed to fetch");

    quotes = await response.json();
    if (!quotes.length) throw new Error("No quotes");

    renderQuote(pickDailyQuote(quotes));
  } catch {
    showError();
    newQuoteBtn.disabled = true;
    copyBtn.disabled = true;
  }
}

async function copyQuote() {
  if (!currentQuote) return;

  const text = `"${currentQuote.text}" — ${currentQuote.author}`;

  try {
    await navigator.clipboard.writeText(text);
    copyFeedbackEl.hidden = false;
    setTimeout(() => {
      copyFeedbackEl.hidden = true;
    }, 2000);
  } catch {
    copyFeedbackEl.textContent = "Could not copy. Please select the text manually.";
    copyFeedbackEl.hidden = false;
  }
}

todayDateEl.textContent = formatToday();
newQuoteBtn.addEventListener("click", () => {
  if (quotes.length) renderQuote(pickRandomQuote(quotes, currentQuote));
});
copyBtn.addEventListener("click", copyQuote);

loadQuotes();
