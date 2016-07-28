import _ from 'underscore';

function translateRow(columnGroup, row) {
  if (_.has(row, 'html')) {
    return {
      classes: row.classes,
      cells: [{
        rowspan: 1,
        colspan: columnGroup.width,
        html: row.html,
      }],
    };
  }
  if (_.has(row, 'item')) {
    return {
      classes: row.classes,
      cells: _.map(columnGroup.leafColumns, col => (row.item[col.name] || {})),
    };
  }
  return row;
}

export function cells(state) {
  const {
    headRows,
    bodyRows,
    footRows,
    columnGroup,
  } = state;

  state.headRows = _.reduce(headRows, (memo, row) => {
    if (row === 'column-header-rows') {
      return memo.concat(columnGroup.headerRows);
    }
    memo.push(translateRow(columnGroup, row));
    return memo;
  }, []);

  state.bodyRows = _.map(bodyRows, row => translateRow(columnGroup, row));
  state.footRows = _.map(footRows, row => translateRow(columnGroup, row));

  return state;
}
