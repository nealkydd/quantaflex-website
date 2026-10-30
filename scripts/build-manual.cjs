const fs = require('fs');
const crypto = require('crypto');
const parts = [1,2,3,4].map(n => fs.readFileSync('manual-parts/part-' + n));
const manual = Buffer.concat(parts);
const hash = crypto.createHash('sha256').update(manual).digest('hex');
if (hash !== '2d98ff09b1a2a0d733d0d0842e5e7d6634570ba3e38f460e6d405afbf3de4a0f') throw new Error('Manual integrity check failed');
fs.mkdirSync('guides', {recursive:true});
for (const name of ['quantaflex-user-manual-1.5.7.pdf','quantaflex-user-manual-v3.pdf']) fs.writeFileSync('guides/' + name, manual);
fs.rmSync('manual-parts', {recursive:true, force:true});
