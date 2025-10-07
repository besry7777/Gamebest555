const getEl = id => document.getElementById(id);
const codeEditor = getEl('code-editor');
const highlightingLayer = getEl('highlighting-layer');
const highlightContainer = getEl('highlighting-layer-container');
const autocompletePopup = getEl('autocomplete-popup');
const tabsContainer = getEl('script-tabs');

let getState;
let syntaxError = null;
let isHighlighting = false;
let autocomplete = {
    active: false,
    index: 0,
    items: [],
    word: '',
    startPos: 0
};

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// --- SYNTAX HIGHLIGHTING AND ERROR CHECKING ---
const keywords = new Set(['local', 'function', 'if', 'then', 'else', 'elseif', 'end', 'for', 'while', 'do', 'return', 'and', 'or', 'not', 'break', 'in', 'repeat', 'until', 'true', 'false', 'nil']);
const knownGlobals = new Set(['game', 'print', 'workspace', 'wait', 'script', 'math', 'Vector3', 'CFrame', 'Color3', 'Instance', 'pcall', 'xpcall', 'tostring', 'tonumber', 'type', 'error', 'assert']);

const updateHighlighting = () => {
    if (isHighlighting) return;
    isHighlighting = true;
    
    const text = codeEditor.value;
    const knownVariables = new Set();
    
    // Find all local variables and function names
    const varPatterns = [
        /local\s+([\w_]+)/g, // local var
        /function\s+([\w_.:]+)/g, // function name / function lib.name
        /local\s+function\s+([\w_]+)/g, // local function name
        /for\s+([\w_,\s]+)\s+in/g, // for k,v in
    ];
    varPatterns.forEach(pattern => {
        text.replace(pattern, (match, names) => {
            names.split(',').forEach(name => {
                const cleanName = name.trim().split(':')[0]; // handle obj:func()
                if (cleanName) knownVariables.add(cleanName);
            });
        });
    });

    const lines = text.split('\n');
    let html = '';

    for (let i = 0; i < lines.length; i++) {
        let lineHtml = lines[i]
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Comments
        lineHtml = lineHtml.replace(/(--\[\[[\s\S]*?\]\])|(--.*)/g, '<span class="hl-comment">$&</span>');

        // Strings
        lineHtml = lineHtml.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="hl-string">$&</span>');

        // Keywords, Globals, Variables, Numbers
        lineHtml = lineHtml.replace(/\b([\w_]+)\b/g, (word) => {
            if (keywords.has(word)) return `<span class="hl-keyword">${word}</span>`;
            if (knownGlobals.has(word)) return `<span class="hl-global">${word}</span>`;
            if (!isNaN(parseFloat(word)) && !word.match(/[a-zA-Z_]/)) return `<span class="hl-number">${word}</span>`;
            if (knownVariables.has(word)) return `<span>${word}</span>`;
            if (/[ก-๙]/.test(word)) return `<span class="hl-thai-error">${word}</span>`;
            // Check if it's a property of a known object (basic check)
            if (lineHtml.includes('.' + word) || lineHtml.includes(':' + word)) return `<span>${word}</span>`;
            return `<span class="hl-unknown-var">${word}</span>`;
        });
        
        // Restore comments and strings from placeholders if needed
        // This regex approach is simplified; for perfect highlighting, a proper tokenizer is needed.

        if (syntaxError && syntaxError.line === i + 1) {
            html += `<div class="syntax-error">${lineHtml || ' '}</div>`;
        } else {
            html += `<div>${lineHtml || ' '}</div>`;
        }
    }

    highlightingLayer.innerHTML = html;
    isHighlighting = false;
};

const checkSyntax = () => {
    try {
        const L = fengari.lauxlib.luaL_newstate();
        const status = fengari.lauxlib.luaL_loadstring(L, fengari.to_luastring(codeEditor.value));
        if (status !== fengari.lua.LUA_OK) {
            const errorMsg = fengari.to_jsstring(fengari.lua.lua_tostring(L, -1));
            const lineMatch = errorMsg.match(/\[string "..."\]:(\d+):/);
            syntaxError = {
                line: lineMatch ? parseInt(lineMatch[1]) : -1,
                message: errorMsg
            };
        } else {
            syntaxError = null;
        }
        fengari.lua.lua_close(L);
    } catch (e) {
        syntaxError = null;
    }
    updateHighlighting();
};
const debouncedCheckSyntax = debounce(checkSyntax, 300);

