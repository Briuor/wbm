const wpm = require('./src/index');

(async () => {
    await wpm.start();
    const phones = []; // array of phones ex: ['92523123121', '92523123123', ...]
    const message = "hi";
    wpm.send(phones, message);
})();