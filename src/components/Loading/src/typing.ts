import type { SpinProps } from 'antd';
import { SizeEnum } from '/@/enums/sizeEnum';
import { ThemeEnum } from '/@/enums/appEnum';

export interface LoadingProps extends SpinProps {
  tip: string;
  size?: SizeEnum;
  absolute?: boolean;
  loading?: boolean;
  background?: string;
  theme?: ThemeEnum;
}
