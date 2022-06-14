export default [
  "router",
  {
    beforeHandlers: [
      [
        "before1",
        function () {
          console.log("router before 01");
          return Promise.resolve();
        },
      ],
      [
        "before2",
        function () {
          console.log("router before 02");
          return Promise.resolve();
        },
      ],
    ],
    bailApplyHandlers: [
      [
        "routerApply01",
        function () {
          console.log("router apply 01");
          return Promise.resolve();
        },
      ],
      [
        "routerApply02",
        function () {
          console.log("router apply 02");
          return Promise.resolve();
        },
      ],
      [
        "routerApply03",
        function () {
          console.log("router apply 03");
          return Promise.resolve(true);
        },
      ],
      [
        "routerApply04",
        function () {
          console.log("router apply 04, won't see this message");
          return Promise.resolve();
        },
      ],
    ],
    afterHandlers: [
      [
        "after1",
        function () {
          console.log("router after 01");
          return Promise.resolve();
        },
      ],
      [
        "after2",
        function () {
          console.log("router after 02");
          return Promise.resolve();
        },
      ],
    ],
  },
];
