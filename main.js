import { initEditor, getActiveScript, saveCurrentScript, switchScript, closeScriptByPath, renderTabs } from './editor.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let mockGame = {
        Workspace: { _children: {}, ClassName: 'Workspace' },
        ServerScriptService: { _children: {}, ClassName: 'ServerScriptService' },
        ReplicatedStorage: { _children: {}, ClassName: 'ReplicatedStorage' }
    };
    let scripts = [];
    let activeScriptIndex = -1;
    let itemCounter = 1;
    let selectedObjectPath = null;
    let history = [];
    let historyIndex = -1;
    let lastFocusedElement = null;

    // --- DOM ELEMENTS ---
    const getEl = id => document.getElementById(id);
    const explorerPanel = getEl('explorer-panel');
    const explorerContent = getEl('explorer-content');
    const addItemMenu = getEl('add-item-menu');
    const deleteBtn = getEl('delete-btn');
    const undoBtn = getEl('undo-btn');
    const redoBtn = getEl('redo-btn');
    const outputChat = getEl('output-chat');
    const codeEditor = getEl('code-editor');

    // --- UTILITY & PATHING FUNCTIONS (REFINED FOR STABILITY) ---
    const getObjectByPath = (path) => {
        if (!path || path === 'game') return { _children: mockGame, ClassName: 'DataModel' };
        const parts = path.replace(/^game\./, '').split('.');
        let current = mockGame;
        for (const part of parts) {
            if (!current) return undefined;
            if (part === '_children') {
                current = current._children;
            } else {
                current = current[part] || (current._children ? current._children[part] : undefined);
            }
        }
        return current;
    };

    const getParentFromPath = (path) => {
        const parts = path.split('.');
        parts.pop(); // Remove the item name itself
        return getObjectByPath(parts.join('.'));
    };

    const logToOutput = (message, type = 'info') => {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = message;
        outputChat.appendChild(line);
        outputChat.scrollTop = outputChat.scrollHeight; // Auto-scroll
    };

    // --- HISTORY (UNDO/REDO) ---
    const recordAction = (action) => {
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(action);
        historyIndex++;
        updateUndoRedoButtons();
    };

    const applyAction = (action, isUndo = false) => {
        const { type, path, oldName, newName, objectData } = action;
        const name = path.split('.').pop();
        const parent = getParentFromPath(path);

        if (!parent || !parent._children) {
            console.error("Action failed: Parent not found for path", path);
            return;
        }

        switch (type) {
            case 'ADD':
                if (isUndo) delete parent._children[name];
                else parent._children[name] = objectData;
                break;
            case 'DELETE':
                if (isUndo) parent._children[name] = objectData;
                else delete parent._children[name];
                break;
            case 'RENAME':
                const currentName = isUndo ? newName : oldName;
                const targetName = isUndo ? oldName : newName;
                const parentPath = path.substring(0, path.lastIndexOf('._children'));
                
                if (parent._children[currentName]) {
                    const obj = parent._children[currentName];
                    obj.Name = targetName;
                    delete parent._children[currentName];
                    parent._children[targetName] = obj;
                    
                    if (obj.ClassName === 'Script') {
                        const oldPath = `${parentPath}._children.${currentName}`;
                        const newPath = `${parentPath}._children.${targetName}`;
                        const script = scripts.find(s => s.path === oldPath);
                        if (script) {
                            script.name = targetName;
                            script.path = newPath;
                        }
                    }
                }
                break;
        }
        renderExplorer();
        renderTabs(scripts, activeScriptIndex, onSwitchScript, onCloseScript);
    };

    const undo = () => {
        if (lastFocusedElement === codeEditor) { document.execCommand('undo'); return; }
        if (historyIndex < 0) return;
        applyAction(history[historyIndex], true);
        historyIndex--;
        updateUndoRedoButtons();
    };

    const redo = () => {
        if (lastFocusedElement === codeEditor) { document.execCommand('redo'); return; }
        if (historyIndex >= history.length - 1) return;
        historyIndex++;
        applyAction(history[historyIndex], false);
        updateUndoRedoButtons();
    };
    
    const updateUndoRedoButtons = () => {
        undoBtn.disabled = historyIndex < 0;
        redoBtn.disabled = historyIndex >= history.length - 1;
        deleteBtn.disabled = !selectedObjectPath || selectedObjectPath.split('.').length <= 2;
    };

    // --- EXPLORER LOGIC (REFINED INTERACTION) ---
    const renderExplorer = () => {
        explorerContent.innerHTML = '';
        const renderNode = (name, object, depth, path) => {
            const item = document.createElement('div');
            item.className = 'explorer-item';
            if (path === selectedObjectPath) item.classList.add('selected');
            item.dataset.depth = depth;
            item.dataset.type = object.ClassName;
            const span = document.createElement('span');
            span.textContent = name;
            item.appendChild(span);

            const isService = depth === 1;
            const isRoot = depth === 0;

            if (!isRoot) {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (selectedObjectPath === path && !isService && object.ClassName !== 'Script') {
                        handleRename(span, name, path);
                    } else {
                        selectedObjectPath = path;
                        lastFocusedElement = explorerContent;
                        renderExplorer();
                    }
                    updateUndoRedoButtons();
                });
                item.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    if (object.ClassName === 'Script') {
                        openScriptByPath(path);
                    } else if (!isService) {
                        handleRename(span, name, path);
                    }
                });
            }

            if (object._children) {
                if (isService) {
                    const plusBtn = document.createElement('button');
                    plusBtn.className = 'add-child-btn';
                    plusBtn.textContent = '+';
                    plusBtn.onclick = (e) => {
                        e.stopPropagation();
                        const rect = plusBtn.getBoundingClientRect();
                        addItemMenu.style.left = rect.right + 'px';
                        addItemMenu.style.top = rect.top + 'px';
                        addItemMenu.dataset.parentPath = path;
                        addItemMenu.style.display = 'block';
                    };
                    item.appendChild(plusBtn);
                }
                explorerContent.appendChild(item);
                for (const childName in object._children) {
                    renderNode(childName, object._children[childName], depth + 1, `${path}._children.${childName}`);
                }
            } else {
                 explorerContent.appendChild(item);
            }
        };
        renderNode('game', { _children: mockGame, ClassName: 'DataModel' }, 0, 'game');
    };
    
    const handleRename = (span, name, path) => {
        const input = document.createElement('input');
        input.type = 'text'; input.value = name; input.className = 'explorer-item-input';
        span.parentElement.replaceChild(input, span);
        input.focus(); input.select();

        const finishEditing = () => {
            const newName = input.value.trim().replace(/[.\s]/g, '_') || name;
            if (newName !== name) {
                const parent = getParentFromPath(path);
                if (parent && parent._children[newName]) {
                    alert("An item with this name already exists.");
                    renderExplorer(); return;
                }
                const newPath = path.substring(0, path.lastIndexOf('.') + 1) + newName;
                recordAction({ type: 'RENAME', path, oldName: name, newName });
                applyAction(history[history.length - 1]);
                selectedObjectPath = newPath;
            } else {
                renderExplorer();
            }
        };
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', e => e.key === 'Enter' && input.blur());
    };

    addItemMenu.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LI') return;
        const parentPath = addItemMenu.dataset.parentPath;
        const type = e.target.dataset.type;
        const parent = getObjectByPath(parentPath);
        if (parent && parent._children) {
            const itemName = `${type}${itemCounter++}`;
            const newObj = { Name: itemName, ClassName: type };
            if (type === 'Part') newObj._children = {};
            if (type === 'Script') newObj.code = `-- Hello from ${itemName}`;
            const newPath = `${parentPath}._children.${itemName}`;
            recordAction({ type: 'ADD', path: newPath, objectData: newObj });
            applyAction(history[history.length - 1]);
        }
        addItemMenu.style.display = 'none';
    });
    
    deleteBtn.addEventListener('click', () => {
        if (!selectedObjectPath || selectedObjectPath.split('.').length <= 2) return;
        const name = selectedObjectPath.split('.').pop();
        const parent = getParentFromPath(selectedObjectPath);

        if (parent && parent._children && parent._children[name]) {
            const objectData = JSON.parse(JSON.stringify(parent._children[name]));
            recordAction({ type: 'DELETE', path: selectedObjectPath, objectData });
            if (objectData.ClassName === 'Script') {
                onCloseScript(selectedObjectPath, true);
            }
            applyAction(history[history.length - 1]);
            selectedObjectPath = null;
            updateUndoRedoButtons();
        }
    });

    // --- SCRIPT & TAB MANAGEMENT ---
    const onSwitchScript = (index) => {
        activeScriptIndex = switchScript(index, scripts);
        renderTabs(scripts, activeScriptIndex, onSwitchScript, onCloseScript);
    };

    const onCloseScript = (path, forceClose = false) => {
        saveCurrentScript(scripts, activeScriptIndex);
        const index = scripts.findIndex(s => s.path === path);
        if (index === -1) return;
        scripts.splice(index, 1);
        if (activeScriptIndex === index) {
            activeScriptIndex = scripts.length > 0 ? 0 : -1;
            onSwitchScript(activeScriptIndex);
        } else if (activeScriptIndex > index) {
            activeScriptIndex--;
            onSwitchScript(activeScriptIndex);
        } else {
             renderTabs(scripts, activeScriptIndex, onSwitchScript, onCloseScript);
        }
    };

    const openScriptByPath = (path) => {
        saveCurrentScript(scripts, activeScriptIndex);
        let scriptIndex = scripts.findIndex(s => s.path === path);
        if (scriptIndex === -1) {
            const obj = getObjectByPath(path);
            if (!obj || obj.ClassName !== 'Script') return;
            scripts.push({ path: path, name: obj.Name, code: obj.code || '' });
            scriptIndex = scripts.length - 1;
        }
        onSwitchScript(scriptIndex);
    };

    // --- LUA EXECUTION (UNCHANGED) ---
    getEl('run-button').addEventListener('click', () => {
        saveCurrentScript(scripts, activeScriptIndex);
        outputChat.innerHTML = '';
        logToOutput("> Starting execution...", "info");
        try {
            let executionGame = JSON.parse(JSON.stringify(mockGame));
            function findScripts(service) {
                let found = [];
                for(const name in service._children) {
                    const child = service._children[name];
                    if(child.ClassName === 'Script') found.push(child);
                    if(child._children) found = found.concat(findScripts(child));
                }
                return found;
            }
            const allScripts = findScripts(executionGame.ServerScriptService);
            allScripts.forEach((scriptInstance) => {
                const L = fengari.lauxlib.luaL_newstate();
                fengari.lualib.luaL_openlibs(L);
                fengari.lua.lua_pushjs(L, executionGame);
                fengari.lua.lua_setglobal(L, fengari.to_luastring("game"));
                fengari.lua.lua_pushjs(L, (...args) => {
                    const msg = args.map(a => fengari.to_jsstring(fengari.lua.lua_tostring(L, fengari.lua.lua_gettop(L) - args.length + 1 + args.indexOf(a)))).join('\t');
                    logToOutput(msg, 'print');
                });
                fengari.lua.lua_setglobal(L, fengari.to_luastring("print"));
                logToOutput(`--- Running ${scriptInstance.Name} ---`, 'info');
                const status = fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(scriptInstance.code));
                if (status !== fengari.lua.LUA_OK) {
                    const errorMsg = fengari.to_jsstring(fengari.lua.lua_tostring(L, -1));
                    logToOutput(`[ERROR] in ${scriptInstance.Name}: ${errorMsg.split(": ").slice(1).join(": ")}`, 'error');
                }
                fengari.lua.lua_close(L);
            });
            logToOutput("> Execution finished.", "success");
            mockGame = executionGame;
            renderExplorer();
        } catch (e) { logToOutput("[FATAL JS ERROR]: " + e.message, 'error'); console.error(e); }
    });
    
    // --- INITIALIZATION ---
    const tutorials = { "01_พื้นฐาน": `-- Code...`, "02_การหาPart": `-- Code...`, "03_การเปลี่ยนPart": `-- Code...`, "04_Loopและการสร้าง": `-- Code...` };
    Object.keys(tutorials).forEach(name => { mockGame.ServerScriptService._children[name] = { Name: name, ClassName: 'Script', code: tutorials[name] }; });
    codeEditor.addEventListener('focus', () => lastFocusedElement = codeEditor);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    document.addEventListener('click', (e) => !addItemMenu.contains(e.target) && (addItemMenu.style.display = 'none'));
    getEl('clear-output-btn').addEventListener('click', () => outputChat.innerHTML = '');
    document.querySelectorAll('#explorer-toggle-btn').forEach(btn => btn.addEventListener('click', () => explorerPanel.classList.toggle('collapsed')));
    initEditor(() => ({ scripts, activeScriptIndex }));
    renderExplorer();
    updateUndoRedoButtons();
    openScriptByPath('game.ServerScriptService._children.01_พื้นฐาน');
    logToOutput("สตูดิโอพร้อมใช้งานแล้ว!", "info");
});
