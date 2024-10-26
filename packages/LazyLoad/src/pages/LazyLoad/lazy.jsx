import React from "react";
import throttle from "lodash/throttle";

// 监听屏幕滚动的单例(IIFE)
const ListenerSingleton = (function () {
  const subList = [];
  const listener = throttle(() => {
    subList.filter(s => !s.show).forEach((sub) => {
      const { top, cb } = sub;
      if (window.scrollY + window.innerHeight > top) {
        cb();
        sub.show = true;
      }
    });
  }, 500);
  window.addEventListener("scroll", listener, { passive: true });

  return {
    listen: function (top, cb) {
      subList.push({ top, cb, show: false });
    },
    removeListener: function () {
      window.removeEventListener("scroll", listener);
    }
  };
})();

class Lazy extends React.PureComponent {
  constructor(props) {
    super(props);
    const { top } = this.props;
    ListenerSingleton.listen(top, () => {
      this.setState({ show: true });
      console.log('show ', top);
    });
    this.state = { show: false };
  }
  
  render() {
    const { height, children, fallback } = this.props;
    const { show } = this.state;
    return (
      <div style={{ height: height }}>
        {show ? children : (fallback ?? 'loading...')}
      </div>
    )
  }
}

export default Lazy;