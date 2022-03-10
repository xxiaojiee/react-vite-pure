import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
  Transition as TransitionCom,
} from 'react-transition-group';

type Mode = 'in-out' | 'out-in';

interface TransitionProp {
  show?: boolean; // 是否进入
  name: string; // 是否进入
  group?: boolean; // 是否使用TransitionGroup
  switched?: boolean; // 是否使用SwitchTransition
  mode?: Mode;
  origin?: string;
  className?: string;
  timeout?: number;
  children: any;
}

export const Transition = (props: TransitionProp, ) => {
  const {
    group = false,
    switched = false,
    show = false,
    timeout = 300,
    mode,
    origin,
    className,
    children,
    name,
  } = props;
  const onBeforeEnter = (el: HTMLElement) => {
    if (origin) {
      el.style.transformOrigin = origin;
    }
  };
  if (group) {
    return (
      <TransitionGroup className={className}>
        {React.Children.map(children, (cheild) => (
          <CSSTransition timeout={timeout} classNames={name} unmountOnExit onEnter={onBeforeEnter}>
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
          className={className}
          addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          classNames={name}
          unmountOnExit
          onEnter={onBeforeEnter}
        >
          {() => React.cloneElement(children)}
        </CSSTransition>
      </SwitchTransition>
    );
  }
  return (
    <CSSTransition
      in={show}
      classNames={name}
      className={className}
      timeout={timeout}
      unmountOnExit
      onEnter={onBeforeEnter}
    >
      {() => React.cloneElement(children)}
    </CSSTransition>
  );
};

export function createSimpleTransition(
  name: string,
  origin = 'top center 0',
  mode: Mode = 'out-in',
) {
  return function (props) {
    return <Transition name={name} origin={origin} mode={mode} {...props} />;
  };
}

export function createJavascriptTransition(
  name: string,
  functions: Recordable,
  transitionMode: Mode = 'in-out',
) {
  return function (props: TransitionProp) {
    const { name: names, mode = transitionMode, children, ...otherProps } = props;
    return (
      <TransitionCom
        name={names || name}
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
      </TransitionCom>
    );
  };
}
