export default runtime => {
    const root = document.documentElement;
    // Register touch down rule
    runtime.rules['touch-down'] = [
        // Use rule for element
        function(el, options) {
            const { critical, progress, callback } = Object.assign({}, {
                 critical: 50,
                 progress: null,
                 callback: null
            }, options);
            let minimize, val, hooks;
            const [touchStartHook, touchMoveHook, touchEndHook] = hooks = [
                ev => {
                    minimize = ev.touches[0].clientY + el.scrollTop;
                },
                ev => {
                    val = ev.touches[0].clientY - minimize;
                    if(val >= 0 && !el.scrollTop) {
                        progress && (progress(val));
                    }
                },
                () => {
                    callback && (callback(val >= critical));
                }
            ];
            (root === el ? document : el).addEventListener(
                'touchstart', touchStartHook
            );
            (root === el ? document : el).addEventListener(
                'touchmove', touchMoveHook
            );
            (root === el ? document : el).addEventListener(
                'touchend', touchEndHook
            );
            return hooks;
        },
        // Clean rule from element
        function(el, requires) {
            const [touchStartHook, touchMoveHook, touchEndHook] = requires;
            (root === el ? document : el).removeEventListener(
                'touchstart', touchStartHook
            );
            (root === el ? document : el).removeEventListener(
                'touchmove', touchMoveHook
            );
            (root === el ? document : el).removeEventListener(
                'touchend', touchEndHook
            );
        }
    ];
};