/**
 * Minimal, dependency-free QR Code generator (byte mode).
 * Produces a square boolean matrix (true = dark module).
 *
 * Algorithm follows the QR Code spec (ISO/IEC 18004): byte-mode encoding,
 * Reed–Solomon error correction over GF(256), structured block interleaving,
 * function-pattern placement, and automatic best-mask selection.
 */

export type EccLevel = "L" | "M" | "Q" | "H";

const ECC_ORDINAL: Record<EccLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };
// Format-info bits use a different order (M=0, L=1, H=2, Q=3).
const ECC_FORMAT_BITS: Record<EccLevel, number> = { M: 0, L: 1, H: 2, Q: 3 };

// Index [eccOrdinal][version] (version 1..40; index 0 unused).
const ECC_CODEWORDS_PER_BLOCK: number[][] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

// ---- GF(256) Reed–Solomon ----
function rsMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
function rsComputeDivisor(degree: number): number[] {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = rsMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = rsMultiply(root, 2);
  }
  return result;
}
function rsComputeRemainder(data: number[], divisor: number[]): number[] {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift()!;
    result.push(0);
    for (let i = 0; i < result.length; i++) result[i] ^= rsMultiply(divisor[i], factor);
  }
  return result;
}

function getNumDataCodewords(ver: number, ecl: EccLevel): number {
  const totalCodewords = getNumRawDataModules(ver) >>> 3;
  const ord = ECC_ORDINAL[ecl];
  const blocks = NUM_ERROR_CORRECTION_BLOCKS[ord][ver];
  const eccPerBlock = ECC_CODEWORDS_PER_BLOCK[ord][ver];
  return totalCodewords - eccPerBlock * blocks;
}

function getNumRawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function getAlignmentPatternPositions(ver: number, size: number): number[] {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
  return result;
}

/** Returns the smallest version that fits `dataLen` bytes at the given ECC. */
function chooseVersion(dataLen: number, ecl: EccLevel): number {
  for (let ver = 1; ver <= 40; ver++) {
    const capacityBits = getNumDataCodewords(ver, ecl) * 8;
    const charCountBits = ver < 10 ? 8 : 16;
    const usedBits = 4 + charCountBits + dataLen * 8;
    if (usedBits <= capacityBits) return ver;
  }
  throw new Error("Data too long for QR code");
}

