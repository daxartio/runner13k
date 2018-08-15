const State = {
    states: [],
    clear() {
        kontra.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);
    },
    init() {
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
                }
            })
        } else {
            const state = this.states[index];
            if (state.scene.init) {
                state.scene.init();
            }
            state.scene.start();
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