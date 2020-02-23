const puppeteer = require("puppeteer");
const qrcode = require("qrcode-terminal");
const ora = require("ora");

let browser = null;
let page = null;
let spinner = ora();
let counter = { fails: 0, success: 0 }

/**
 * Initialize browser, page and setup page desktop mode
 */
async function start() {
    browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]
    });
    page = await browser.newPage();
    // prevent dialog blocking page and just accept it(necessary when a message is sent too fast)
    page.on("dialog", async dialog => { await dialog.accept(); });
    // fix the chrome headless mode true issues
    // https://gitmemory.com/issue/GoogleChrome/puppeteer/1766/482797370
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
    page.setDefaultTimeout(60000);

    await generateQRCode();
}

/**
 * Access whatsapp web page, get QR Code data and generate it on terminal
 */
async function generateQRCode() {
    spinner.start("generating QRCode\n");
    await page.goto("https://web.whatsapp.com");
    await page.waitForSelector("div[data-ref]");
    const qrcodeData = await page.evaluate(() => {
        let qrcodeDiv = document.querySelector("div[data-ref]");
        return qrcodeDiv.getAttribute("data-ref");
    });
    qrcode.generate(qrcodeData, { small: true });
    spinner.info("QRCode generated! Scan it using Whatsapp App.");
    await page.waitForSelector("div[data-ref]", { hidden: true });
}

/**
 * @param {string} phone phone number: '5535988841854'
 * @param {string} message Message to send to phone number
 * Send message to a phone number
 */
async function sendTo(phone, message) {
    spinner.start("Sending Message\n");
    await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${message}`);
    await page.waitForSelector("div#startup");
    await page.waitForSelector("div#startup", { hidden: true });
    try {
        await page.waitForSelector('div[data-tab="1"]', { timeout: 3000 });
        await page.keyboard.press("Enter");
        await page.waitFor(1000);
        spinner.succeed(`${phone} Sent`);
        counter.success++;
    } catch (error) {
        spinner.fail(`${phone} Failed`);
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
    spinner.info(`Result: ${counter.success} sent, ${counter.fails} failed`);
}

module.exports = {
    start,
    send,
    sendTo,
    sendCustom,
    end
}