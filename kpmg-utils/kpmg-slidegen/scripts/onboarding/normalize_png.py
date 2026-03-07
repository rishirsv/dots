import argparse
from pathlib import Path

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description="Normalize a PNG to a fixed canvas size")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--width", required=True, type=int)
    parser.add_argument("--height", required=True, type=int)
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGBA")
    resized = image.resize((args.width, args.height), Image.Resampling.LANCZOS)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    resized.save(output)


if __name__ == "__main__":
    main()
