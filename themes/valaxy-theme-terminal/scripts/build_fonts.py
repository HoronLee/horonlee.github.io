# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.61.1", "brotli==1.2.0"]
# ///
"""Rebuild the self-hosted Maple Mono NF v7.9 webfont set.

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
OUTPUT = THEME / "assets/fonts/maple-mono-nf"
RELEASE = "https://github.com/subframe7536/maple-font/releases/download/v7.9/MapleMono-NF.zip"
LICENSE = "https://raw.githubusercontent.com/subframe7536/maple-font/v7.9/OFL.txt"
ARCHIVE_SHA256 = "59098b87c895d871635d37680e88000ae2b2b25b55428195b228ec589e35fb89"
# Chinese text and CJK punctuation must retain the same system fallback before
# and after the Latin/icon webfonts arrive. Never include Nerd Fonts PUA here.
SYSTEM_RANGES = (
    (0x2E80, 0xA4CF),  # CJK radicals, punctuation, kana, Bopomofo, unified ideographs and Yi
    (0xF900, 0xFAFF),  # Compatibility ideographs
    (0xFE10, 0xFE1F),  # Vertical punctuation
    (0xFE30, 0xFE6F),  # CJK compatibility and small-form punctuation
    (0xFF00, 0xFFEF),  # Fullwidth and halfwidth forms
    (0x16FE0, 0x18DFF),  # Ideographic symbols, Tangut and Khitan
    (0x1B000, 0x1B2FF),  # Kana supplements
    (0x20000, 0x3FFFF),  # All supplementary CJK ideograph planes
)
SOURCES = {
    400: ("Regular", "dbf160ce96358056a47777e95a50af208b438312787cf20917ce2321066de8e5"),
    700: ("Bold", "cf6fb13160424257ea764a5deb1d55116c9ab5c347cb69c6be2576b44dc3d544"),
}


def uses_system_font(codepoint: int) -> bool:
    return any(start <= codepoint <= end for start, end in SYSTEM_RANGES)


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
    filename = f"maple-mono-nf-{weight}-{label}.woff2"
    target = Path(directory) / filename
    font.save(target)
    font.close()
    with TTFont(target) as check:
        actual = set(check.getBestCmap())
        if any(uses_system_font(cp) for cp in actual):
            raise ValueError(f"System fallback character found in {filename}")
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
        filename = f"MapleMono-NF-{style}.ttf"
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
    if sha256(archive.read_bytes()).hexdigest() != ARCHIVE_SHA256:
        raise ValueError("Upstream archive checksum mismatch")
    with ZipFile(archive) as zipped:
        for weight, (style, digest) in SOURCES.items():
            filename = f"MapleMono-NF-{style}.ttf"
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
                source_codepoints = set(font.getBestCmap())
                codepoints = {cp for cp in source_codepoints if not uses_system_font(cp)}
                if font["name"].getDebugName(1) != "Maple Mono NF":
                    raise ValueError(f"Expected genuine Maple Mono NF source: {source}")
                metadata.append({
                    "weight": weight, "file": source.name,
                    "sha256": SOURCES[weight][1], "family": font["name"].getDebugName(1),
                    "version": font["name"].getDebugName(5), "characters": len(source_codepoints),
                    "includedCharacters": len(codepoints),
                    "excludedUnicodeRange": unicode_ranges(sorted(source_codepoints - codepoints))
                    if source_codepoints - codepoints else "",
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
        css = ["/* Generated by scripts/build_fonts.py. Maple Mono NF v7.9; SIL OFL 1.1. */"]
        for shard in shards:
            css.append(
                "@font-face {\n"
                "  font-family: 'Maple Mono NF';\n"
                "  font-style: normal;\n"
                f"  font-weight: {shard['weight']};\n"
                "  font-display: swap;\n"
                f"  src: url('../assets/fonts/maple-mono-nf/{shard['file']}') format('woff2');\n"
                f"  unicode-range: {shard['unicodeRange']};\n"
                "}"
            )
        OUTPUT.mkdir(parents=True, exist_ok=True)
        previous_manifest = OUTPUT / "manifest.json"
        if previous_manifest.exists():
            for shard in json.loads(previous_manifest.read_text())["shards"]:
                filename = shard["file"]
                if Path(filename).name != filename or not filename.startswith("maple-mono-nf-") or not filename.endswith(".woff2"):
                    raise ValueError(f"Unexpected generated filename: {filename}")
                (OUTPUT / filename).unlink(missing_ok=True)
        for font_file in generated.glob("*.woff2"):
            font_file.replace(OUTPUT / font_file.name)
        total = sum(shard["bytes"] for shard in shards)
        manifest = {"release": "v7.9", "upstream": RELEASE, "license": LICENSE,
                    "archiveSha256": ARCHIVE_SHA256,
                    "systemFallbackRanges": [f"U+{start:X}-{end:X}" for start, end in SYSTEM_RANGES],
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
