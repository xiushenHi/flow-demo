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

function initFlow(flowConfigs) {
  const mainWorkFlow = new AsyncSeriesHook(["context"]);
  const hook_params_define = ["context"];
  if (
    Object.prototype.toString.call(flowConfigs) !== "[object Array]" ||
    flowConfigs.length === 0
  ) {
    throw new Error("flow config error!");
  }
  flowConfigs.forEach((flowNode) => {
    const [flowNodeName, flowAopDefs] = flowNode;
    mainWorkFlow.tapPromise(flowNodeName, (ctx) => {
      return new Promise((resolve) => {
        if (Object.prototype.toString.call(flowAopDefs) !== "[object Array]") {
          throw new Error("flow type error!");
        }
        const flowNodes = [];
        flowAopDefs.forEach((aop) => {
          let hooker;
          const [aopName, handlers, configs = {}] = aop;
          if (configs.type === "AsyncSeriesBailHook") {
            hooker = new AsyncSeriesBailHook(hook_params_define);
          } else {
            hooker = new AsyncSeriesHook(hook_params_define);
          }
          flowNodes.push(hooker);
          generateFlowNode(hooker, handlers, `${flowNodeName}@${aopName}`);
        });
        flowNodes.reduce((preNode, curNode, index) => {
          if (!preNode) {
            return curNode.promise(ctx);
          }
          const _def = preNode.then(() => curNode.promise(ctx));
          if (index === flowNodes.length - 1) {
            _def.then(resolve);
          }
          return _def;
        }, null);
      });
    });
  });
  return mainWorkFlow;
}

export default function run(flowConfigs, ctx) {
  initFlow(flowConfigs).promise(ctx);
}
