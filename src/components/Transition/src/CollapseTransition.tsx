import React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { addClass, removeClass } from '/@/utils/domUtils';

const CollapseTransition: React.FC = (props) => {
  const method = {
    onEnter(el) {
      addClass(el, 'collapse-transition');
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;

      el.style.height = '0';
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },

    onEntering(el) {
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
      removeClass(el, 'collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
    },

    onExit(el) {
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      el.style.height = `${el.scrollHeight}px`;
      el.style.overflow = 'hidden';
    },

    onExiting(el) {
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
    <SwitchTransition mode="out-in">
      <CSSTransition
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
        unmountOnExit
        {...method}
      >
        {props.children}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default CollapseTransition;
