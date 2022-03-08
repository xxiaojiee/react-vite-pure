import React, { useEffect, useMemo, useState } from 'react';
import { ListItemProp } from '../data';
import { useDesign } from '/@/hooks/web/useDesign';
import { List, Avatar, Tag, Typography } from 'antd';
import { isNumber } from '/@/utils/is';

import './index.less';

const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;
const TypographyParagraph = Typography.Paragraph;

interface NoticeListProp {
  list?: ListItemProp[];
  pageSize?: number;
  currentPage?: number;
  titleRows?: number;
  descRows?: number;
  onTitleClick?: (e?: any) => void;
  onUpdateCurrentPage?: (e?: any) => void;
}

const NoticeList: React.FC<NoticeListProp> = (props) => {
  const {
    descRows = 2,
    titleRows = 1,
    currentPage = 1,
    pageSize = 5,
    list = [],
    onTitleClick,
    onUpdateCurrentPage,
  } = props;
  const { prefixCls } = useDesign('header-notify-list');
  const [current, setCurrent] = useState(currentPage || 1);
  const getData = useMemo(() => {
    if (pageSize === 0) return [];
    const size = isNumber(pageSize) ? pageSize : 5;
    return list.slice(size * (current - 1), size * current);
  }, [current, list, pageSize]);
  useEffect(() => {
    setCurrent(currentPage);
  }, [currentPage]);
  const isTitleClickable = !!onTitleClick;

  const getPagination = useMemo(() => {
    if (pageSize > 0 && list && list.length > pageSize) {
      return {
        total: list.length,
        pageSize,
        // size: 'small',
        current,
        onChange(page) {
          setCurrent(page);
          onUpdateCurrentPage && onUpdateCurrentPage(page);
        },
      };
    }
    return undefined;
  }, [current, list, onUpdateCurrentPage, pageSize]);

  function handleTitleClick(item: ListItem) {
    onTitleClick && onTitleClick(item);
  }
  return (
    <List className={prefixCls} bordered pagination={getPagination}>
      {getData.map((item) => (
        <ListItem key={item.id} className="list-item">
          <ListItemMeta
            title={
              <div className="title">
                <TypographyParagraph
                  onClick={() => handleTitleClick(item)}
                  style={{
                    width: '100%',
                    marginBottom: '0 !important',
                    cursor: isTitleClickable ? 'pointer' : '',
                  }}
                  delete={!!item.titleDelete}
                  ellipsis={
                    titleRows && titleRows > 0 ? { rows: titleRows, tooltip: !!item.title } : false
                  }
                >
                  {item.title}
                </TypographyParagraph>
                {item.extra ? (
                  <div className="extra">
                    <Tag className="tag" color={item.color}>
                      {item.extra}
                    </Tag>
                  </div>
                ) : null}
              </div>
            }
            avatar={
              item.avatar ? (
                <Avatar className="avatar" src={item.avatar} />
              ) : (
                <span> {item.avatar}</span>
              )
            }
            description={
              <div>
                {item.description ? (
                  <div className="description">
                    <TypographyParagraph
                      style={{ width: '100%', marginBottom: '0 !important' }}
                      ellipsis={
                        descRows && descRows > 0
                          ? { rows: descRows, tooltip: !!item.description }
                          : false
                      }
                    >
                      {item.description}
                    </TypographyParagraph>
                  </div>
                ) : null}
                <div className="datetime">{item.datetime}</div>
              </div>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NoticeList;
