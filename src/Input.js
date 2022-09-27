export default class Input {
    static Initialize() {
        window.pg_activeKeys = new Set();
        document.documentElement.addEventListener('keydown', e => window.pg_activeKeys.add(e.keyCode));
    }

    // Clears active keys, returning an Array of keys cleared
    static Poll() {
        let activeKeys = Array.from(window.pg_activeKeys);
        window.pg_activeKeys.clear();
        return activeKeys;
    }
}
