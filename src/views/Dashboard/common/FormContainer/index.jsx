import React from "react";
import { Segment, Header } from "semantic-ui-react";

import PaginationBlock from "@commonViews/Pagination";

/**
 * 
 * @param {*} props 
 * @example 
 * <FormContainer
        formHeader="blablabla"
        formLoading={isLoading}
        resultLoading={isLoading}
        showPagination
        pagMaxElements={maxElements}
        pagLimit={options.limit}
        pagPage={options.page}
        pagOnPageChange={this.handlePageChange}
        form={() => ()}
        result={() => ()}
     />
 */

export default function FormContainer(props) {
  const {
    formHeader,
    formLoading,
    resultLoading,
    form,
    result,
    showPagination,
    pagMaxElements,
    pagLimit,
    pagPage,
    pagOnPageChange
  } = props;
  return (
    <Segment.Group>
      <Segment>
        <Header as="h3">{formHeader}</Header>
      </Segment>
      <Segment loading={formLoading}>{form()}</Segment>
      <Segment loading={resultLoading}>{result()}</Segment>
      {showPagination && Number(pagMaxElements) > pagLimit && (
        <Segment>
          <PaginationBlock
            onPageChange={pagOnPageChange}
            page={pagPage}
            limit={pagLimit}
            maxElements={pagMaxElements}
          />
        </Segment>
      )}
    </Segment.Group>
  );
}
