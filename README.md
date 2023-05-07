# Usage

1. `npm i @cdztt/message-react`

1. sample code:

```javascript
import { Message, useMessage } from '@cdztt/message-react'

function SayHi() {
    const message = useMessage()
    return (
        <button onClick={() => message.show({ content: 'Hi' })}>
            Say Hi
        </button>
    )
}

function Page() {
    return (
        <Message>
            <SayHi></SayHi>
        </Message>
    )
}
```

* API

Methods:
| Methods     | Parameters | Type     | Description         |
| ----------- | ---------- | -------- | ------------------- |
| show        | (opts)     | (Object) | Display a message.  |

Parameters:
| opts        | Properties | Type     | Units   | Default        |
| ----------- | ---------- | -------- | ------- | -------------- |
|             | content    | String   |         | 'please enter' |
|             | type       | String   |         | 'info'         |
|             | top        | Number   | px      | 100            |
|             | fontSize   | Number   | rem     | 1              |
|             | duration   | Number   | second  | 1.5            |

Properties:
| type        | Value     |
| ----------- | --------- |
|             | 'info'    |
|             | 'success' |
|             | 'warning' |
|             | 'error'   |
