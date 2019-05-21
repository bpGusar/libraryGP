import Baobab from 'baobab';

export const PARAMS = {
  LOADED: 'loaded',
};

const store = new Baobab({
  [PARAMS.LOADED]: false,
});

store.on('update', function(e) {
  if (process.env.NODE_ENV === 'development') {
    const eventData = e.data;
    const titleLog = `color: black; font-weight: bold;`;
    const blueLog = `color: blue; font-style: italic;`;

    console.groupCollapsed('Store changed:  ', eventData.paths.map((path) => path[0]).join(', '));
    //console.log('Affected paths', eventData.paths);
    console.log('%cCurrent data:', titleLog, eventData.currentData);
    console.log('%cPrevious data:', titleLog, eventData.previousData);
    //console.log('Transaction details:', eventData.transaction);
    console.group('Transaction details: ');
    eventData.transaction.forEach((t) => {
      console.groupCollapsed('transaction: ');
      console.log(`%cchange type: %c${t.type};`, titleLog, blueLog);
      console.log(`%cchanged param: %c${t.path.join(', ')}`, titleLog, blueLog);
      console.log(`%cnew value: %c${t.value}`, titleLog, blueLog);
      console.groupEnd();
    });
    console.groupEnd();
    console.groupEnd();
  }
});

export default store;
