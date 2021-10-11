import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { theme } from '/@/common/theme';

const ItemMap: {
  [k: string]: {
    props: { [k: string]: any };
    rules: any[];
  };
} = {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: (
        <UserOutlined
          style={{
            color: theme.colors.disabledColor,
            fontSize: theme.fontSizes.base,
          }}
        />
      ),
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: (
        <LockTwoTone
          style={{
            color: theme.colors.disabledColor,
            fontSize: theme.fontSizes.base,
          }}
        />
      ),
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: (
        <MobileTwoTone
          style={{
            color: theme.colors.disabledColor,
            fontSize: theme.fontSizes.base,
          }}
        />
      ),
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: (
        <MailTwoTone
          style={{
            color: theme.colors.disabledColor,
            fontSize: theme.fontSizes.base,
          }}
        />
      ),
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};

export default ItemMap;
