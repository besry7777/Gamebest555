const getEl = id => document.getElementById(id);
const codeEditor = getEl('code-editor');
const highlightingLayer = getEl('highlighting-layer');
const highlightContainer = getEl('highlighting-layer-container');
const autocompletePopup = getEl('autocomplete-popup');
const tabsContainer = getEl('script-tabs');

let getState;
let syntaxError = null;
let isHighlighting = false;

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// --- FIX: REWRITTEN SYNTAX HIGHLIGHTING LOGIC ---
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const keywords = new Set(['local', 'function', 'if', 'then', 'else', 'elseif', 'end', 'for', 'while', 'do', 'return', 'and', 'or', 'not', 'break', 'in', 'repeat', 'until', 'true', 'false', 'nil']);
const knownGlobals = new Set(['game', 'print', 'workspace', 'wait', 'script', 'math', 'Vector3', 'CFrame', 'Color3', 'Instance', 'pcall', 'xpcall', 'tostring', 'tonumber', 'type', 'error', 'assert']);

const updateHighlighting = () => {
    if (isHighlighting) return;
    isHighlighting = true;
    
    const text = codeEditor.value;
    const knownVariables = new Set();
    text.replace(/local\s+([\w_]+)/g, (_, name) => knownVariables.add(name));
    text.replace(/function\s+([\w_.:]+)/g, (_, name) => knownVariables.add(name.split(/[:.]/).pop()));

    const lines = text.split('\n');
    let finalHtml = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let lineHtml = '';
        
        // This regex tokenizes the line into strings, comments, and other code parts
        const tokens = line.match(/(".*?"|'.*?'|--\[\[.*\]\]|--[^\r\n]*|[\w_]+|[^\w\s])| /g) || [];

        for (const token of tokens) {
            if (token.startsWith('--')) {
                lineHtml += `<span class="hl-comment">${escapeHtml(token)}</span>`;
            } else if (token.startsWith('"') || token.startsWith("'")) {
                lineHtml += `<span class="hl-string">${escapeHtml(token)}</span>`;
            } else if (keywords.has(token)) {
                lineHtml += `<span class="hl-keyword">${token}</span>`;
            } else if (knownGlobals.has(token)) {
                lineHtml += `<span class="hl-global">${token}</span>`;
            } else if (!isNaN(parseFloat(token))) {
                 lineHtml += `<span class="hl-number">${token}</span>`;
            } else if (/[ก-๙]/.test(token)) {
                 lineHtml += `<span class="hl-thai-error">${escapeHtml(token)}</span>`;
            } else if (/[\w_]+/.test(token) && !knownVariables.has(token)) {
                lineHtml += `<span class="hl-unknown-var">${escapeHtml(token)}</span>`;
            }
            else {
                lineHtml += escapeHtml(token);
            }
        }

        if (syntaxError && syntaxError.line === i + 1) {
            finalHtml += `<div class="syntax-error">${lineHtml || ' '}</div>`;
        } else {
            finalHtml += `<div>${lineHtml || ' '}</div>`;
        }
    }

    highlightingLayer.innerHTML = finalHtml;
    isHighlighting = false;
};

const checkSyntax = () => {
    try {
        const L = fengari.lauxlib.luaL_newstate();
        const status = fengari.lauxlib.luaL_loadstring(L, fengari.to_luastring(codeEditor.value));
        if (status !== fengari.lua.LUA_OK) {
            const errorMsg = fengari.to_jsstring(fengari.lua.lua_tostring(L, -1));
            const lineMatch = errorMsg.match(/\[string "..."\]:(\d+):/);
            syntaxError = { line: lineMatch ? parseInt(lineMatch[1]) : -1 };
        } else {
            syntaxError = null;
        }
        fengari.lua.lua_close(L);
    } catch (e) {
        syntaxError = null;
    }
    updateHighlighting();
};
const debouncedCheckSyntax = debounce(checkSyntax, 150);

// --- SCRIPT AND TAB MANAGEMENT (EXPORTED) ---
export function getActiveScript() {
    const { scripts, activeScriptIndex } = getState();
    return scripts[activeScriptIndex];
}

export function saveCurrentScript(scripts, activeScriptIndex) {
    if (activeScriptIndex > -1 && scripts[activeScriptIndex]) {
        scripts[activeScriptIndex].code = codeEditor.value;
    }
}

export function switchScript(index, scripts) {
    saveCurrentScript(scripts, getState().activeScriptIndex);
    const newActiveIndex = index;
    if (newActiveIndex > -1 && scripts[newActiveIndex]) {
        codeEditor.value = scripts[newActiveIndex].code;
        codeEditor.disabled = false;
        codeEditor.focus();
    } else {
        codeEditor.value = '-- No script is open --';
        codeEditor.disabled = true;
    }
    debouncedCheckSyntax();
    return newActiveIndex;
}

export function closeScriptByPath(path, scripts) {
    return scripts.filter(s => s.path !== path);
}

export function renderTabs(scripts, activeScriptIndex, onSwitchScript, onCloseScript) {
    tabsContainer.innerHTML = '';
    scripts.forEach((script, index) => {
        const tab = document.createElement('div');
        tab.className = 'tab' + (index === activeScriptIndex ? ' active' : '');
        tab.textContent = script.name;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-tab-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = (e) => { e.stopPropagation(); onCloseScript(script.path); };
        tab.appendChild(closeBtn);
        tab.onclick = () => onSwitchScript(index);
        tabsContainer.appendChild(tab);
    });
}

// --- INITIALIZATION ---
export function initEditor(stateGetter) {
    getState = stateGetter;
    codeEditor.addEventListener('input', debouncedCheckSyntax);
    codeEditor.addEventListener('scroll', () => {
        highlightContainer.scrollTop = codeEditor.scrollTop;
        highlightContainer.scrollLeft = codeEditor.scrollLeft;
    });
}
