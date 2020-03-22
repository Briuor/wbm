const puppeteer = require("puppeteer");
const qrcode = require("qrcode-terminal");

let browser = null;
let page = null;
let counter = { fails: 0, success: 0 }

/**
 * Initialize browser, page and setup page desktop mode
 */
async function start({ showBrowser = false, qrCodeData = false } = {}) {
    try {
        browser = await puppeteer.launch({
            headless: !showBrowser,
            args: ["--no-sandbox"]
        });
        page = await browser.newPage();
        // prevent dialog blocking page and just accept it(necessary when a message is sent too fast)
        page.on("dialog", async dialog => { await dialog.accept(); });
        // fix the chrome headless mode true issues
        // https://gitmemory.com/issue/GoogleChrome/puppeteer/1766/482797370
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
        page.setDefaultTimeout(60000);

        if (qrCodeData) {
            console.log('Getting QRCode data...');
            console.log('Note: You should use wbm.waitQRCode() inside wbm.start() to avoid errors.');
            return await getQRCodeData();
        }
        else {
            await generateQRCode();
        }

    } catch (err) {
        throw err;
    }
}

/**
 * return the data used to create the QR Code
 */
async function getQRCodeData() {
    await page.goto("https://web.whatsapp.com");
    await page.waitForSelector("div[data-ref]", { timeout: 60000 });
    const qrcodeData = await page.evaluate(() => {
        let qrcodeDiv = document.querySelector("div[data-ref]");
        return qrcodeDiv.getAttribute("data-ref");
    });
    return await qrcodeData;
}

/**
 * Access whatsapp web page, get QR Code data and generate it on terminal
 */
async function generateQRCode() {
    try {
        console.log("generating QRCode...");
        const qrcodeData = await getQRCodeData();
        qrcode.generate(qrcodeData, { small: true });
        console.log("QRCode generated! Scan it using Whatsapp App.");
    } catch {
        throw await QRCodeExeption("QR Code can't be generated(maybe your connection is too slow).");
    }
    await waitQRCode();
}

/**
 * Wait 30s to the qrCode be hidden on page
 */
async function waitQRCode() {
    // if user scan QR Code it will be hidden
    try {
        await page.waitForSelector("div[data-ref]", { timeout: 30000, hidden: true });
    } catch {
        throw await QRCodeExeption("Dont't be late to scan the QR Code.");
    }
}

/**
 * Close browser and show an error message
 * @param {string} msg 
 */
async function QRCodeExeption(msg) {
    await browser.close();
    return "QRCodeException: " + msg;
}

/**
 * @param {string} phone phone number: '5535988841854'
 * @param {string} message Message to send to phone number
 * Send message to a phone number
 */
async function sendTo(phone, message) {
    try {
        process.stdout.write("Sending Message...\r");
        await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURI(message)}`);
        await page.waitForSelector("div#startup", { hidden: true, timeout: 60000 });
        await page.waitForSelector('div[data-tab="1"]', { timeout: 5000 });
        await page.keyboard.press("Enter");
        await page.waitFor(1000);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${phone} Sent\n`);
        counter.success++;
    } catch {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${phone} Failed\n`);
        counter.fails++;
    }
}

/**
 * @param {array} phones Array of phone numbers: ['5535988841854', ...]
 * @param {string} message Message to send to every phone number
 * Send same message to every phone number
 */
async function send(phones, message) {
    for (let phone of phones) {
        await sendTo(phone, message);
    }
    await end();
}

/**
 * @param {array} contacts Array of contacts
 * @param {string} message Custom message to send to every phone number
 * Send custom message to every phone number
 */
async function sendCustom(contacts, messagePrototype) {
    for (let contact of contacts) {
        await sendTo(contact.phone, generateCustomMessage(contact, messagePrototype));
    }
    await end();
}

/**
 * @param {object} contact contact with several properties defined by the user
 * @param {string} messagePrototype Custom message to send to every phone number
 * @returns {string} message
 * Replace all text between {{}} to respective contact property
 */
function generateCustomMessage(contact, messagePrototype) {
    let message = messagePrototype;
    for (let property in contact) {
        message = message.replace(new RegExp(`{{${property}}}`, "g"), contact[property]);
    }
    return message;
}

/**
 * Close browser and show results(number of messages sent and failed)
 */
async function end() {
    await browser.close();
    console.log(`Result: ${counter.success} sent, ${counter.fails} failed`);
}

module.exports = {
    start,
    send,
    sendTo,
    sendCustom,
    end,
    waitQRCode
}