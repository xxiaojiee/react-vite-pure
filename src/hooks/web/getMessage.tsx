import React from 'react';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { Modal, message as Message, notification } from 'antd';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import { NotificationApi } from 'antd/lib/notification';
import { isString } from '/@/utils/is';


export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled className="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled className="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled className="modal-icon-info" />;
  } else {
    return <CloseCircleFilled className="modal-icon-error" />;
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div dangerouslySetInnerHTML={{ __html: `<div>${content as string}</div>` }} />;
  } else {
    return content;
  }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx) {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  };
  return Modal.confirm(opt);
}

const getBaseOptions = () => {
  return {
    okText: '确认',
    centered: true,
  };
};

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'));
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'));
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'));
}

notification.config({
  placement: 'topRight',
  duration: 3,
});

/**
 * @description: message
 */
export function getMessage() {
  return {
    createMessage: Message,
    notification: notification as NotificationApi,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
