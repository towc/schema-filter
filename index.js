const MaptorConsumer = {}
    , MC = MaptorConsumer;

MC.map = (obj, maptor) => {

  if(typeof maptor === 'function') {
    return maptor(obj);
  }

  if(obj.constructor === Array && maptor.constructor === Array) {
    return obj.map((item) =>  MC.map(item, maptor[0]));
  }

  const newObj = {};
  for(let prop in obj) {
    if(maptor.hasOwnProperty(prop)) {

      const maptorProp = maptor[prop]
          , objProp = obj[prop];

      if(typeof objProp === 'object' && typeof maptorProp === 'object') {
        newObj[prop] = MC.map(obj[prop], maptor[prop])

      } else {
        const newProp = maptorProp(objProp);
        if(newProp !== undefined) {
          newObj[ prop ] = newProp;
        }
      }
    }
  }

  return newObj;
}

module.exports = MC;
