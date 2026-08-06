import {
  createIcons,
  BookOpen,
  HelpCircle,
  Link,
  FileText,
  ClipboardCheck,
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

function renderIcon(icon: string, color?: string): string {
  return `<i data-lucide="${icon}" style="color: ${color || "var(--accent)"}; width:22px;height:22px"></i>`;
}

function getBentoSpan(i: number, total: number): string {
  const remaining = total - i;
  const mod = i % 8;

  if (remaining === 1) return "1";
  if (remaining === 2) {
    if (mod === 4) return "2";
    if (mod === 0) return "2x2";
  }
  if (remaining === 3 && mod === 4) return "2";

  switch (mod) {
    case 0:
      return "2x2";
    case 1:
    case 6:
      return "2";
    case 4:
      return "2v";
    default:
      return "1";
  }
}

function renderLinks(links: LinkItem[]): string {
  return links
    .map(
      (link, i) => `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card" data-span="${getBentoSpan(i, links.length)}" style="--accent: ${link.color || "var(--accent)"}; --i: ${i}">
        <span class="link-card-inner">
          <span class="link-card-front">
            <span class="link-icon">${renderIcon(link.icon, link.color)}</span>
            <span class="link-text">${link.title}</span>
            <span class="link-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h10v10M7 17 17 7"/></svg>
            </span>
          </span>
          ${link.desc ? `<span class="link-card-back"><span class="link-desc">${link.desc}</span></span>` : ""}
        </span>
      </a>
    `,
    )
    .join("");
}

function renderAvatar(avatar: string | undefined, name: string): string {
  if (avatar) {
    return `<img src="${avatar}" alt="" class="avatar" crossorigin="anonymous" />`;
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

function renderFooter(): string {
  return `<p>EduAlex &middot; ${new Date().getFullYear()}</p>`;
}

function initCursorGlow(): void {
  // Desktop only, and only for users who don't ask to reduce motion.
  const desktop = window.matchMedia("(min-width: 481px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktop.matches || reduce.matches) return;

  const root = document.documentElement;
  let raf = 0;
  window.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      root.style.setProperty(
        "--mx",
        `${(e.clientX / window.innerWidth) * 100}%`,
      );
      root.style.setProperty(
        "--my",
        `${(e.clientY / window.innerHeight) * 100}%`,
      );
      raf = 0;
    });
  });
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

        <main class="links">
          ${renderLinks(data.links)}
        </main>

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
        ClipboardCheck,
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
      },
    });
    initCursorGlow();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    app.innerHTML = `<div class="error">Error al cargar los enlaces: ${message}</div>`;
  }
}

init();
