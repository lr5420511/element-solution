export default runtime => {
    const root = document.documentElement;
    // Register touch move rule.
    runtime.rules['touch-move'] = [
        // Use rule for element
        function(el, options) {
            const { progress, callback } = Object.assign({}, {
                progress: null,
                callback: null
            }, options);
            let initial, hooks, vectors = [0, 0];
            const [
                touchStartHook, touchMoveHook, touchEndHook
            ] = hooks = [
                ev => {
                    const touch = ev.touches[0];
                    initial = [touch.pageX, touch.pageY];
                },
                ev => {
                    const touch = ev.touches[0],
                        tmp = [touch.pageX - initial[0], touch.pageY - initial[1]];
                    progress && (progress(tmp, vectors));
                    vectors = tmp;
                },
                () => {
                    callback && (callback(vectors));
                    vectors = [0, 0];
                }
            ];
            (el === root ? document : el).addEventListener(
                'touchstart', touchStartHook
            ); 
            (el === root ? document : el).addEventListener(
                'touchmove', touchMoveHook
            );
            (el === root ? document : el).addEventListener(
                'touchend', touchEndHook
            );
            return hooks;
        },
        // Clean rule from element
        function(el, requires) {
            const [touchStartHook, touchMoveHook, touchEndHook] = requires;
            (el === root ? document : el).removeEventListener(
                'touchstart', touchStartHook
            );
            (el === root ? document : el).removeEventListener(
                'touchmove', touchMoveHook
            );
            (el === root ? document : el).removeEventListener(
                'touchend', touchEndHook
            );
        }
    ];
};