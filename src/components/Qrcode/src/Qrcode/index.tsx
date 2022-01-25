import React, { useCallback, useEffect, useRef } from 'react';
import { toCanvas, QRCodeRenderersOptions, LogoType } from '../qrcodePlus';
import { toDataURL } from 'qrcode';
import { downloadByUrl } from '/@/utils/file/download';

interface QrcodeProp {
  className?: string;
  value: string | any[];
  // 参数
  options?: QRCodeRenderersOptions;
  // 宽度
  width?: number;
  // 中间logo图标
  logo?: LogoType | string;
  // img 不支持内嵌logo
  tag?: 'canvas' | 'img';
}

const Qrcode: React.FC<QrcodeProp> = (props) => {
  const { width = 200, tag = 'canvas', value, options = {}, logo, className = '' } = props;
  const wrapImageRef = useRef<HTMLImageElement | null>(null);
  const wrapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const createQrcode = useCallback(async () => {
    try {
      const renderValue = String(value);
      if (tag === 'canvas') {
        const url: string = await toCanvas({
          canvas: wrapCanvasRef.current,
          width,
          logo: logo as any,
          content: renderValue,
          options: options || {},
        });
        const canvasConf = { url, ctx: (wrapCanvasRef.current as HTMLCanvasElement).getContext('2d') }
        return canvasConf;
      }

      if (tag === 'img') {
        const url = await toDataURL(renderValue, {
          errorCorrectionLevel: 'H',
          width,
          ...options,
        });
        (wrapImageRef.current as HTMLImageElement).src = url;
        return { url };
      }
    } catch (error) {
      console.error(error);
    }
  }, [logo, options, tag, value, width]);
  /**
   * file download
   */
  const download = useCallback(
    (fileName?: string) => {
      let url;
      if (tag === 'canvas') {
        url = wrapCanvasRef.current?.toDataURL();
      } else if (tag === 'img') {
        url = wrapImageRef.current?.src;
      }
      if (!url) return;
      downloadByUrl({
        url,
        fileName,
      });
    },
    [tag],
  );

  useEffect(() => {
    createQrcode();
  }, [props, createQrcode]);
  return (
    <div className={className}>
      {tag === 'canvas' ? <canvas ref={wrapCanvasRef} /> : <img ref={wrapImageRef} />}
    </div>
  );
};

export default Qrcode;
