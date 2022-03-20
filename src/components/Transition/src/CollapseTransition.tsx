import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { addClass, removeClass } from '/@/utils/domUtils';

interface CollapseTransitionProp {
  show?: boolean;
}

const CollapseTransition: React.FC<CollapseTransitionProp> = (props) => {
  const { show = true } = props;
  const method = {
    onEnter(el) {
      if (!el) return;
      addClass(el, 'collapse-transition');
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;

      el.style.height = '0';
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },

    onEntering(el) {
      if (!el) return;
      el.dataset.oldOverflow = el.style.overflow;
      if (el.scrollHeight !== 0) {
        el.style.height = `${el.scrollHeight}px`;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = '';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }

      el.style.overflow = 'hidden';
    },

    onEntered(el) {
      if (!el) return;
      removeClass(el, 'collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
    },

    onExit(el) {
      if (!el) return;
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      el.style.height = `${el.scrollHeight}px`;
      el.style.overflow = 'hidden';
    },

    onExiting(el) {
      if (!el) return;
      if (el.scrollHeight !== 0) {
        addClass(el, 'collapse-transition');
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
    },

    onExited(el) {
      removeClass(el, 'collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    },
  };
  return (
    <CSSTransition
      in={show}
      addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
      unmountOnExit
      {...method}
    >
      {props.children}
    </CSSTransition>
  );
};

export default CollapseTransition;
