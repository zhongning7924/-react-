'use strict'

const storagePreviousKey = systemname;
const navKey = `NavTabs_${systemname}`;

// Used for the App Component
export default {
    componentWillMount() {
        let navs = sessionStorage.getItem(navKey);
        if (navs) {
            this.setState({
                navTabs: JSON.parse(navs)
            })
        }
    },
    getTabs() {
        return this.state.navTabs;
    },
    // Save to sesstionStorage
    saveTabs() {
        let navs = sessionStorage.getItem(navKey);
        let newNavs = JSON.stringify(this.state.navTabs);
        if (newNavs !== navs) {
            sessionStorage.setItem(navKey, newNavs);
        }
    },
    // Open current tab and return cached state
    openTab({path, title}) {
        let navs = this.state.navTabs;
        let nav = navs.filter(nav => nav.path === path)[0];
        // create a tab if current path doesn't exist
        if (!nav) {
            let newNav = {path:path, title:title};
            let activeNav = navs.filter(nav => nav.active)[0];
            if (activeNav) {
                let index = navs.indexOf(activeNav);
                navs.splice(index + 1, 0, newNav);
            } else {
                // should not happend
                navs.push(newNav);
            }
        }
        // active it
        navs.forEach(nav => nav.active = nav.path === this.props.location.pathname);
        this.setState({
            navTabs: navs
        }, () => this.saveTabs());
    },
    closeTab(path) {
        let navs = this.state.navTabs;
        // don't allow close the only tab
        if (navs.length === 1) return;
        let nav = navs.filter(nav => nav.path === path)[0];
        // haven't found tab
        if (!nav) return;
        let index = navs.indexOf(nav);
        let newActive;
        if (nav.active) {
            // active the next or the last tab
            // newActive = navs[index + 1] || navs[index - 1];
            // change at 2016-3-23
            newActive = navs[index - 1] || navs[index + 1];
            newActive.active = true;
        }
        navs.splice(index,1);
        this.setState({
            navTabs: navs
        }, () => {
            this.saveTabs();
            // remove tab state cache
            sessionStorage.removeItem(storagePreviousKey + path);
            // if change active
            newActive && this.props.history.pushState(null, newActive.path);
        });
    },
    setTabTitle({path, title}) {
        let navs = this.state.navTabs;
        let changed;
        navs.forEach(nav => {
            if (nav.path === path && nav.title !== title){
                nav.title = title;
                changed = true;
            }
        })
        // NOTE:: this might be called in children's componentDidUpdate 
        // carefully update the state or there will be an endless loop
        changed && this.setState({
            navTabs: navs
        }, () => this.saveTabs());
    },
};