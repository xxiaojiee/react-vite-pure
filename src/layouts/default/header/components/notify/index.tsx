import React, { useMemo } from 'react';
import { Popover, Tabs, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { tabListData, ListItemProp } from './data';
import NoticeList from './NoticeList';
import { useDesign } from '/@/hooks/web/useDesign';
import { getMessage } from '/@/hooks/web/getMessage';
import classNames from 'classnames';

import './index.less';

const { TabPane } = Tabs;

interface NotifyProp {
  className?: string;
}

const Notify: React.FC<NotifyProp> = (props) => {
  const { className } = props;
  const { prefixCls } = useDesign('header-notify');
  const { createMessage } = getMessage();

  const getCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < tabListData.length; i++) {
      count += tabListData[i].list.length;
    }
    return count;
  }, []);

  const onNoticeClick = (record: ListItemProp) => {
    createMessage.success(`你点击了通知，ID=${record.id}`);
    // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
    // record.titleDelete = !record.titleDelete;
  };

  return (
    <div className={classNames(prefixCls, className)}>
      <Popover
        title=""
        trigger="click"
        overlayClassName={`${prefixCls}__overlay`}
        content={
          <Tabs>
            {tabListData.map((item) => (
              <TabPane
                key={item.key}
                tab={
                  <>
                    {item.name}
                    <span v-if="item.list.length !== 0">({item.list.length})</span>
                  </>
                }
              >
                {/* 绑定title-click事件的通知列表中标题是“可点击”的 */}
                {item.key === '1' ? (
                  <NoticeList list={item.list} onTitleClick={onNoticeClick} />
                ) : (
                  <NoticeList list={item.list} />
                )}
              </TabPane>
            ))}
          </Tabs>
        }
      >
        <Badge count={getCount} dot>
          <BellOutlined />
        </Badge>
      </Popover>
    </div>
  );
};

export default Notify;
