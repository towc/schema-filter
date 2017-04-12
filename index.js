var MaptorConsumer = {}
  , MC = MaptorConsumer;

MC.map = function( obj, maptor ) {

  if( obj.constructor === Array && maptor.constructor === Array )
    return obj.map( function( item ){ return MC.maptor( item, maptor[0] )})

  var newObj = {};
  for( var prop in obj ) {
    if( maptor.hasOwnProperty( prop ) ) {

      var maptorProp = maptor[ prop ]
        , objProp = obj[ prop ];

      if( typeof objProp === 'object' && typeof maptorProp === 'object' ){
        newObj[ prop ] = MC.maptor( obj[ prop ], maptor[ prop ] )
      } else {
        var newProp = maptorProp( objProp );
        if( newProp !== void(0) )
          newObj[ prop ] = newProp;
      }
    }
  }

  return newObj;
}

module.exports = MC;
