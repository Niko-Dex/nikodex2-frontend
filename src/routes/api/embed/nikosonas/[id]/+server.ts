import { errSrv } from "../../../helper";
import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  Image,
  loadImage,
} from "canvas";
import { baseImage, font, metadata } from "./image";
import type { Niko } from "$lib/types/nikosona";

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

function crc32(str: string) {
  let crc = 0xffffffff;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0; // Ensure unsigned
}

function printText(
  ctx: CanvasRenderingContext2D,
  img: Image,
  text: string,
  x: number,
  y: number,
) {
  const upper = text.toUpperCase();
  const cursorPos = { x: 0, y: 0 };
  for (let idx = 0; idx < upper.length; idx++) {
    const char = upper[idx];
    const maxlen = metadata.maxlen;
    let charPos = [-1, -1];
    if (char in font.c) {
      charPos = font.c[char as keyof typeof font.c];
    } else {
      charPos = font.c["?"];
    }

    const charWidth = font.character_size[0];
    const charHeight = font.character_size[1];

    if (char == "\n") {
      cursorPos.x = 0;
      cursorPos.y += 1;
    } else {
      ctx.drawImage(
        img,
        charPos[0],
        charPos[1],
        charWidth,
        charHeight,
        x + cursorPos.x * (charWidth + font.char_spacing),
        y + cursorPos.y * font.line_spacing,
        charWidth,
        charHeight,
      );
      cursorPos.x += 1;
      if (cursorPos.x >= maxlen) {
        cursorPos.x = 0;
        cursorPos.y += 1;
      }
    }
  }
}

async function postProcessing(
  fetch: (s: string) => Promise<Response>,
  canvas: Canvas,
  id: string,
) {
  const postProcess = createCanvas(
    metadata.size.card[0] * metadata.scale_factor,
    metadata.size.card[1] * metadata.scale_factor,
  );
  const postCtx = postProcess.getContext("2d");
  postCtx.patternQuality = "nearest";
  postCtx.quality = "nearest";
  postCtx.textDrawingMode = "glyph";
  postCtx.imageSmoothingEnabled = false;
  postCtx.drawImage(
    canvas,
    0,
    0,
    metadata.size.card[0],
    metadata.size.card[1],
    0,
    0,
    metadata.size.card[0] * metadata.scale_factor,
    metadata.size.card[1] * metadata.scale_factor,
  );

  const nsImgRes = await fetch(`/api/image?id=${id}`);
  const nsBuffer = await nsImgRes.arrayBuffer();
  const nsImg = await loadImage(Buffer.from(nsBuffer));

  postCtx.drawImage(
    nsImg,
    0,
    0,
    nsImg.width,
    nsImg.height,
    metadata.location.nikosona[0] * metadata.scale_factor,
    metadata.location.nikosona[1] * metadata.scale_factor,
    metadata.size.nikosona[0] * metadata.scale_factor,
    metadata.size.nikosona[1] * metadata.scale_factor,
  );

  return postProcess.toBuffer("image/png") as Buffer<ArrayBuffer>;
}

export async function GET({ fetch, params }) {
  try {
    const inputImg = await loadImage(baseImage);
    const id = params.id;

    const data = await fetch(`/api/data/niko?id=${id}`);
    const json = (await data.json()) as Niko;

    const canvas = createCanvas(metadata.w, metadata.h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(inputImg, 0, 0);

    const name = json.name.slice(0, metadata.maxlen * 2);

    if (name.length > metadata.maxlen) {
      printText(
        ctx,
        inputImg,
        name.slice(0, metadata.maxlen * 2),
        metadata.location.name_2line[0],
        metadata.location.name_2line[1],
      );
    } else {
      printText(
        ctx,
        inputImg,
        name,
        metadata.location.name_1line[0],
        metadata.location.name_1line[1],
      );
    }

    const textId = id.toString().padStart(4, "0");
    printText(
      ctx,
      inputImg,
      textId,
      metadata.location.id[0],
      metadata.location.id[1],
    );

    printText(
      ctx,
      inputImg,
      `"${json.description.trim()}"\n\nCreator: ${json.author_name}\n# of abilities: ${json.abilities.length}\nIssuer: TWM`,
      metadata.location.by_text[0],
      metadata.location.by_text[1],
    );

    const crc = crc32(JSON.stringify(json));
    const crcStr = crc
      .toString(8)
      .padStart(metadata.size.barcode.length, "0")
      .slice(0, metadata.size.barcode.length);
    for (let i = 0; i < crcStr.length; i++) {
      const d = Number(crcStr[i]);
      for (let j = 0; j < 3; j++) {
        if ((d & (1 << j)) > 0) {
          ctx.fillStyle = "white";
          ctx.fillRect(
            metadata.location.barcode[0] +
              i * metadata.size.barcode.bar[0] +
              j +
              1, // always one empty line at the start of every block
            metadata.location.barcode[1],
            1,
            metadata.size.barcode.bar[1],
          );
        }
      }
      ctx.fillStyle = "white";
      ctx.fillRect(
        metadata.location.barcode[0] + i * metadata.size.barcode.bar[0] + 5, // always one filled line at the end of every block
        metadata.location.barcode[1],
        1,
        metadata.size.barcode.bar[1],
      );
    }

    return new Response(await postProcessing(fetch, canvas, id), {
      headers: { "Content-Type": "image/png", "X-CRC32": crc.toString() },
    });
  } catch (e) {
    return errSrv(e);
  }
}
