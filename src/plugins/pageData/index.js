export default [
  "pageData",
  {
    beforeHandlers: [
      
    ],
    bailApplyHandlers: [
      ['xxx', function(ctx){
        console.log('pagedata ctx', ctx)
        return Promise.resolve()
      }]
    ],
    afterHandlers: [

    ],
  },
];
