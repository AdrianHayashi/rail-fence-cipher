# Rail Fence Cipher

Enciphers and deciphers text by writing characters in a zigzag rail pattern and reading them off by row.

```js
import { encode, decode } from './src/index.js';

const ciphertext = encode('WEAREDISCOVEREDFLEEATONCE', 3);
// 'WECRLTEERDSOEEFEAOCAIVDEN'

const plaintext = decode(ciphertext, 3);
// 'WEAREDISCOVEREDFLEEATONCE'
```

The exported names are `encode` and `decode`.

## Why this library exists

The Rail Fence Cipher is a classic transposition cipher. It is easy to implement badly by losing characters at the edges of the zigzag or by mishandling messages shorter than the rail count. This implementation treats each UTF-16 code unit as a single character and performs no Unicode normalisation. That is a deliberate trade-off: it makes the cipher fully reversible for any JavaScript string without hidden transformations, at the cost of potentially splitting surrogate pairs. If you need grapheme-aware encryption, this library is not the right tool.

## Edge cases

- A rail count of `1` returns the original message unchanged.
- An empty message returns an empty string.
- The rail count must be a positive integer; anything else throws a `RangeError`.
- Messages shorter than the rail count still encipher and decipher correctly.
