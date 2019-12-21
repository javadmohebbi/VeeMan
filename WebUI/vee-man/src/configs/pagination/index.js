import _ from 'lodash'

export const GetPaginatedItems = (items, page=1, pageSize=10) => {
  var pg = page || 1,
    pgSize = pageSize || 100,
    offset = (pg - 1) * pgSize,
    pagedItems = _.drop(items, offset).slice(0, pgSize);

  // console.log(pagedItems);
  return {
    page: pg,
    pageSize: pgSize,
    total: items.length,
    total_pages: Math.ceil(items.length / pgSize),
    data: pagedItems
  };
}
