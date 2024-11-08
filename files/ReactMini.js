/*
模拟React的简单实现

关键概念讲解
React.createElement：通过 createElement 创建虚拟 DOM 树，构造包含 type 和 props 的对象表示节点。
Fiber架构：使用 fiberRoot 和 currentFiber 来模拟 Fiber 树，协调和更新 DOM。
Reconciliation：reconcile 方法在更新 DOM 时进行最小化对比和修改，基于新旧虚拟 DOM 树的差异执行必要的更新。
调度与优先级控制：schedule 和 runTasks 使用 requestIdleCallback 进行空闲时间调度，模拟 React 调度器控制更新任务的优先级。
Hooks实现：实现了 useState 和 useEffect，在组件中管理状态和副作用。通过 hooks 数组存储 Hook 状态，每次 rerender 时重新计算状态和副作用。
事件系统：addEventListener 简化了事件绑定，并支持 JSX 风格的 onClick 事件处理器。
生命周期管理：useEffect 模拟了 React 的副作用 Hook，可以在依赖项发生变化时触发回调。
并发模式：通过 requestIdleCallback 模拟并发模式，利用空闲时间分批执行任务，避免阻塞浏览器渲染。

如何使用
代码中的 App 是一个包含 Counter 组件的应用，每当点击按钮时会更新计数器。
useState 负责管理 count 的状态，useEffect 监控 count 的变化并在控制台打印更新信息。
rerender 函数会在组件状态变更时触发，重新执行协调和渲染操作。
这个简化版涵盖了 React 的大部分关键机制，你可以根据它理解 React 各个模块的工作原理。
*/

  // === React.createElement ===
  // 创建虚拟DOM元素
  function createElement(type, props = {}, ...children) {
    return { type, props: { ...props, children } };
  }
  
  // === Fiber ===
  // 使用一个全局的 fiberRoot 来模拟Fiber树
  let fiberRoot = null;
  let currentFiber = null;
  
  // === Reconciliation ===
  // 对比新旧虚拟DOM树并进行最小化更新
  function reconcile(newVnode, oldFiber, container) {
    if (!oldFiber) {
      mount(newVnode, container);
    } else if (newVnode.type !== oldFiber.type) {
      container.removeChild(oldFiber.dom);
      mount(newVnode, container);
    } else {
      updateElement(oldFiber.dom, newVnode.props, oldFiber.props);
      oldFiber.child = reconcile(newVnode.props.children[0], oldFiber.child, oldFiber.dom);
      oldFiber.sibling = reconcile(newVnode.props.children[1], oldFiber.sibling, oldFiber.dom);
    }
    return oldFiber;
  }
  
  // === 调度与优先级控制 ===
  const tasks = [];
  let taskId = 0;
  
  function schedule(task) {
    tasks.push({ id: taskId++, task });
    if (tasks.length === 1) requestIdleCallback(runTasks);
  }
  
  function runTasks(deadline) {
    while (tasks.length && deadline.timeRemaining() > 1) {
      const { task } = tasks.shift();
      task();
    }
    if (tasks.length) requestIdleCallback(runTasks);
  }
  
  // === Hooks 实现 ===
  let hookIndex = 0;
  const hooks = [];
  
  function useState(initialValue) {
    const state = hooks[hookIndex] || initialValue;
    const _hookIndex = hookIndex;
  
    function setState(newValue) {
      hooks[_hookIndex] = newValue;
      rerender();
    }
  
    hookIndex++;
    return [state, setState];
  }
  
  // === 事件系统 ===
  function addEventListener(target, type, listener) {
    target.addEventListener(type, listener);
  }
  
  // === 生命周期管理 ===
  function useEffect(effect, deps) {
    const oldDeps = hooks[hookIndex];
    const hasChanged = oldDeps ? !deps.every((dep, i) => dep === oldDeps[i]) : true;
    if (hasChanged) effect();
    hooks[hookIndex] = deps;
    hookIndex++;
  }
  
  // === Concurrent Mode ===
  function rerender() {
    hookIndex = 0;
    fiberRoot = reconcile(fiberRoot.vnode, fiberRoot, fiberRoot.container);
  }
  
  function mount(vnode, container) {
    const fiber = { vnode, container, dom: null };
    fiberRoot = fiber;
  
    schedule(() => {
      fiber.dom = render(fiber.vnode, container);
      container.appendChild(fiber.dom);
    });
  }
  
  function render(vnode, container) {
    if (typeof vnode === "string") return document.createTextNode(vnode);
  
    const el = document.createElement(vnode.type);
    Object.entries(vnode.props || {}).forEach(([key, value]) => {
      if (key.startsWith("on")) addEventListener(el, key.slice(2).toLowerCase(), value);
      else if (key !== "children") el[key] = value;
    });
  
    (vnode.props.children || []).forEach(child => {
      el.appendChild(render(child));
    });
  
    return el;
  }
  
  // === 应用示例 ===
  function Counter() {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      console.log("Counter updated:", count);
    }, [count]);
  
    return createElement(
      "div",
      {},
      createElement("h1", {}, "Count: ", count),
      createElement("button", { onClick: () => setCount(count + 1) }, "Increase")
    );
  }
  
  function App() {
    return createElement("div", {}, createElement("h2", {}, "Simple React"), createElement(Counter));
  }
  
  // 初始化
  const container = document.getElementById("root");
  fiberRoot = { vnode: App(), container };
  rerender();
  