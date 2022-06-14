export default [
  "pageData",
  {
    beforeHandlers: [
      
    ],
    bailApplyHandlers: [
      ['render', function(ctx){
        console.log('render ctx', ctx)
        return Promise.resolve()
      }]
    ],
    afterHandlers: [

    ],
  },
];
