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
  for(let prop in maptor) {

    const maptorProp = maptor[prop]
        , objProp = obj[prop];

    if(typeof maptorProp === 'string') {
      newObj[prop] = obj[maptorProp];

    } else if(typeof maptorProp === 'number') {
      if(maptorProp === 1) {
        newObj[prop] = objProp;
      }
    } else if(typeof objProp === 'object' && typeof maptorProp === 'object') {
      newObj[prop] = MC.map(obj[prop], maptor[prop])

    } else {
      const newProp = maptorProp(objProp, prop);
      if(newProp !== undefined) {
        newObj[prop] = newProp;
      }
    }
  }

  return newObj;
}

module.exports = MC;
