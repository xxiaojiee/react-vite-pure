import React from 'react';
import classNames from 'classnames';
import { localeList, LOCALE } from '/@/settings/localeSetting';
import { useDesign } from '/@/hooks/web/useDesign';
import { Icon } from '/@/components/Icon';
import './index.less';

interface AppLocalePickerProp {
  /**
   * Whether to display text
   */
  showText?: boolean;
  /**
   * Whether to refresh the interface when changing
   */
  // reload?: boolean;
  className?: string;
}

const AppLocalePicker: React.FC<AppLocalePickerProp> = (props) => {
  const { showText = true, className } = props;
  const { prefixCls } = useDesign('app-locale');
  const getLocaleText = () => {
    const key = LOCALE.ZH_CN;
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  };
  const localeClass = classNames('cursor-pointer flex items-center', prefixCls, className);
  return (
    <span className={localeClass}>
      <Icon icon="ion:language" />
      {showText ? <span className="ml-1">{getLocaleText()}</span> : null}
    </span>
  );
};

export default AppLocalePicker;
