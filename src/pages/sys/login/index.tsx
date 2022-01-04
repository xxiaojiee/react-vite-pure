import React from 'react';
import { useDesign } from '/@/hooks/web/useDesign';
import { useStoreState } from '/@/store';
import { getGlobSetting } from '/@/hooks/setting';
import logoBoxBg from '/@/assets/svg/login-box-bg.svg';
import Application from '/@/components/Application';
import './index.less';

const { AppLogo, AppLocalePicker, AppDarkModeToggle } = Application;

interface LoginProps {
  sessionTimeout: boolean;
}

const Login: React.FC<LoginProps> = (props) => {
  const { sessionTimeout } = props;
  const { prefixCls } = useDesign('login');
  const localeState = useStoreState('locale');
  const globSetting = getGlobSetting();
  const showLocale = !!localeState.localInfo?.showPicker;
  const title = globSetting?.title ?? '';
  return (
    <div className={`${prefixCls} relative w-full h-full px-4`}>
      {!sessionTimeout && showLocale ? (
        <div className="absolute text-white top-4 right-4 enter-x xl:text-gray-600">
          <AppLocalePicker showText={false} />
        </div>
      ) : null}
      {!sessionTimeout ? (
        <div className="absolute top-3 right-13 enter-x">
          <AppDarkModeToggle />
        </div>
      ) : null}
      <span className="-enter-x xl:hidden">
        <AppLogo alwaysShowTitle />
      </span>
      <div className="container relative h-full py-2 mx-auto sm:px-10">
        <div className="flex h-full">
          <div className="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
            <div className="-enter-x">
              <AppLogo />
            </div>
            <div className="my-auto">
              <img src={logoBoxBg} alt={title} className="w-1/2 -mt-16 -enter-x" />
              <div className="mt-10 font-medium text-white -enter-x">
                <span className="inline-block mt-4 text-3xl"> 开箱即用的中后台管理系统</span>
              </div>
              <div className="mt-5 font-normal text-white text-md dark:text-gray-500 -enter-x">
                输入您的个人详细信息开始使用！
              </div>
            </div>
          </div>
          <div className="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
            <div
              className={`${prefixCls}-form relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x`}
            >
              内容
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
