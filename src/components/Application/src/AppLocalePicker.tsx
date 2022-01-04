import React from 'react';
import classNames from 'classnames';
import { localeList, LOCALE } from '/@/settings/localeSetting';
import { useDesign } from '/@/hooks/web/useDesign';
import language from '/@/assets/images/language.png';
import './AppLocalePicker.less';

interface AppLocalePickerProp {
  /**
   * Whether to display text
   */
  showText?: boolean;
  /**
   * Whether to refresh the interface when changing
   */
  reload?: boolean;
}

const AppLocalePicker: React.FC<AppLocalePickerProp> = (props) => {
  const { showText = true, reload } = props;
  const { prefixCls } = useDesign('app-locale');
  const getLocaleText = () => {
    const key = LOCALE.ZH_CN;
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  };
  const localeClass = classNames('cursor-pointer flex items-center', prefixCls);
  return (
    <span className={localeClass}>
      <img src={language} alt="" />
      {showText ? <span className="ml-1">{getLocaleText()}</span> : null}
    </span>
  );
};

export default AppLocalePicker;
