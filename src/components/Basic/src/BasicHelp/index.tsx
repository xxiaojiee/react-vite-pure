import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getPopupContainer } from '/@/utils';
import { isString, isArray } from '/@/utils/is';
import { useDesign } from '/@/hooks/web/useDesign';
import './index.less';

interface BasicHelpProp {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth?: string | number;
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex?: boolean;
  /**
   * Help text font color
   * @default: #ffffff
   */
  color?: string;
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize?: string | number;
  /**
   * Help text list
   */
  placement?: string;

  className?: string;
  /**
   * Help text list
   */
  text: string[] | string;
}

const BasicHelp: React.FC<BasicHelpProp> = (props) => {
  const {
    maxWidth = '600px',
    color = '#ffffff',
    fontSize = '14px',
    placement = 'right',
    text,
    showIndex,
  } = props;

  const { prefixCls } = useDesign('basic-help');

  const getTooltipStyle = (): React.CSSProperties => ({ color, fontSize });

  const getOverlayStyle = (): React.CSSProperties => ({ maxWidth });

  function renderTitle() {
    const textList = text;

    if (isString(textList)) {
      return <p>{textList}</p>;
    }

    if (isArray(textList)) {
      return textList.map((te, index) => {
        return (
          <p key={te}>
            <>
              {showIndex ? `${index + 1}. ` : ''}
              {te}
            </>
          </p>
        );
      });
    }
    return null;
  }

  return (
    <Tooltip
      className={props.className || ''}
      overlayClassName={`${prefixCls}__wrap`}
      title={<div style={getTooltipStyle()}>{renderTitle()}</div>}
      autoAdjustOverflow
      overlayStyle={getOverlayStyle()}
      placement={placement as 'right'}
      getPopupContainer={() => getPopupContainer()}
    >
      <span className={prefixCls}>{props.children || <InfoCircleOutlined />}</span>
    </Tooltip>
  );
};

export default BasicHelp;
