const State = {
    states: [],
    state: null,
    store: {},
    clear() {
        kontra.context.clearRect(0, 0, kontra.width, kontra.height);
    },
    init() {
        const _this = this;
        window.addEventListener('deviceorientation', function (event) {
            let x = event.beta;  // [-180,180]
            let y = event.gamma; // [-90,90]
            if (_this.state && _this.state.scene.deviceorientation) {
                _this.state.scene.deviceorientation({ x, y });
            }
        });
        ['onUp', 'onDown'].forEach(function (on) {
            kontra.pointer[on](function (event, object) {
                const top = kontra.canvas.offsetTop;
                const left = kontra.canvas.offsetLeft;
                let x = Math.floor((event.x - left) / 5);
                let y = Math.floor((event.y - top) / 5);
                if (x <= kontra.width && y <= kontra.height && x >= 0 && y >= 0) {
                    if (_this.state && _this.state.scene[on]) {
                        _this.state.scene[on]({ x, y }, object);
                    }
                }
            });
        });
        return this;
    },
    switch(index) {
        this.clear();
        this.states.forEach(state => {
            if (!state.scene.isStopped) {
                if (state.scene.destroy) {
                    state.scene.destroy();
                }
                state.scene.stop();
            }
        })
        if (typeof index == 'string') {
            this.states.forEach(state => {
                if (state.key == index) {
                    if (state.scene.init) {
                        state.scene.init();
                    }
                    state.scene.start();
                    this.state = state;
                }
            })
        } else {
            const state = this.states[index];
            if (state.scene.init) {
                state.scene.init();
            }
            state.scene.start();
            this.state = state;
        }
    },
    addScene(key, scene) {
        if (scene.load) {
            scene.load();
        }
        this.states.push({
            key: key,
            scene: scene
        });
        return this;
    }
}.init();

export default State;