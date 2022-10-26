//ITEMS
class MenuItem {
    button(title = String(undefined), action = () => {}) {
        return { label: title, click: action }
    }
    separator() {
        return { type: 'separator' }
    }
    submenu(title= String(undefined), submenu_list = Array(undefined)) {
        return { label: title, submenu: submenu_list }
    }
    radio(title= String(undefined), checked = Boolean(undefined), action = () => {}) {
        return { label: title, type: 'radio', checked: checked, click: action }
    }
    checkbox(title= String(undefined), checked = Boolean(undefined), action = () => {}) {
        return { label: title, type: 'checkbox', checked: checked, click: action }
    }
    undo(title= String(undefined)) {
        return { label: title, role: 'undo' }
    }
    redo(title= String(undefined)) {
        return { label: title, role: 'redo' }
    }
    cut(title= String(undefined)) {
        return { label: title, role: 'cut' }
    }
    copy(title= String(undefined)) {
        return { label: title, role: 'copy' }
    }
    paste(title= String(undefined)) {
        return { label: title, role: 'paste' }
    }
    pasteAndMatchStyle(title) {
        return { label: title, role: 'pasteAndMatchStyle' }
    }
    delete(title= String(undefined)) {
        return { label: title, role: 'delete' }
    }
    selectAll(title= String(undefined)) {
        return { label: title, role: 'selectAll' }
    }
    reload(title= String(undefined)) {
        return { label: title, role: 'reload' }
    }
    forceReload(title= String(undefined)) {
        return { label: title, role: 'forceReload' }
    }
    quit(title= String(undefined)) {
        return { label: title, role: 'quit' }
    }
    resetZoom(title= String(undefined)) {
        return { label: title, role: 'resetZoom' }
    }
    zoomIn(title= String(undefined)) {
        return { label: title, role: 'zoomIn' }
    }
    zoomOut(title= String(undefined)) {
        return { label: title, role: 'zoomOut' }
    }
    togglefullscreen(title= String(undefined)) {
        return { label: title, role: 'togglefullscreen' }
    }
    window(title= String(undefined)) {
        return { label: title, role: 'window' }
    }
    minimize(title= String(undefined)) {
        return { label: title, role: 'minimize' }
    }
    close(title= String(undefined)) {
        return { label: title, role: 'close' }
    }
    help(title= String(undefined)) {
        return { label: title, role: 'help' }
    }
    about(title= String(undefined)) {
        return { label: title, role: 'about' }
    }
    services(title= String(undefined)) {
        return { label: title, role: 'services' }
    }
    hide(title= String(undefined)) {
        return { label: title, role: 'hide' }
    }
    hideOthers(title= String(undefined)) {
        return { label: title, role: 'hideOthers' }
    }
    unhide(title= String(undefined)) {
        return { label: title, role: 'unhide' }
    }
    startSpeaking(title= String(undefined)) {
        return { label: title, role: 'startSpeaking' }
    }
    stopSpeaking(title= String(undefined)) {
        return { label: title, role: 'stopSpeaking' }
    }
    zoom(title= String(undefined)) {
        return { label: title, role: 'zoom' }
    }
    front(title= String(undefined)) {
        return { label: title, role: 'front' }
    }
    appMenu(title= String(undefined)) {
        return { label: title, role: 'appMenu' }
    }
    fileMenu(title= String(undefined)) {
        return { label: title, role: 'fileMenu' }
    }
    editMenu(title= String(undefined)) {
        return { label: title, role: 'editMenu' }
    }
    viewMenu(title= String(undefined)) {
        return { label: title, role: 'viewMenu' }
    }
    recentDocuments(title= String(undefined)) {
        return { label: title, role: 'recentDocuments' }
    }
    toggleTabBar(title= String(undefined)) {
        return { label: title, role: 'toggleTabBar' }
    }
    selectNextTab(title= String(undefined)) {
        return { label: title, role: 'selectNextTab' }
    }
    selectPreviousTab(title= String(undefined)) {
        return { label: title, role: 'selectPreviousTab' }
    }
    mergeAllWindows(title= String(undefined)) {
        return { label: title, role: 'mergeAllWindows' }
    }
    clearRecentDocuments(title= String(undefined)) {
        return { label: title, role: 'clearRecentDocuments' }
    }
    moveTabToNewWindow(title= String(undefined)) {
        return { label: title, role: 'moveTabToNewWindow' }
    }
    windowMenu(title= String(undefined)) {
        return { label: title, role: 'windowMenu' }
    }
}

exports.MenuItem = MenuItem