
# wbm
> wbm is an API to send bulk messages in whatsapp.

<p align="center"> 
<img src="https://github.com/Briuor/wbm/tree/master/assets/demo.gif">
</p>

## Installation
```bash
> npm install wbm
```

## Usage
:tw-26a0: **At the beginning it will display a QR Code on terminal, just scan it using whatsapp app.**

### Send same message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const phones = ['5535988841854']; // phone numbers ['5535988841854', ...]
    const message = "good morning";
    await wbm.send(phones, message);
})

```
### Send custom message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const contacts = [{ phone: '5535988841854', name: 'Bruno' }];
    for (contact of contacts) {
        let message = 'good morning ' + contact.name;
        await wbm.sendTo(contact.phone, message);
    }
})
```

## API

### send(phones, message)

Send same message to every phone number.

##### phones
Array of phone numbers: ['5535988841854', ...]
Type: `array`

##### message
Message to send to every phone number
Type: `string`

### sendTo(phone, message)

Send message to a phone number.

##### phone
Phone number: '5535988841854'.
Type: `string`


##### message
Message to send to phone number.
Type: `string`

## License

[MIT](https://choosealicense.com/licenses/mit/)