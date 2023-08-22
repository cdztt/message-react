import React, {
  Dispatch,
  ReactNode,
  Reducer,
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom'; // 不用createPortal大部分情况下也行，但这个文档说明了一些特殊情况https://vuejs.org/guide/built-ins/teleport.html#basic-usage，所以还是用
import { Msg, MsgAction, MsgType } from './hook';
import './message.css';

// 等待多少毫秒
function _waiting(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// 测试用
// eslint-disable-next-line no-unused-vars
const msgsForTest: Msg[] = [
  {
    top: 50,
    duration: 2.5,
    content: 'hello world',
    type: 'info',
    fontSize: 2,
  },
  {
    top: 55,
    duration: 2,
    content: 'hello',
    type: 'success',
    fontSize: 1,
  },
  {
    top: 65,
    duration: 1,
    content: 'hello world hello world',
    type: 'warning',
    fontSize: 1.5,
  },
  {
    top: 60,
    duration: 1.5,
    content: 'hello world hello world hello world',
    type: 'error',
    fontSize: 0.5,
  },
];

const colorEmoji: Record<MsgType, { color: string; emoji: string }> = {
  info: {
    color: 'blue',
    emoji: '❕',
  },
  success: {
    color: 'darkgreen',
    emoji: '✅',
  },
  warning: {
    color: 'darkorange',
    emoji: '⚠️',
  },
  error: {
    color: 'red',
    emoji: '❌',
  },
};

const TIME_FOR_RESET = 5000; // ms
const TIME_BETWEEN_MSG = 500; // ms
const OFFSET_BEFORE_VISIBLE = -50; // px
const OFFSET_BEFORE_HIDDEN = -20; // px

export const MsgsDispatchContext = createContext<Dispatch<MsgAction>>(() => {});

function Message({ children }: { children: ReactNode }) {
  const msgNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<number>(0);
  const [isHover, setIsHover] = useState(false);

  // 测试用
  // const [msgs, msgsDispatch] = useReducer<Reducer<Msg[], MsgAction>, Msg[]>(
  //   msgsReducer,
  //   msgsForTest,
  //   (s) => s
  // );
  const [msgs, msgsDispatch] = useReducer<Reducer<Msg[], MsgAction>, Msg[]>(
    msgsReducer,
    [],
    (s) => s
  );
  const msgsRef = useRef<Msg[]>(msgs);

  // 把state存入ref
  useLayoutEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  // 重置消息数组
  useEffect(() => {
    if (
      cursorRef.current > 0 && // 不是初始状态
      cursorRef.current === msgNodesRef.current.length && // 所有消息都已展示过
      !isHover // 没有鼠标覆盖在消息上
    ) {
      const timerId = setTimeout(() => {
        cursorRef.current = 0;
        msgsDispatch({ type: 'reset' });
      }, TIME_FOR_RESET); // 几秒后重置消息数组

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isHover]);

  // 组件mount后运行的一个循环，一直拿消息数组里的内容，通过改变其css实现消息的展示和隐藏
  // 消息数组的内容全部用完之后依然在循环，组件销毁后跳出循环
  useEffect(() => {
    const changeCss = (cursor: number) => {
      const msgNode = msgNodesRef.current[cursor];
      const msg = msgsRef.current[cursor];
      if (!msgNode || !msg) {
        return;
      }

      const { top, duration } = msg;
      const { width } = msgNode.getBoundingClientRect();

      msgNode.style.left = `calc(50vw - ${width / 2}px)`;
      msgNode.style.top = top + 'px';
      msgNode.style.visibility = 'visible';

      const willHide = () => {
        return setTimeout(
          () => {
            msgNode.style.top = top + OFFSET_BEFORE_HIDDEN + 'px';
            msgNode.style.visibility = 'hidden';
            msgNode.style.opacity = '0.3';
          },
          (duration + 0.5) * 1000
        ); // 这里的0.5来源于transition: top 0.5s ease-out
      };

      let timerId = willHide();
      const handleEnter = () => {
        clearTimeout(timerId);
        setIsHover(true);
      };
      const handleLeave = () => {
        timerId = willHide();
        setIsHover(false);
      };

      msgNode.addEventListener('pointerenter', handleEnter);
      msgNode.addEventListener('pointerleave', handleLeave);

      return true;
    };

    let stop = false;
    (async function () {
      while (!stop) {
        await _waiting(TIME_BETWEEN_MSG); // 展示每个消息的间隔时间
        const done = changeCss(cursorRef.current);
        if (done) {
          cursorRef.current++;
        }
      }
    })();

    return () => {
      stop = true;
    };
  }, []);

  const msgsNode = msgs.map(({ top, content, type, fontSize }, key) => {
    return (
      <div
        key={key}
        style={{
          top: top + OFFSET_BEFORE_VISIBLE + 'px',
          color: colorEmoji[type].color,
          fontSize: fontSize + 'rem',
        }}
        className="message"
        // 在render时把每条消息的引用都推到数组msgNodesRef.current
        ref={(node) => (msgNodesRef.current[key] = node)}
      >
        {`${colorEmoji[type].emoji} ${content}`}
      </div>
    );
  });

  return (
    <MsgsDispatchContext.Provider value={msgsDispatch}>
      {children}
      {createPortal(msgsNode, document.body)}
    </MsgsDispatchContext.Provider>
  );
}

// reducer函数
function msgsReducer(msgs: Msg[], action: MsgAction): Msg[] {
  switch (action.type) {
    case 'add':
      return [...msgs, action.payload];
    case 'reset':
      return [];
  }
}

export function MessageWrapper(props: { children: ReactNode }) {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return <Message {...props} />;
}
