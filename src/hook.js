import { useContext, useMemo } from 'react'
import { MsgsDispatchContext } from './Message'

const defaultMsg = {
    top: 100,
    duration: 1.5,
    content: '请输入内容',
    type: 'info',
    fontSize: 1
}
const typeEnum = ['info', 'success', 'warning', 'error']

function validate({ top, duration, content, type, fontSize } = {}) {
    let isTopAvailable = false
    let isDurationAvailable = false
    let isContentAvailable = false
    let isTypeAvailable = false
    let isFontSizeAvailable = false

    // top
    if (
        typeof top === 'number'
        && top >= 50
    ) {
        isTopAvailable = true
    }

    // duration
    if (
        typeof duration === 'number'
        && duration >= 0.5
        && duration <= 4.5
    ) {
        isDurationAvailable = true
    }

    // content
    if (
        typeof content === 'string'
        && content.length <= 50
    ) {
        isContentAvailable = true
    }

    // type
    if (typeEnum.includes(type)) {
        isTypeAvailable = true
    }

    // fontSize
    if (
        typeof fontSize === 'number'
        && fontSize > 0
    ) {
        isFontSizeAvailable = true
    }

    return {
        top: isTopAvailable,
        duration: isDurationAvailable,
        content: isContentAvailable,
        type: isTypeAvailable,
        fontSize: isFontSizeAvailable
    }
}

export function useMessage() {
    const dispatch = useContext(MsgsDispatchContext)

    return useMemo(() => {
        return {
            show(opts) {
                const result = validate(opts)
                dispatch({
                    type: 'add',
                    payload: {
                        top: result.top ? opts.top : defaultMsg.top,
                        duration: result.duration ? opts.duration : defaultMsg.duration,
                        content: result.content ? opts.content : defaultMsg.content,
                        type: result.type ? opts.type : defaultMsg.type,
                        fontSize: result.fontSize ? opts.fontSize : defaultMsg.fontSize,
                    }
                })
            }
        }
    }, [dispatch])
}