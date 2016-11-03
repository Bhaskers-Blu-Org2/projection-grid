import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';

let expect = chai.expect;
let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);
let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
  },
  columns: [
    {
      name: 'UserName',
      sortable: true,
    },
    {
      name: 'FirstName',
    },
    {
      name: 'LastName',
    },
    {
      name: 'Gender',
    },
  ],
};

let pgrid;
let pgridFactory;
let gridView;

describe('columns config for non-vnext', function () {
  let headRowSelector = '#container .grid thead .table__row--header';
  let bodyRowSelector = '#container .grid tbody .table__row--body';

  this.timeout(100000);
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('shifter should works as expected for non-vnext', function (done) {
    let shifterConfig = {
      columnShifter: {
        totalColumns: 4,
      },
    };

    gridView = pgridFactory
      .create(_.extend(shifterConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(headRowSelector)
      .then((result) => {
        let firstHeadCell = result.first().find('th').first();
        expect(firstHeadCell.hasClass('col-skip-less')).to.be.true;
        let lastHeadCell = result.first().find('th').last();
        expect(lastHeadCell.hasClass('col-skip-more')).to.be.true;
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        _.each(result, (rowItem) => {
          let firstTdCell = $(rowItem).find('td').first();
          expect(firstTdCell.hasClass('col-skip-less')).to.be.true;
          let lastTdCell = $(rowItem).find('td').last();
          expect(lastTdCell.hasClass('col-skip-more')).to.be.true;
        })
      })
      .then(done)
      .catch(console.log);
  });

  it('sortable should works as expected for non-vnext', function (done) {
    let expectData = _.map(memoryData, (item) => {
      return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender');
    });

    gridView = pgridFactory
      .create(_.extend(gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(bodyRowSelector)
      .then((result) => {
        let assertion = util.validateElementMatrix(result, expectData);
        expect(assertion).to.be.true;
        return driver.element(headRowSelector);
      })
      .then((result) => {
        return driver.click(result.first().find('th').first());
      })
      .then(() => {
        return driver.pause(10);
      })
      .then(() => {
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        let sortedData = _.sortBy(expectData, 'UserName');
        let assertion = util.validateElementMatrix(result, sortedData);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  // need jsdata support
  // it('pop should works as expected for non-vnext', function (done) {
  //   let popConfig = {
  //     columnGroup: {
  //       ConcatName: ['FirstName', 'LastName'],
  //     },
  //     enablePoP: true,
  //   };

  //   gridView = pgridFactory
  //     .create(_.extend(popConfig, gridConfig))
  //     .gridView
  //     .render({fetch: true});
  //   driver.element(headRowSelector)
  //     .then((result) => {
  //       console.log('test');
  //     })
  //     .then(done)
  //     .catch(console.log);
  // });
});
