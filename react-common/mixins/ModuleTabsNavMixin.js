'use strict'

const storagePreviousKey = systemname;

const GetCachedStateAndOpenTab = function(props) {
    props = props || this.props;
    let path = props.location.pathname;
    let cache = sessionStorage.getItem(storagePreviousKey + path);
    let dfd = {};
    let promise = new Promise( resolve => {
        dfd.resolve = resolve;
    })
    promise.then(() => {
        props.openTab({path: path, title: this.state && this.state.tabTitle || '页面'});

        // NOTE:: restore callback
        this.componentDidTabMount && this.componentDidTabMount(props)
    });
    if (cache) {
        this.setState(JSON.parse(cache), () => {
            sessionStorage.removeItem(storagePreviousKey + path)
            dfd.resolve();
        })
    } else {
        dfd.resolve();
    }
};

const CacheCurrentState = function(props) {
    props = props || this.props;
    let path = props.location.pathname;
    let tabs = this.props.getTabs();
    // only cache if this tab haven't been closed
    if (tabs.filter(item => item.path === path).length) {
        sessionStorage.setItem(storagePreviousKey + path, JSON.stringify(this.state));
    }
};

export default {
    closeNavTab() {
        let path = this.props.location.pathname;
        this.props.closeTab(path);
    },
    componentWillMount(){
        GetCachedStateAndOpenTab.call(this);
    },
    // when component does not re-mount
    componentWillReceiveProps(next) {
        if (this.props.location.pathname !== next.location.pathname) {
            CacheCurrentState.call(this);
            GetCachedStateAndOpenTab.call(this, next);
        }
    },
    componentDidUpdate() {
        this.props.setTabTitle({
            path: this.props.location.pathname, 
            title: this.state && this.state.tabTitle || '页面'
        });
    },
    componentWillUnmount(){
        CacheCurrentState.call(this);
    },
}
