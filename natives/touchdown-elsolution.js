export default runtime => {
    const root = document.documentElement;
    // Register touch down rule
    runtime.rules['touch-down'] = [
        // Use rule for element
        function(el, options) {
            const { critical, progress, callback, bubble } = Object.assign({}, {
                 critical: 50,
                 progress: null,
                 callback: null,
                 bubble: true
            }, options);
            let minimize, val, hooks;
            const [touchStartHook, touchMoveHook, touchEndHook] = hooks = [
                ev => {
                    bubble || (ev.stopPropagation());
                    minimize = ev.touches[0].clientY + el.scrollTop;
                    val = null; // repair at version 1.0.3
                },
                ev => {
                    bubble || (ev.stopPropagation());
                    val = ev.touches[0].clientY - minimize;
                    if(val >= 0 && !el.scrollTop) {
                        progress && (progress(val));
                    }
                },
                ev => {
                    bubble || (ev.stopPropagation());
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