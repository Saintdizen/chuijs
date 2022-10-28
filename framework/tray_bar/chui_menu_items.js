class MenuItem {
    button(title = String(), action = () => {}) { return { label: title, click: action } }
    separator() { return { type: 'separator' } }
    submenu(title= String(), submenu_list = Array()) { return { label: title, submenu: submenu_list } }
    radio(title= String(), checked = Boolean(), action = () => {}) { return { label: title, type: 'radio', checked: checked, click: action } }
    checkbox(title= String(), checked = Boolean(), action = () => {}) { return { label: title, type: 'checkbox', checked: checked, click: action } }
    undo(title= String()) { return { label: title, role: 'undo' } }
    redo(title= String()) { return { label: title, role: 'redo' } }
    cut(title= String()) { return { label: title, role: 'cut' } }
    copy(title= String()) { return { label: title, role: 'copy' } }
    paste(title= String()) { return { label: title, role: 'paste' } }
    pasteAndMatchStyle(title) { return { label: title, role: 'pasteAndMatchStyle' } }
    delete(title= String()) { return { label: title, role: 'delete' } }
    selectAll(title= String()) { return { label: title, role: 'selectAll' } }
    reload(title= String()) { return { label: title, role: 'reload' } }
    forceReload(title= String()) { return { label: title, role: 'forceReload' } }
    quit(title= String()) { return { label: title, role: 'quit' } }
    resetZoom(title= String()) { return { label: title, role: 'resetZoom' } }
    zoomIn(title= String()) { return { label: title, role: 'zoomIn' } }
    zoomOut(title= String()) { return { label: title, role: 'zoomOut' } }
    toggleFullScreen(title= String()) { return { label: title, role: 'togglefullscreen' } }
    window(title= String()) { return { label: title, role: 'window' } }
    minimize(title= String()) { return { label: title, role: 'minimize' } }
    close(title= String()) { return { label: title, role: 'close' } }
    help(title= String()) { return { label: title, role: 'help' } }
    about(title= String()) { return { label: title, role: 'about' } }
    services(title= String()) { return { label: title, role: 'services' } }
    hide(title= String()) { return { label: title, role: 'hide' } }
    hideOthers(title= String()) { return { label: title, role: 'hideOthers' } }
    unhide(title= String()) { return { label: title, role: 'unhide' } }
    startSpeaking(title= String()) { return { label: title, role: 'startSpeaking' } }
    stopSpeaking(title= String()) { return { label: title, role: 'stopSpeaking' } }
    zoom(title= String()) { return { label: title, role: 'zoom' } }
    front(title= String()) { return { label: title, role: 'front' } }
    appMenu(title= String()) { return { label: title, role: 'appMenu' } }
    fileMenu(title= String()) { return { label: title, role: 'fileMenu' } }
    editMenu(title= String()) { return { label: title, role: 'editMenu' } }
    viewMenu(title= String()) { return { label: title, role: 'viewMenu' } }
    recentDocuments(title= String()) { return { label: title, role: 'recentDocuments' } }
    toggleTabBar(title= String()) { return { label: title, role: 'toggleTabBar' } }
    selectNextTab(title= String()) { return { label: title, role: 'selectNextTab' } }
    selectPreviousTab(title= String()) { return { label: title, role: 'selectPreviousTab' } }
    mergeAllWindows(title= String()) { return { label: title, role: 'mergeAllWindows' } }
    clearRecentDocuments(title= String()) { return { label: title, role: 'clearRecentDocuments' } }
    moveTabToNewWindow(title= String()) { return { label: title, role: 'moveTabToNewWindow' } }
    windowMenu(title= String()) { return { label: title, role: 'windowMenu' } }
}

exports.MenuItem = MenuItem