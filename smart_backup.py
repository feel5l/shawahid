#!/usr/bin/env python3
"""Create a clean project backup without deleting or modifying source files."""

from __future__ import annotations

import argparse
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Iterable


DEFAULT_DESTINATION_BASE = Path(r"C:\Users\Tonjo\OneDrive\Desktop\new zaid")
DEFAULT_BACKUP_NAME = "project_clean_backup"

# Approved exclusions from the previous review.
EXCLUDED_DIR_NAMES = {
    ".git",
    "node_modules",
    "dist",
    ".local",
    ".netlify",
    # Common generated/cached folders
    "venv",
    ".venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "coverage",
    "build",
    "out",
    ".next",
    ".nuxt",
    ".turbo",
    ".parcel-cache",
    ".cache",
}

EXCLUDED_RELATIVE_FILES = {
    Path(".env"),
}

EXCLUDED_FILE_SUFFIXES = {
    ".log",
    ".tmp",
    ".temp",
    ".cache",
    ".swp",
    ".bak",
    ".old",
}

EXCLUDED_FILE_NAMES = {
    ".DS_Store",
}


class CopyStats:
    def __init__(self) -> None:
        self.copied_files = 0
        self.skipped_files = 0
        self.skipped_dirs = 0


def should_skip_file(source_root: Path, file_path: Path) -> bool:
    relative_file = file_path.relative_to(source_root)
    lower_name = file_path.name.lower()
    suffix = file_path.suffix.lower()

    if relative_file in EXCLUDED_RELATIVE_FILES:
        return True

    if lower_name in {name.lower() for name in EXCLUDED_FILE_NAMES}:
        return True

    if suffix in EXCLUDED_FILE_SUFFIXES:
        return True

    return False


def unique_destination(base_destination: Path, backup_name: str) -> Path:
    candidate = base_destination / backup_name
    if not candidate.exists():
        return candidate

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return base_destination / f"{backup_name}_{timestamp}"


def copy_project(source_root: Path, destination_root: Path, dry_run: bool) -> CopyStats:
    stats = CopyStats()

    for current_root, dirs, files in os.walk(source_root, topdown=True):
        current_root_path = Path(current_root)
        relative_root = current_root_path.relative_to(source_root)

        filtered_dirs = []
        for directory_name in dirs:
            if directory_name in EXCLUDED_DIR_NAMES:
                stats.skipped_dirs += 1
                continue
            filtered_dirs.append(directory_name)
        dirs[:] = filtered_dirs

        target_root = destination_root / relative_root
        if not dry_run:
            target_root.mkdir(parents=True, exist_ok=True)

        for file_name in files:
            source_file = current_root_path / file_name

            if should_skip_file(source_root, source_file):
                stats.skipped_files += 1
                continue

            destination_file = destination_root / source_file.relative_to(source_root)

            if dry_run:
                stats.copied_files += 1
                continue

            destination_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_file, destination_file)
            stats.copied_files += 1

    return stats


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a clean backup copy of the current project."
    )
    parser.add_argument(
        "--dest",
        type=Path,
        default=DEFAULT_DESTINATION_BASE,
        help=(
            "Destination base directory where the backup folder will be created. "
            f"Default: {DEFAULT_DESTINATION_BASE}"
        ),
    )
    parser.add_argument(
        "--name",
        type=str,
        default=DEFAULT_BACKUP_NAME,
        help=(
            "Backup folder name. If it already exists, a timestamp is appended. "
            f"Default: {DEFAULT_BACKUP_NAME}"
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview copy counts without creating files.",
    )
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args()

    source_root = Path.cwd().resolve()
    destination_base = args.dest.resolve()
    destination_base.mkdir(parents=True, exist_ok=True)

    destination_root = unique_destination(destination_base, args.name)

    if destination_root == source_root:
        raise RuntimeError("Destination cannot be the same as source project directory.")

    print("Starting smart backup...")
    print(f"Source: {source_root}")
    print(f"Destination base: {destination_base}")
    print(f"Backup folder: {destination_root.name}")
    print(f"Dry run: {args.dry_run}")

    if not args.dry_run:
        destination_root.mkdir(parents=True, exist_ok=False)

    stats = copy_project(source_root, destination_root, args.dry_run)

    print("Backup completed.")
    print(f"Final backup path: {destination_root}")
    print(f"Copied files: {stats.copied_files}")
    print(f"Skipped files: {stats.skipped_files}")
    print(f"Skipped directories: {stats.skipped_dirs}")


if __name__ == "__main__":
    main()
