# element-solution
元素应用指定的方案，已达到需要的效果。原生支持向下滚动加载、向下拉取刷新以及触摸移动功能。您也可以通过插件的方式丰富您需要的方案。

# 特色
> `元素方案通过插件的方式进行管理，简单方便且干净。可以根据自身的需求选择或编写需要的元素方案插件。应用方案以后，如果不在需要该方案，可以调用函数进行后续清理。`

# 安装
> `npm i --save element-solution`

# 使用

## 对元素应用方案

        import ElSolution from 'element-solution';
        
        const solution = new ElSolution(
            [element], // 需要应用方案的元素 HTMLElement
            [solutionName], // 方案的名称 String
            options, // 对应方案需要的参数 Object
        );

需要注意，一个元素只能应用同一种方案一次，不能多次应用该方案，否则报错。

## 清理元素方案
        
        solution.clean();

如果该元素存在指定的方案，并且没有被清理。将清理该元素的对应方案，否则什么也不会做。

# 关于插件

## 原生插件的使用
包本身默认安装了两个插件方案（新增了一个插件方案）：

1. scrolldown-elsolution，该方案主要用于向下滚动加载更多项的场景。

2. touchdown-elsolution，该方案主要用于向下拉取然后进行刷新的场景。

3. touchmove-elsolution，该方案主要用于触摸后需要移动的场景。

### scrolldown-elsolution

        import ElSolution from 'element-solution';

        const solution = new ElSolution(
            document.documentElement, 
            'scroll-down',
            {
                critical: 50, // 距离最下端的临界值，默认为0。当scrollHeight - clientHeight - scrollTop小于或等于该值时，执行钩子函数。
                callback: function(toBottom) {
                    // 你可以在这里去进行http请求操作
                } // 当第一次从非临界区域到达临界区域内时执行该钩子函数，默认为null。
            }
        );

### touchdown-elsolution
        
        import ElSolution from 'element-solution';

        const solution = new ElSolution(
            document.documentElement,
            'touch-down',
            {
                bubble: false, // 指示本次方案不冒泡，默认值为true。
                critical: 70, // 当元素scrollTop为0时，还需要下拉多少距离到达临界区域，默认值为50。
                progress: function(val) {
                    // 你可以在这里绘制一个图形，以便提醒用户继续下拉刷新
                },  // touchmove期间，需要元素scrollTop为0时，才会执行该钩子函数。参数val表示当元素scrollTop为0后继续下拉了多少距离。
                callback: function(isCritical) {
                    // 可以在这里做progress中提醒任务的清理工作。如果isCritical为true时，表示本次下拉到达临界区域。我们可以发起http请求以便
                    // 对数据进行更新。
                }   // 当touchend时执行，无论下拉操作是否到达临界区域都会执行。
            }
        );

### touchmove-elsolution

        import ElSolution from 'element-solution';

        const solution = new ElSolution(
            document.documentElement,
            'touch-move',
            {
                bubble: false, // 指示本次方案不冒泡，默认值为true。
                progress: function(curOffset, oldOffset) {
                    // 你可以在这里绘制图形，以响应用户操作
                },  // 第一个参数表示本次移动相对于touchstart坐标的偏移量，第二个参数表示上次的偏移量，两者之差代表本次移动相对于上次的偏移量。
                callback: function(offset) {
                    // 当你touchend时执行这个钩子函数，你可以在这里做一些清理工作，以及对用户操作作出最终响应。
                }   // 参数表示最终的移动相对于touchstart坐标的偏移量
            }
        );

## 丰富插件方案
我们也可以自己编写自己需要的元素方案插件，以便使用。

### 插件的写法
        
        export default runtime => {
            runtime.rules['XXX-XXX'] = [
                function(el, options) {
                    // 索引0处函数，应该对元素应用方案规则。数据可以从options中获取。
                    // 返回值应该是这个方案进行清理时需要的数据集合。比如[touchStartHook, touchMoveHook, touchEndHook]
                },
                function(el, requires) {
                    // 索引1处函数，应该清理元素已经应用的方案规则。清理时需要的数据可以从requires中获取，同时这也是应用规则函数最后的返回值。
                }
            ];
        };

### 注册插件

        import ElSolution from 'element-solution';
        import XXXXX1 from 'XXXXXXX'; // 导入插件1
        import XXXXX2 from 'XXXXXXX';

        ElSolution.install(XXXXX1).install(XXXXX2);

# 注意事项
> `因为使用了Object.assign，所以您应该确保对应的polyfill是否存在。`

