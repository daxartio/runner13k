const State = {
    states: [],
    state: null,
    store: {},
    clear() {
        kontra.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);
    },
    init() {
        const _this = this;
        ['onUp', 'onDown'].forEach(function(on){
            kontra.pointer[on](function (event, object) {
                let x = event.x - 7;
                let y = event.y - 7;
                if (x <= kontra.canvas.width && y <= kontra.canvas.height) {
                    if (_this.state && _this.state.scene[on]) {
                        const e = {x, y};
                        _this.state.scene[on](e, object);
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