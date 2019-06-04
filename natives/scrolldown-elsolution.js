export default runtime => {
    const root = document.documentElement;
    // Register scroll down rule
    runtime.rules['scroll-down'] = [
        // Use rule for element
        function(el, options) {
            const { critical, callback } = Object.assign({}, {
                critical: 0,
                callback: null
            }, options);
            let toBottom;
            const scrollHook = function() {
                const scrollBottom = el.scrollHeight - el.clientHeight - (el === root ?
                    (el.scrollTop || document.body.scrollTop) : el.scrollTop    
                ),
                tmp = scrollBottom <= critical;
                if(tmp && !toBottom && callback) callback(scrollBottom);
                toBottom = tmp;
            };
            (el === root ? document : el).addEventListener(
                'scroll', scrollHook
            );
            return [scrollHook];
        },
        // Clean rule from element
        function(el, requires) {
            const [scrollHook] = requires;
            (el === root ? document : el).removeEventListener(
                'scroll', scrollHook
            );
        }
    ];
};