# Redtail

### redtail 是一个简化vuex概念和接口的插件, redtail只有两个接口, 可以更方便的接入vuex

### 安装

    npm i redtail

### 使用

#### 新建一个组件

    import {init} from 'redtail';
    const store = init(new Vuex.Store({
        state: {
            message: 'Hello!'
        },
        // 直接书写异步代码
        setMessageAsync (context, newValue) {
            setTimeout(() => {
                context.commit('message', newValue)
            });
        }
    }));

#### 绑定store到组件

    <template>
        <div id="app">
            <p>{{ message }}</p>
        </div>
    </template>
    <script>
        import {connet} from 'redtail';
        new Vue(connet({
            el: '#app',
            methods: {
                setMessage () {
                    store.commit('setMessageAsync', 'World!')
                }
            }
        }));
    </script>

#### 对应原方式

完整的vuex实例应该是

    const store = new Vuex.Store({
        state: {
            message: 'Hello!'
        },
        // getter 集合
        getters: {
            getMessage: state => {
                return state.message;
            }
        },
        // setter 集合
        mutations: {
            setMessage (state, newValue) {
                // 变更状态
                state.message = newValue;
            }
        },
        actions: {
            setMessageAsync (context, newValue) {
                setTimeout(() => {
                    context.commit('setMessage', newValue)
                });
            }
        }
    });

#### 最后把store和组件绑定

    <template>
        <div id="app">
            <p>{{ message }}</p>
        </div>
    </template>
    <script>
        new Vue({
            el: '#app',
            computed: {
                ...mapGetters([
                    'getMessage',
                    // ...
                ])
            },
            methods: {
                setMessage () {
                    store.commit('setMessageAsync', 'World!')
                }
            }
        });
    </script>