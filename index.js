import ScrollDown from './natives/scrolldown-elsolution';
import TouchDown from './natives/touchdown-elsolution';
import TouchMove from './natives/touchmove-elsolution';

const Solution = function(el, solution, options) {
    const { cache, exist, rules } = Solution;
    if(exist.call(cache, el, solution)) {
        const err = new Error('el and solution pair is invaild.');
        err.forecastable = true;
        throw err;
    }
    const [use] = rules[solution];
    cache.push(Object.assign(this, {
        el,
        solution,
        requires: use(el, options)
    }));
};

Solution.prototype = {
    constructor: Solution,
    clean: function() {
        const { cache, rules } = Solution,
            exist = cache.some((cur, i) =>
                cur === this && (cache.splice(i, 1))
            );
        if(!exist) return;
        const { el, solution, requires } = this;
        rules[solution][1](el, requires);
    }
};

Object.assign(Solution, {
    cache: [],
    exist: function(el, solution) {
        return this.some(cur => 
            cur.el === el && cur.solution === solution
        );
    },
    install: function(plugin) {
        const plugins = Solution.plugins = Solution.plugins || [];
        plugins.push(plugin) && (plugin(Solution));
        return Solution;
    },
    rules: {}
});

Solution.install(ScrollDown)
        .install(TouchDown)
        .install(TouchMove);

export default Solution;