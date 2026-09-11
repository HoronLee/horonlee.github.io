# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.61.1", "brotli==1.2.0"]
# ///
"""Rebuild the complete, self-hosted Maple Mono NF CN v7.9 webfont set.

Run with: uv run themes/valaxy-theme-terminal/scripts/build_fonts.py
Uses installed v7.9 fonts, or downloads the official release into a temp directory.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ProcessPoolExecutor
from hashlib import sha256
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.request import urlopen
from zipfile import ZipFile

from fontTools import subset
from fontTools.ttLib import TTFont

THEME = Path(__file__).resolve().parents[1]
OUTPUT = THEME / "assets/fonts/maple-mono-nf-cn"
RELEASE = "https://github.com/subframe7536/maple-font/releases/download/v7.9/MapleMono-NF-CN.zip"
LICENSE = "https://raw.githubusercontent.com/subframe7536/maple-font/v7.9/OFL.txt"
SOURCES = {
    400: ("Regular", "8b4f149beaead3eac78ffb84adf31513ebf06fe6dbc6e181ccd9debad3c70f1a"),
    700: ("Bold", "25a3c344f0d915e443bd09339ef512f9cade14c2200612a37e6b8e8261940152"),
}


def unicode_ranges(codepoints: list[int]) -> str:
    """Exact, compressed CSS coverage; gaps must never hide fallback glyphs."""
    ranges = []
    start = previous = codepoints[0]
    for current in codepoints[1:]:
        if current != previous + 1:
            ranges.append((start, previous))
            start = current
        previous = current
    ranges.append((start, previous))
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in ranges)


def groups(codepoints: set[int]) -> list[tuple[str, list[int]]]:
    # Keep Latin, combining accents, and general punctuation together so
    # ordinary prose and programming ligatures do not cross font shards.
    latin = sorted(cp for cp in codepoints if cp <= 0x036F or 0x2000 <= cp <= 0x206F)
    remainder = sorted(codepoints - set(latin))
    return [("latin", latin)] + [
        (f"{index // 256:03d}", remainder[index:index + 256])
        for index in range(0, len(remainder), 256)
    ]


def build_shard(task: tuple[str, int, str, list[int], str]) -> dict:
    source, weight, label, codepoints, directory = task
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    options.recalc_timestamp = False
    options.harfbuzz_repacker = False
    options.drop_tables += ["meta"]
    # Keep source hinting and all layout features, including programming ligatures.
    font = TTFont(source, recalcTimestamp=False)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    font.flavor = "woff2"
    filename = f"maple-mono-nf-cn-{weight}-{label}.woff2"
    target = Path(directory) / filename
    font.save(target)
    font.close()
    with TTFont(target) as check:
        actual = set(check.getBestCmap())
        if actual != set(codepoints):
            raise ValueError(f"Coverage mismatch in {filename}")
        if check["OS/2"].usWeightClass != weight:
            raise ValueError(f"Weight mismatch in {filename}")
    data = target.read_bytes()
    return {
        "file": filename, "weight": weight, "characters": len(codepoints),
        "unicodeRange": unicode_ranges(codepoints), "bytes": len(data),
        "sha256": sha256(data).hexdigest(),
    }


def locate_sources(explicit: Path | None, temporary: Path) -> dict[int, Path]:
    directories = [explicit] if explicit else [Path.home() / "Library/Fonts", Path("/Library/Fonts")]
    found = {}
    for weight, (style, digest) in SOURCES.items():
        filename = f"MapleMono-NF-CN-{style}.ttf"
        for directory in directories:
            candidate = directory / filename
            if candidate.is_file() and sha256(candidate.read_bytes()).hexdigest() == digest:
                found[weight] = candidate
                break
    if len(found) == len(SOURCES):
        return found
    if explicit:
        raise ValueError("The supplied directory must contain the pinned v7.9 Regular and Bold TTFs")
    archive = temporary / "upstream.zip"
    print(f"Downloading official release: {RELEASE}", flush=True)
    with urlopen(RELEASE) as response, archive.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    with ZipFile(archive) as zipped:
        for weight, (style, digest) in SOURCES.items():
            filename = f"MapleMono-NF-CN-{style}.ttf"
            member = next(name for name in zipped.namelist() if Path(name).name == filename)
            data = zipped.read(member)
            if sha256(data).hexdigest() != digest:
                raise ValueError(f"Upstream checksum mismatch: {filename}")
            target = temporary / filename
            target.write_bytes(data)
            found[weight] = target
    return found


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, help="Directory containing the exact v7.9 TTFs")
    parser.add_argument("--jobs", type=int, default=4, help="Parallel font workers (default: 4)")
    args = parser.parse_args()
    with TemporaryDirectory(prefix="maple-webfonts-") as directory:
        temporary = Path(directory)
        sources = locate_sources(args.source_dir, temporary)
        generated = temporary / "generated"
        generated.mkdir()
        tasks = []
        metadata = []
        for weight, source in sources.items():
            with TTFont(source) as font:
                codepoints = set(font.getBestCmap())
                metadata.append({
                    "weight": weight, "file": source.name,
                    "sha256": SOURCES[weight][1], "family": font["name"].getDebugName(1),
                    "version": font["name"].getDebugName(5), "characters": len(codepoints),
                })
            for label, members in groups(codepoints):
                tasks.append((str(source), weight, label, members, str(generated)))
        print(f"Building {len(tasks)} shards using {args.jobs} workers", flush=True)
        with ProcessPoolExecutor(max_workers=args.jobs) as executor:
            shards = []
            for result in executor.map(build_shard, tasks):
                shards.append(result)
                if len(shards) % 20 == 0:
                    print(f"Verified {len(shards)}/{len(tasks)} shards", flush=True)
        css = ["/* Generated by scripts/build_fonts.py. Maple Mono NF CN v7.9; SIL OFL 1.1. */"]
        for shard in shards:
            css.append(
                "@font-face {\n"
                "  font-family: 'Maple Mono NF CN';\n"
                "  font-style: normal;\n"
                f"  font-weight: {shard['weight']};\n"
                "  font-display: swap;\n"
                f"  src: url('../assets/fonts/maple-mono-nf-cn/{shard['file']}') format('woff2');\n"
                f"  unicode-range: {shard['unicodeRange']};\n"
                "}"
            )
        OUTPUT.mkdir(parents=True, exist_ok=True)
        for existing in OUTPUT.glob("*.woff2"):
            existing.unlink()
        for font_file in generated.glob("*.woff2"):
            font_file.replace(OUTPUT / font_file.name)
        total = sum(shard["bytes"] for shard in shards)
        manifest = {"release": "v7.9", "upstream": RELEASE, "license": LICENSE,
                    "fonttools": "4.61.1", "brotli": "1.2.0", "sources": metadata,
                    "totalBytes": total, "shards": shards}
        (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        license_file = OUTPUT / "OFL.txt"
        if not license_file.exists():
            license_file.write_bytes(urlopen(LICENSE).read())
        (THEME / "styles").mkdir(parents=True, exist_ok=True)
        (THEME / "styles/fonts.css").write_text("\n\n".join(css) + "\n")
        print(f"Generated and verified {len(shards)} shards, {total:,} bytes", flush=True)


if __name__ == "__main__":
    main()
