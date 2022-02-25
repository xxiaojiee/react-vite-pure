import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
  Transition,
} from 'react-transition-group';

type Mode = 'in-out' | 'out-in';

interface TransitionProp {
  show?: boolean; // 是否进入
  group?: boolean; // 是否使用TransitionGroup
  switched?: boolean; // 是否使用SwitchTransition
  mode?: Mode;
  origin: string;
  className?: string;
  timeout?: number;
  children: React.ReactChild;
}

export function createSimpleTransition(
  name: string,
  transitionOrigin = 'top center 0',
  transitionMode: Mode = 'out-in',
) {
  return function (props: TransitionProp) {
    const {
      group = false,
      switched = false,
      show = false,
      timeout = 300,
      mode = transitionMode,
      origin = transitionOrigin,
      className,
      children,
    } = props;
    const onBeforeEnter = (el: HTMLElement) => {
      el.style.transformOrigin = origin;
    };
    if (group) {
      return (
        <TransitionGroup className={className}>
          {React.Children.map(children, (cheild) => (
            <CSSTransition
              timeout={timeout}
              classNames={name}
              unmountOnExit
              onEnter={onBeforeEnter}
            >
              {cheild}
            </CSSTransition>
          ))}
        </TransitionGroup>
      );
    }
    if (switched) {
      return (
        <SwitchTransition mode={mode}>
          <CSSTransition
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            classNames={name}
            unmountOnExit
            onEnter={onBeforeEnter}
          >
            {children}
          </CSSTransition>
        </SwitchTransition>
      );
    }
    return (
      <CSSTransition
        in={show}
        classNames={name}
        timeout={timeout}
        unmountOnExit
        onEnter={onBeforeEnter}
      >
        {children}
      </CSSTransition>
    );
  };
}

export function createJavascriptTransition(
  name: string,
  functions: Recordable,
  transitionMode: Mode = 'in-out',
) {
  return function (props: TransitionProp) {
    const { mode = transitionMode, children, ...otherProps } = props;
    return (
      <Transition
        name={name}
        mode={mode}
        {...otherProps}
        onEnter={functions.beforeEnter}
        onEntering={functions.enter}
        onExit={functions.leave}
        onExited={functions.afterLeave}
        addEndListener={(node, done) => {
          // use the css transitionend event to mark the finish of a transition
          node.addEventListener('transitionend', done, false);
        }}
      >
        {children}
      </Transition>
    );
  };
}
