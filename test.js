const wbm = require('./src/index');

// wbm.start().then(async () => {
//     const phones = ['5535988841854', '35988841854', '5535988841854']; // array of phone numbers ['5535988841854', ...]
//     const message = 'hello';
//     await wbm.send(phones, message);
// })

wbm.start().then(async () => {
    const contacts = [{ phone: '5535988841854', name: 'Bruno' }, { phone: '35988841854', name: 'Bruno' }, { phone: '5535988841854', name: 'Bruno' }];
    for (contact of contacts) {
        let message = `hi ${contact.name}`;
        await wbm.sendTo(contact.phone, message);
    }
    await wbm.end();
})