/**
 * Encipher a message using the Rail Fence Cipher.
 *
 * The message is written in a zigzag pattern across the given number of rails,
 * then read row by row to produce the ciphertext. Characters are treated as
 * UTF-16 code units; no attempt is made to combine surrogate pairs or
 * normalise Unicode. This keeps the cipher deterministic and predictable for
 * any JavaScript string.
 *
 * @param {string} message - The plaintext to encipher.
 * @param {number} rails - Number of rails. Must be a positive integer.
 * @returns {string} The ciphertext.
 * @throws {RangeError} If rails is less than 1.
 */
export function encode(message, rails) {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new RangeError('rails must be a positive integer');
  }
  if (rails === 1 || message.length === 0) {
    return message;
  }

  const railStrings = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;

  for (const char of message) {
    railStrings[rail].push(char);

    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }

    rail += direction;
  }

  return railStrings.flat().join('');
}

/**
 * Decipher a message that was enciphered with the Rail Fence Cipher.
 *
 * Reconstructs the zigzag pattern by first computing how many characters belong
 * on each rail, then slicing the ciphertext into the corresponding segments in
 * order. Because every character of the ciphertext is used exactly once and
 * characters are written in message order within each rail, this yields the
 * original plaintext.
 *
 * @param {string} message - The ciphertext to decipher.
 * @param {number} rails - Number of rails. Must be a positive integer.
 * @returns {string} The plaintext.
 * @throws {RangeError} If rails is less than 1.
 */
export function decode(message, rails) {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new RangeError('rails must be a positive integer');
  }
  if (rails === 1 || message.length === 0) {
    return message;
  }

  const railLengths = new Array(rails).fill(0);
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < message.length; i += 1) {
    railLengths[rail] += 1;

    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }

    rail += direction;
  }

  const railStrings = [];
  let offset = 0;
  for (let r = 0; r < rails; r += 1) {
    railStrings.push(message.slice(offset, offset + railLengths[r]).split(''));
    offset += railLengths[r];
  }

  const result = [];
  rail = 0;
  direction = 1;

  for (let i = 0; i < message.length; i += 1) {
    result.push(railStrings[rail].shift());

    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }

    rail += direction;
  }

  return result.join('');
}
