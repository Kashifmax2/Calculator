(function(){
const output = document.getElementById('output');
const history = document.getElementById('history');
const keys = document.querySelector('.keys');


let a = null, b = null, op = null, enteringB = false, justEvaluated = false;


function format(n){
if (n === null || n === undefined) return '0';
const s = Number(n);
if (!isFinite(s)) return '∞';
if (Number.isInteger(s)) return s.toLocaleString();
return s.toLocaleString(undefined, { maximumFractionDigits: 12 });
}


function setOutput(text){ output.textContent = text; }


function appendDigit(d){
if (justEvaluated && !enteringB && op === null){ a = b = op = null; enteringB = false; justEvaluated = false; setOutput('0'); history.textContent=''; }
if (!enteringB){ if (a === null) a = '0'; if (d === '.' && String(a).includes('.')) return; a = String(a) === '0' && d !== '.' ? d : String(a) + d; setOutput(a); }
else { if (b === null) b = '0'; if (d === '.' && String(b).includes('.')) return; b = String(b) === '0' && d !== '.' ? d : String(b) + d; setOutput(b); }
}


function chooseOp(nextOp){ if (a === null) a = '0'; if (enteringB && b !== null){ evaluate(); } op = nextOp; enteringB = true; justEvaluated = false; history.textContent = `${format(Number(a))} ${symbol(op)}`; setOutput('0'); b = null; }
function symbol(o){ return o === '*' ? '×' : o === '/' ? '÷' : o; }


function evaluate(){ if (op === null) return; const x = Number(a); const y = Number(b ?? a); let result; switch(op){ case '+': result = x + y; break; case '-': result = x - y; break; case '*': result = x * y; break; case '/': result = y === 0 ? NaN : x / y; break; } history.textContent = `${format(x)} ${symbol(op)} ${format(y)} =`; setOutput(isNaN(result) ? 'Error' : format(result)); a = isNaN(result) ? null : String(result); b = null; justEvaluated = true; enteringB = false; op = null; }


function clearAll(){ a = b = op = null; enteringB = false; justEvaluated = false; setOutput('0'); history.textContent=''; }
function backspace(){ if (!enteringB){ if (a === null) return; a = String(a).length <= 1 ? '0' : String(a).slice(0, -1); setOutput(a); } else { if (b === null) return; b = String(b).length <= 1 ? '0' : String(b).slice(0, -1); setOutput(b); } }
function percent(){ if (!enteringB){ if (a === null) a = '0'; a = String(Number(a) / 100); setOutput(format(Number(a))); } else { if (b === null) b = '0'; b = String(Number(b) / 100); setOutput(format(Number(b))); } }


keys.addEventListener('click', (e)=>{ const btn = e.target.closest('button.key'); if (!btn) return; const num = btn.getAttribute('data-num'); const action = btn.getAttribute('data-action'); if (num !== null){ appendDigit(num); return; } if (action === 'dot') { appendDigit('.'); return; } if (action === 'clear') { clearAll(); return; } if (action === 'backspace') { backspace(); return; } if (action === 'percent') { percent(); return; } if (action === 'equals') { evaluate(); return; } if (action === 'op') { chooseOp(btn.getAttribute('data-op')); return; } });


window.addEventListener('keydown', (e)=>{ const k = e.key; if ((k >= '0' && k <= '9')) { appendDigit(k); return; } if (k === '.') { appendDigit('.'); return; } if (k === 'Backspace') { backspace(); return; } if (k === 'Escape') { clearAll(); return; } if (k === 'Enter' || k === '=') { evaluate(); return; } if (['+','-','*','/'].includes(k)) { chooseOp(k); return; } if (k === '%') { percent(); return; } });


clearAll();
})();