// --- AUTOCOMPLETE ---
const showAutocomplete = () => {
    const { selectionStart } = codeEditor;
    const textToCursor = codeEditor.value.substring(0, selectionStart);
    const match = textToCursor.match(/[\w_]+$/);

    if (!match) {
        hideAutocomplete();
        return;
    }

    autocomplete.word = match[0];
    autocomplete.startPos = selectionStart - autocomplete.word.length;
    
    const suggestions = [...knownGlobals, ...keywords]
        .filter(item => item.startsWith(autocomplete.word))
        .slice(0, 10);

    if (suggestions.length === 0) {
        hideAutocomplete();
        return;
    }

    autocomplete.items = suggestions;
    autocomplete.active = true;
    autocomplete.index = 0;
    
    let itemsHtml = '';
    suggestions.forEach((item, i) => {
        itemsHtml += `<div class="autocomplete-item ${i === 0 ? 'selected' : ''}">${item}</div>`;
    });
    autocompletePopup.innerHTML = itemsHtml;
    
    // Position popup (this is a simplified positioning)
    const lineHeight = 24; // approx
    const line = textToCursor.split('\n').length;
    const col = textToCursor.split('\n').pop().length;
    autocompletePopup.style.top = `${line * lineHeight + 15}px`;
    autocompletePopup.style.left = `${col * 9 - (autocomplete.word.length * 9)}px`;
    autocompletePopup.classList.remove('hidden');
};

const hideAutocomplete = () => {
    autocomplete.active = false;
    autocompletePopup.classList.add('hidden');
};

const navigateAutocomplete = (e) => {
    if (!autocomplete.active) return;
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        autocomplete.index = (autocomplete.index + 1) % autocomplete.items.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        autocomplete.index = (autocomplete.index - 1 + autocomplete.items.length) % autocomplete.items.length;
    } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectAutocompleteItem();
        return;
    } else if (e.key === 'Escape') {
        e.preventDefault();
        hideAutocomplete();
        return;
    } else {
        return; // Don't update for other keys
    }

    Array.from(autocompletePopup.children).forEach((child, i) => {
        child.classList.toggle('selected', i === autocomplete.index);
    });
};

const selectAutocompleteItem = () => {
    if (!autocomplete.active) return;
    const selected = autocomplete.items[autocomplete.index];
    const text = codeEditor.value;
    codeEditor.value = text.substring(0, autocomplete.startPos) + selected + text.substring(codeEditor.selectionStart);
    codeEditor.selectionStart = codeEditor.selectionEnd = autocomplete.startPos + selected.length;
    hideAutocomplete();
    debouncedCheckSyntax();
};

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

export function closeScriptByPath(path, scripts, activeScriptIndex) {
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
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            onCloseScript(script.path);
        };

        tab.appendChild(closeBtn);
        tab.onclick = () => onSwitchScript(index);
        tabsContainer.appendChild(tab);
    });
}

// --- INITIALIZATION ---
export function initEditor(stateGetter) {
    getState = stateGetter;
    
    codeEditor.addEventListener('input', () => {
        debouncedCheckSyntax();
        showAutocomplete();
    });

    codeEditor.addEventListener('keydown', navigateAutocomplete);
    
    codeEditor.addEventListener('scroll', () => {
        highlightContainer.scrollTop = codeEditor.scrollTop;
        highlightContainer.scrollLeft = codeEditor.scrollLeft;
    });

    autocompletePopup.addEventListener('click', e => {
        if (e.target.classList.contains('autocomplete-item')) {
            const items = Array.from(autocompletePopup.children);
            autocomplete.index = items.indexOf(e.target);
            selectAutocompleteItem();
        }
    });
}
