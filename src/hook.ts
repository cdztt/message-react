import { useContext, useMemo } from 'react';
import { MsgsDispatchContext } from './Message';

export type MsgType = 'info' | 'success' | 'warning' | 'error';

export interface Msg {
  top: number;
  duration: number;
  content: string;
  type: MsgType;
  fontSize: number;
}

export type MsgOpts = Partial<Msg>;

interface MsgAction1 {
  type: 'add';
  payload: Msg;
}
interface MsgAction2 {
  type: 'reset';
}
export type MsgAction = MsgAction1 | MsgAction2;

function getValidatedMsg(msg: MsgOpts = {}): Msg {
  const { top, duration, content, type, fontSize } = msg;

  const defaultMsg = {
    top: 100,
    duration: 1.5,
    content: 'please enter',
    type: 'info',
    fontSize: 1,
  };

  let isTopAvailable = false;
  let isDurationAvailable = false;
  let isContentAvailable = false;
  let isTypeAvailable = false;
  let isFontSizeAvailable = false;

  // top
  if (typeof top === 'number' && top >= 50) {
    isTopAvailable = true;
  }

  // duration
  if (typeof duration === 'number' && duration >= 0.5 && duration <= 4.5) {
    isDurationAvailable = true;
  }

  // content
  if (typeof content === 'string' && content.length <= 50) {
    isContentAvailable = true;
  }

  // type
  if (
    type !== undefined &&
    ['info', 'success', 'warning', 'error'].includes(type)
  ) {
    isTypeAvailable = true;
  }

  // fontSize
  if (typeof fontSize === 'number' && fontSize > 0) {
    isFontSizeAvailable = true;
  }

  return {
    top: isTopAvailable ? top : defaultMsg.top,
    duration: isDurationAvailable ? duration : defaultMsg.duration,
    content: isContentAvailable ? content : defaultMsg.content,
    type: isTypeAvailable ? type : defaultMsg.type,
    fontSize: isFontSizeAvailable ? fontSize : defaultMsg.fontSize,
  } as Msg;
}

export function useMessage() {
  const dispatch = useContext(MsgsDispatchContext);

  return useMemo(() => {
    return {
      show(opts: MsgOpts) {
        const msg = getValidatedMsg(opts);
        dispatch({
          type: 'add',
          payload: msg,
        });
      },
    };
  }, [dispatch]);
}
