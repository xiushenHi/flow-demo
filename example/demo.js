import runFlow from "../src/index";

const flowConfigs = [
  [
    "router",
    [
      [
        "before",
        [
          [
            "0001",
            function () {
              console.log("router before 01");
              return Promise.resolve();
            },
          ],
          [
            "0002",
            function () {
              console.log("router before 02");
              return Promise.resolve();
            },
          ],
        ],
      ],
      [
        "apply",
        [
          [
            "0001",
            function () {
              console.log("apply 01");
              return Promise.resolve();
            },
          ],
          [
            "0002",
            function () {
              console.log("apply02");
              return Promise.resolve(true);
            },
          ],
          [
            "0003",
            function () {
              console.log("!error! ----apply 03");
              return Promise.resolve();
            },
          ],
        ],
        { type: "AsyncSeriesBailHook" },
      ],
      [
        "after",
        [
          [
            "0001",
            function () {
              console.log("router after 01");
              return Promise.resolve();
            },
          ],
          [
            "0002",
            function () {
              console.log("router after 02");
              return Promise.resolve();
            },
          ],
        ],
      ],
    ],
  ],
];

runFlow(flowConfigs, {});
