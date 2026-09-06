import {
  createIcons,
  BookOpen,
  HelpCircle,
  Link,
  FileText,
  ScanLine,
  RefreshCw,
  LayoutDashboard,
  Newspaper,
  Wrench,
  Images,
  Mail,
  Shuffle,
  Archive,
  Activity,
  GitBranch,
  Sparkles,
  Search,
  X,
  ChevronRight,
} from "lucide";

interface LinkItem {
  title: string;
  url: string;
  icon: string;
  color?: string;
  desc?: string;
}

interface Theme {
  bg?: string;
  cardBg?: string;
  cardBorder?: string;
  text?: string;
  textSecondary?: string;
  accent?: string;
  cardHover?: string;
}

interface LinksData {
  avatar?: string;
  name: string;
  bio?: string;
  theme?: Theme;
  links: LinkItem[];
}

async function loadLinks(): Promise<LinksData> {
  const res = await fetch("/links.json");
  if (!res.ok) throw new Error("Error al cargar links.json");
  return res.json();
}

function getInitials(name: string | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderLinks(links: LinkItem[]): string {
  return links
    .map(
      (link, i) => `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card" style="--tint: ${link.color || "var(--accent)"}; --i: ${i}" aria-label="${link.title}${link.desc ? ` — ${link.desc}` : ""}">
        <span class="link-icon"><i data-lucide="${link.icon}"></i></span>
        <span class="link-body">
          <span class="link-text">${link.title}</span>
          ${link.desc ? `<span class="link-desc">${link.desc}</span>` : ""}
        </span>
        <span class="link-arrow"><i data-lucide="chevron-right"></i></span>
      </a>
    `,
    )
    .join("");
}

function renderAvatar(avatar: string | undefined, name: string): string {
  if (avatar) {
    return `<img src="${avatar}" alt="" class="avatar" crossorigin="anonymous" fetchpriority="high" />`;
  }
  return `<div class="avatar initials">${getInitials(name)}</div>`;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const map: Record<keyof Theme, string> = {
    bg: "--bg",
    cardBg: "--card-bg",
    cardBorder: "--card-border",
    text: "--text",
    textSecondary: "--text-secondary",
    accent: "--accent",
    cardHover: "--card-hover",
  };
  for (const [key, cssVar] of Object.entries(map) as [keyof Theme, string][]) {
    const value = theme[key];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  }
}

function initSearch(total: number): void {
  const input = document.getElementById("search-input") as HTMLInputElement | null;
  const wrap = document.getElementById("search") as HTMLElement | null;
  const count = document.getElementById("count") as HTMLElement | null;
  const empty = document.getElementById("empty") as HTMLElement | null;
  const clear = document.getElementById("search-clear") as HTMLButtonElement | null;
  if (!input || !wrap) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>(".link-card"));

  const apply = (): void => {
    const q = normalize(input.value.trim());
    let visible = 0;
    for (const card of cards) {
      const text = normalize(card.textContent ?? "");
      const show = !q || text.includes(q);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    }
    wrap.classList.toggle("has-value", input.value.length > 0);
    empty?.classList.toggle("show", visible === 0);
    if (count) {
      count.textContent =
        !q || visible === total ? "" : `${visible} de ${total}`;
    }
  };

  input.addEventListener("input", apply);
  clear?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    apply();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      apply();
      input.blur();
    }
  });
  apply();
}

function renderFooter(): string {
  return `<p>EduAlex &middot; ${new Date().getFullYear()}</p>`;
}

async function init(): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    const data = await loadLinks();

    if (data.theme) applyTheme(data.theme);

    app.innerHTML = `
      <div class="container">
        <header class="header">
          ${renderAvatar(data.avatar, data.name)}
          <h1 class="name">${data.name}</h1>
          ${data.bio ? `<p class="bio">${data.bio}</p>` : ""}
        </header>

        <div class="search" id="search">
          <i data-lucide="search"></i>
          <input id="search-input" type="search" placeholder="Buscar…" autocomplete="off" aria-label="Buscar enlaces" />
          <button class="search-clear" id="search-clear" type="button" aria-label="Limpiar búsqueda"><i data-lucide="x"></i></button>
        </div>
        <p class="count" id="count" aria-live="polite"></p>

        <main class="links">
          ${renderLinks(data.links)}
        </main>
        <div class="empty" id="empty">Sin resultados.<br />Probá con otra palabra.</div>

        <footer class="footer">
          ${renderFooter()}
        </footer>
      </div>
    `;

    createIcons({
      icons: {
        BookOpen,
        HelpCircle,
        Link,
        FileText,
        ScanLine,
        RefreshCw,
        LayoutDashboard,
        Newspaper,
        Wrench,
        Images,
        Mail,
        Shuffle,
        Archive,
        Activity,
        GitBranch,
        Sparkles,
        Search,
        X,
        ChevronRight,
      },
    });
    initSearch(data.links.length);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    app.innerHTML = `<div class="error">Error al cargar los enlaces: ${message}</div>`;
  }
}

init();
