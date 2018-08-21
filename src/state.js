const State = {
    states: [],
    state: null,
    clear() {
        kontra.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);
    },
    init() {
        const _this = this;
        ['onUp', 'onDown'].forEach(function(on){
            kontra.pointer[on](function (event, object) {
                if (_this.state && _this.state.scene[on]) {
                    _this.state.scene[on](event, object);
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