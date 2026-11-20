"""Turn a copy of the staging branch into a safe preview site.

For every .html file under the given directory:
- remove analytics/tracking tags (Google Tag Manager/Analytics, Microsoft
  Clarity, Meta Pixel) so preview visits don't pollute production data,
- add <meta name="robots" content="noindex, nofollow"> so search engines
  don't index the preview,
- insert a small fixed "Staging preview" banner.
"""
import re
import sys
from pathlib import Path

TRACKER_MARKERS = (
    "googletagmanager.com",
    "gtag(",
    "clarity.ms",
    "connect.facebook.net",
    "fbq(",
    "facebook.com/tr",
)

BLOCK = re.compile(r"<(script|noscript)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)
META_PIXEL_COMMENTS = re.compile(r"<!--\s*(End )?Meta Pixel Code\s*-->\n?", re.IGNORECASE)

ROBOTS = '<meta name="robots" content="noindex, nofollow">\n'
BANNER = (
    '<div role="note" style="position:fixed;left:50%;bottom:12px;transform:translateX(-50%);'
    "z-index:2147483647;background:#b3261e;color:#fff;font:600 13px/1.2 system-ui,sans-serif;"
    'padding:6px 12px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.25);pointer-events:none">'
    "Staging preview</div>\n"
)


def strip_trackers(html: str) -> str:
    def repl(m: re.Match) -> str:
        block = m.group(0)
        return "" if any(k in block for k in TRACKER_MARKERS) else block

    html = BLOCK.sub(repl, html)
    return META_PIXEL_COMMENTS.sub("", html)


def process(path: Path) -> None:
    html = strip_trackers(path.read_text(encoding="utf-8"))
    html = re.sub(r"(<head\b[^>]*>\n?)", r"\1" + ROBOTS, html, count=1, flags=re.IGNORECASE)
    html = re.sub(r"(<body\b[^>]*>\n?)", r"\1" + BANNER, html, count=1, flags=re.IGNORECASE)
    path.write_text(html, encoding="utf-8")


def main() -> None:
    root = Path(sys.argv[1])
    pages = sorted(root.rglob("*.html"))
    for page in pages:
        process(page)
    print(f"Prepared {len(pages)} staging page(s) in {root}")


if __name__ == "__main__":
    main()
