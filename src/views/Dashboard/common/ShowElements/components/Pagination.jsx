import React from "react";
import { Pagination, Icon } from "semantic-ui-react";

export default function PaginationBlock(props) {
  const { page, limit, maxElements, onPageChange } = props;
  return (
    <Pagination
      activePage={page}
      ellipsisItem={{
        content: <Icon name="ellipsis horizontal" />,
        icon: true
      }}
      firstItem={{
        content: <Icon name="angle double left" />,
        icon: true
      }}
      lastItem={{
        content: <Icon name="angle double right" />,
        icon: true
      }}
      prevItem={{ content: <Icon name="angle left" />, icon: true }}
      nextItem={{ content: <Icon name="angle right" />, icon: true }}
      totalPages={Math.ceil(maxElements / limit)}
      onPageChange={(e, data) => onPageChange(data)}
    />
  );
}
