const wbm = require('./src/index');

// wbm.start().then(async () => {
//     const phones = ['5535988841854', '35988841854', '5535988841854']; // array of phone numbers ['5535988841854', ...]
//     const message = 'hello';
//     await wbm.send(phones, message);
// })

wbm.start().then(async () => {
    const contacts = [{ phone: '5535988841854', name: "Bruno", age: 21 },
    { phone: '5535988841854', name: "Bruno", age: 21 },
    { phone: '5535988841854', name: "Bruno", age: 21 },
    { phone: '5535988841854', name: "Bruno", age: 21 }];
    const message = 'hello {{name}} & your age is {{age}}';
    await wbm.sendCustom(contacts, message);
});

// wbm.start().then(async () => {
//     const contacts = [
//         { phone: '5535988841854', name: 'Bruno', group: 'friend' },
//         { phone: '5535988841854', name: 'Will', group: 'customer' }
//     ];
//     for (contact of contacts) {
//         let message = 'hi';
//         if (contact.group === 'customer') {
//             message = 'Good morning ' + contact.name;
//         }
//         else if (contact.group === 'friend') {
//             message = 'Hey ' + contact.name + '. Wassup?';
//         }
//         await wbm.sendTo(contact.phone, message);
//     }
//     await wbm.end()
// })