/** Encode a string into a QR matrix. Returns a 2D boolean array. */
export function encodeQR(text: string, ecl: EccLevel = "M"): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const ver = chooseVersion(bytes.length, ecl);
  const size = ver * 4 + 17;

  // --- Build data bit stream (byte mode) ---
  const bits: number[] = [];
  const appendBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  appendBits(0b0100, 4); // byte mode
  appendBits(bytes.length, ver < 10 ? 8 : 16);
  for (const b of bytes) appendBits(b, 8);

  const dataCapacityBits = getNumDataCodewords(ver, ecl) * 8;
  appendBits(0, Math.min(4, dataCapacityBits - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.push(0); // byte align
  for (let pad = 0xec; bits.length < dataCapacityBits; pad ^= 0xec ^ 0x11) appendBits(pad, 8);

  // bits -> codeword bytes
  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    dataCodewords.push(b);
  }

  // --- Split into blocks + ECC, then interleave ---
  const ord = ECC_ORDINAL[ecl];
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ord][ver];
  const eccLen = ECC_CODEWORDS_PER_BLOCK[ord][ver];
  const rawCodewords = getNumRawDataModules(ver) >>> 3;
  const numShort = numBlocks - (rawCodewords % numBlocks);
  const shortLen = Math.floor(rawCodewords / numBlocks);

  const divisor = rsComputeDivisor(eccLen);
  const blocks: number[][] = [];
  let k = 0;
  for (let i = 0; i < numBlocks; i++) {
    const dataLen = shortLen - eccLen + (i < numShort ? 0 : 1);
    const dat = dataCodewords.slice(k, k + dataLen);
    k += dataLen;
    const ecc = rsComputeRemainder(dat, divisor);
    blocks.push(dat.concat(ecc));
  }

  const result: number[] = [];
  const maxBlockLen = shortLen + 1;
  for (let i = 0; i < maxBlockLen; i++) {
    for (let j = 0; j < blocks.length; j++) {
      // skip the data-codeword gap in short blocks
      if (i !== shortLen - eccLen || j >= numShort) {
        if (i < blocks[j].length) result.push(blocks[j][i]);
      }
    }
  }

  // --- Build the module matrix ---
  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  const setFunction = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const xx = cx + dx;
        const yy = cy + dy;
        if (xx < 0 || xx >= size || yy < 0 || yy >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  };

  // Timing patterns
  for (let i = 0; i < size; i++) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // Alignment patterns
  const alignPos = getAlignmentPatternPositions(ver, size);
  for (const ay of alignPos) {
    for (const ax of alignPos) {
      // skip the three finder corners
      if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFunction(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  // Reserve format + version areas (filled later)
  const reserveFormat = () => {
    for (let i = 0; i < 9; i++) {
      isFunction[i][8] = true;
      isFunction[8][i] = true;
    }
    for (let i = 0; i < 8; i++) {
      isFunction[size - 1 - i][8] = true;
      isFunction[8][size - 1 - i] = true;
    }
    setFunction(8, size - 8, true); // dark module
  };
  reserveFormat();

  if (ver >= 7) {
    // version information reserved areas
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      isFunction[b][a] = true;
      isFunction[a][b] = true;
    }
  }

  // --- Place data bits with zig-zag ---
  let bitIdx = 0;
  const totalDataBits = result.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let c = 0; c < 2; c++) {
        const x = right - c;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIdx < totalDataBits) {
          const dark = ((result[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) !== 0;
          modules[y][x] = dark;
          bitIdx++;
        }
      }
    }
  }

  // --- Masking: choose the mask with the lowest penalty ---
  const applyMask = (mask: number, mtx: boolean[][]) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (isFunction[y][x]) continue;
        let invert = false;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        }
        if (invert) mtx[y][x] = !mtx[y][x];
      }
    }
  };

  const drawFormatBits = (mask: number, mtx: boolean[][]) => {
    const data = (ECC_FORMAT_BITS[ecl] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const formatBits = ((data << 10) | rem) ^ 0x5412;
    const getBit = (b: number) => ((formatBits >>> b) & 1) !== 0;
    for (let i = 0; i <= 5; i++) mtx[i][8] = getBit(i);
    mtx[7][8] = getBit(6);
    mtx[8][8] = getBit(7);
    mtx[8][7] = getBit(8);
    for (let i = 9; i < 15; i++) mtx[8][14 - i] = getBit(i);
    for (let i = 0; i < 8; i++) mtx[8][size - 1 - i] = getBit(i);
    for (let i = 8; i < 15; i++) mtx[size - 15 + i][8] = getBit(i);
    mtx[size - 8][8] = true;
  };

  const drawVersion = (mtx: boolean[][]) => {
    if (ver < 7) return;
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bitsV = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((bitsV >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      mtx[b][a] = bit;
      mtx[a][b] = bit;
    }
  };

  const penalty = (mtx: boolean[][]): number => {
    let p = 0;
    // Rule 1: runs of 5+
    for (let y = 0; y < size; y++) {
      let runColor = mtx[y][0], runLen = 1;
      for (let x = 1; x < size; x++) {
        if (mtx[y][x] === runColor) { runLen++; if (runLen === 5) p += 3; else if (runLen > 5) p++; }
        else { runColor = mtx[y][x]; runLen = 1; }
      }
    }
    for (let x = 0; x < size; x++) {
      let runColor = mtx[0][x], runLen = 1;
      for (let y = 1; y < size; y++) {
        if (mtx[y][x] === runColor) { runLen++; if (runLen === 5) p += 3; else if (runLen > 5) p++; }
        else { runColor = mtx[y][x]; runLen = 1; }
      }
    }
    // Rule 2: 2x2 blocks
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const c = mtx[y][x];
        if (c === mtx[y][x + 1] && c === mtx[y + 1][x] && c === mtx[y + 1][x + 1]) p += 3;
      }
    }
    // Rule 4: balance
    let dark = 0;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (mtx[y][x]) dark++;
    const total = size * size;
    const ratio = (dark * 20) / total;
    p += Math.abs(Math.round(ratio) - 10) * 10;
    return p;
  };

  let bestMask = 0;
  let bestPenalty = Infinity;
  let bestMatrix = modules;
  for (let mask = 0; mask < 8; mask++) {
    const trial = modules.map((row) => row.slice());
    applyMask(mask, trial);
    drawFormatBits(mask, trial);
    drawVersion(trial);
    const pen = penalty(trial);
    if (pen < bestPenalty) {
      bestPenalty = pen;
      bestMask = mask;
      bestMatrix = trial;
    }
  }
  void bestMask;

  return bestMatrix;
}
