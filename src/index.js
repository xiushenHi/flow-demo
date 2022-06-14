import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesLoopHook,
  AsyncSeriesWaterfallHook,
  HookMap,
  MultiHook,
} from "tapable";

import Router from "./plugins/router";

import GetPageData from "./plugins/pageData";

import Render from "./plugins/render";

function generateFlowNode(hook, fns, namespace = "default") {
  if (!hook || !fns) {
    return false;
  }

  fns &&
    fns.forEach((row) => {
      const [_name, _handler] = row;
      hook.tapPromise(`${namespace}@${_name}`, _handler);
    });
}

// AsyncSeriesBailHook
const mainWorkFlow = new AsyncSeriesHook(["context"]);

const ctx = (function () {
  const data = {
    abc: "test",
  };
  return {
    get: function (key) {
      if (!key) {
        throw new Error("read context key is required~");
      }
      return data[key];
    },
    set: function (value, key, prop) {
      if (!key) {
        throw new Error("write context key is required~");
      }
      console.log(key);
    },
  };
})();

[Router, GetPageData, Render].forEach((middleware) => {
  const [middlewareName, middlewareOptions] = middleware;

  mainWorkFlow.tapPromise(middlewareName, (ctx) => {
    return new Promise((resolve) => {
      const { beforeHandlers, bailApplyHandlers, afterHandlers } =
        middlewareOptions;

      const beforeHooks = new AsyncSeriesHook(["context"]);
      const afterHooks = new AsyncSeriesHook(["context"]);
      const applyHooks = new AsyncSeriesBailHook(["context"]);

      generateFlowNode(beforeHooks, beforeHandlers, middlewareName);

      generateFlowNode(applyHooks, bailApplyHandlers, middlewareName);

      generateFlowNode(afterHooks, afterHandlers, middlewareName);

      beforeHooks
        .promise(ctx)
        .then(() => applyHooks.promise(ctx))
        .then(() => afterHooks.promise(ctx))
        .then(resolve);
    });
  });
});

mainWorkFlow.promise(ctx);
