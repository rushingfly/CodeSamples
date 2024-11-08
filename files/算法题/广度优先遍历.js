// 树结构
const tree = {
    id: 16,
    children: [
      {
        id: 0,
        children: [
          { id: 4, children: [] },
          { id: 5, children: [] },
          { id: 6, children: [{ id: 7, children: [] }] },
        ],
      },
      { id: 1, children: [] },
      {
        id: 2,
        children: [
          {
            id: 8,
            children: [
              { id: 12, children: [] },
              {
                id: 13,
                children: [{ id: 14, children: [{ id: 15, children: [] }] }],
              },
            ],
          },
          { id: 9, children: [] },
          { id: 10, children: [] },
          { id: 11, children: [] },
        ],
      },
      { id: 3, children: [] },
    ],
  };
  
  // 广度优先遍历函数
  function breadthFirstTraversal(root) {
    const queue = [root]; // 使用队列存储节点
    const result = []; // 存储遍历顺序
  
    while (queue.length > 0) {
      const node = queue.shift(); // 取出队首节点
      console.log(node.id); // 处理节点数据
  
      // 将子节点加入队列
      for (const child of node.children) {
        queue.push(child);
      }
    }
  }
  
  // 测试遍历
  breadthFirstTraversal(tree);
  