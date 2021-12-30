import React from 'react';
import { useDesign } from '/@/hooks/web/useDesign';
import logoBoxBg from '/@/assets/svg/login-box-bg.svg';
import './index.less';

const Login: React.FC = () => {
  const { prefixCls } = useDesign('login');
  return (
    <div className={`${prefixCls} relative w-full h-full px-4`}>
      <div className="absolute text-white top-4 right-4 enter-x xl:text-gray-600">1</div>
      <div className="absolute top-3 right-7 enter-x">2</div>
      <span className="-enter-x xl:hidden">logo</span>
      <div className="container relative h-full py-2 mx-auto sm:px-10">
        <div className="flex h-full">
          <div className="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
            <div className="-enter-x">AppLogo</div>
            <div className="my-auto">
              <img src={logoBoxBg} className="w-1/2 -mt-16 -enter-x" />
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
