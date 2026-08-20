type LongpressOptions = {
    threshold?: number;
    callback: (node: HTMLElement) => void;
};

export function longpress(node: HTMLElement, options: LongpressOptions) {
    const { threshold = 500, callback } = options;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let longPressed = false;

    function handlePointerDown() {
        longPressed = false;
        timeout = setTimeout(() => {
            longPressed = true;
            callback(node);
        }, threshold);
    }

    function handlePointerUp() {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = undefined;
    }

    function handleClick(event: MouseEvent) {
        if (longPressed) {
            event.preventDefault();
            event.stopImmediatePropagation();
            longPressed = false;
        }
    }

    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('pointerup', handlePointerUp);
    node.addEventListener('pointerleave', handlePointerUp);
    node.addEventListener('pointercancel', handlePointerUp);
    node.addEventListener('click', handleClick, true);

    return {
        destroy() {
            handlePointerUp();
            node.removeEventListener('pointerdown', handlePointerDown);
            node.removeEventListener('pointerup', handlePointerUp);
            node.removeEventListener('pointerleave', handlePointerUp);
            node.removeEventListener('pointercancel', handlePointerUp);
            node.removeEventListener('click', handleClick, true);
        }
    };
}
