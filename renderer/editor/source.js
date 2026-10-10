import {basicSetup} from 'codemirror';
import {EditorView,keymap,highlightActiveLine} from '@codemirror/view';
import {EditorState,Compartment} from '@codemirror/state';
import {indentWithTab,undo,redo,undoDepth,redoDepth} from '@codemirror/commands';
import {indentUnit,syntaxHighlighting,HighlightStyle} from '@codemirror/language';
import {openSearchPanel} from '@codemirror/search';
import {tags} from '@lezer/highlight';
import {python} from '@codemirror/lang-python';
import {cpp} from '@codemirror/lang-cpp';
import {java} from '@codemirror/lang-java';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {javascript} from '@codemirror/lang-javascript';
import {sql} from '@codemirror/lang-sql';
const instances=new Map();
const valueDescriptor=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');
const readOnlyDescriptor=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'readOnly');
const names={html:'HTML',css:'CSS',javascript:'JavaScript',sql:'SQL',python:'Python',cpp:'C++',c:'C',java:'Java'};
const colors=dark=>syntaxHighlighting(HighlightStyle.define([
 {tag:tags.keyword,color:dark?'#c7b4ff':'#6944b8'},
 {tag:[tags.string,tags.special(tags.string)],color:dark?'#96e4ba':'#1b7449'},
 {tag:[tags.number,tags.bool],color:dark?'#efc180':'#96591c'},
 {tag:tags.comment,color:dark?'#8ca7c4':'#657386',fontStyle:'italic'},
 {tag:[tags.function(tags.variableName),tags.typeName],color:dark?'#91d8f1':'#126b8c'},
 {tag:tags.operator,color:dark?'#efafcc':'#a13d6c'}
]));
const translations={'Find':'Pronađi','Replace':'Zamijeni','next':'sljedeće','previous':'prethodno','all':'sve','match case':'Velika/mala slova','regexp':'Regularni izraz','by word':'Cijela riječ','replace':'zamijeni','replace all':'zamijeni sve','close':'zatvori','Go to line':'Idi na red','go':'idi','Fold line':'Sklopi red','Unfold line':'Proširi red'};
function attach(textarea,options={}){
 if(!textarea||instances.has(textarea.id))return instances.get(textarea?.id);
 const host=document.createElement('section');host.className='eldi-code-editor';host.setAttribute('aria-label','Programski editor');
 host.innerHTML='<div class="editor-toolbar"><strong class="editor-language"></strong><div><button type="button" data-editor="undo" title="Poništi · Ctrl+Z" aria-label="Poništi izmjenu">↶</button><button type="button" data-editor="redo" title="Ponovi · Ctrl+Shift+Z" aria-label="Ponovi izmjenu">↷</button><button type="button" data-editor="find">Pretraži</button><button type="button" data-editor="simple" aria-pressed="false">Jednostavni prikaz</button></div></div><div class="editor-surface"></div><div class="editor-footer"><span class="editor-position"></span><span>Ctrl+Enter: pokreni · Esc, zatim Tab: izlaz iz editora</span></div>';
 textarea.before(host);textarea.hidden=true;host.append(textarea);
 const syntax=new Compartment(),theme=new Compartment(),editable=new Compartment();
 let syncing=false,simple=false,currentKey='',language='python',dark=document.body.classList.contains('dark'),view,disposed=false;
 const currentLanguage=()=>options.language?.()||'python';
 const currentContext=()=>String(options.key?.()||currentLanguage());
 const langExtension=()=>({python,java,html,css,javascript,sql}[language]||cpp)();
 const makeState=doc=>EditorState.create({doc,extensions:[keymap.of([{key:'Mod-Enter',run:()=>{if(!textarea.readOnly)options.onRun?.();return true;}},indentWithTab]),basicSetup,indentUnit.of('    '),EditorState.phrases.of(translations),syntax.of(langExtension()),editable.of([EditorState.readOnly.of(textarea.readOnly),EditorView.editable.of(!textarea.readOnly)]),theme.of([EditorView.theme({}, {dark}),colors(dark)]),EditorView.contentAttributes.of({'aria-label':textarea.getAttribute('aria-label')||'Programski kod','spellcheck':'false'}),highlightActiveLine(),EditorView.updateListener.of(update=>{
   if(update.docChanged&&!syncing){valueDescriptor.set.call(textarea,update.state.doc.toString());textarea.dispatchEvent(new Event('input',{bubbles:true}));}
   if(view)updateStatus();
 })]});
 function updateStatus(){if(disposed)return;const pos=view.state.selection.main.head,line=view.state.doc.lineAt(pos);host.querySelector('.editor-position').textContent=`Red ${line.number}, kolona ${pos-line.from+1} · ${view.state.doc.lines} redova`;host.querySelector('.editor-language').textContent=names[language]||language;host.querySelector('[data-editor=undo]').disabled=textarea.readOnly||simple||undoDepth(view.state)===0;host.querySelector('[data-editor=redo]').disabled=textarea.readOnly||simple||redoDepth(view.state)===0;host.querySelector('[data-editor=find]').disabled=simple;}
 language=currentLanguage();currentKey=currentContext();view=new EditorView({state:makeState(valueDescriptor.get.call(textarea)),parent:host.querySelector('.editor-surface')});
 function setValue(value){const text=String(value??'');valueDescriptor.set.call(textarea,text);const nextKey=currentContext(),nextLanguage=currentLanguage();syncing=true;try{if(nextKey!==currentKey||nextLanguage!==language){currentKey=nextKey;language=nextLanguage;view.setState(makeState(text));}else if(view.state.doc.toString()!==text){view.dispatch({changes:{from:0,to:view.state.doc.length,insert:text}});}}finally{syncing=false;}updateStatus();}
 function setReadOnly(value){readOnlyDescriptor.set.call(textarea,value);view.dispatch({effects:editable.reconfigure([EditorState.readOnly.of(!!value),EditorView.editable.of(!value)])});updateStatus();}
 Object.defineProperty(textarea,'value',{configurable:true,get(){return valueDescriptor.get.call(textarea);},set:setValue});
 Object.defineProperty(textarea,'readOnly',{configurable:true,get(){return readOnlyDescriptor.get.call(textarea);},set:setReadOnly});
 const originalFocus=textarea.focus;
 textarea.focus=function(...args){if(simple)originalFocus.apply(textarea,args);else view.focus();};
 const nativeInput=()=>{if(simple)setValue(valueDescriptor.get.call(textarea));};textarea.addEventListener('input',nativeInput);
 host.querySelector('[data-editor=undo]').onclick=()=>{undo(view);view.focus();};host.querySelector('[data-editor=redo]').onclick=()=>{redo(view);view.focus();};host.querySelector('[data-editor=find]').onclick=()=>{openSearchPanel(view);};
 host.querySelector('[data-editor=simple]').onclick=()=>{simple=!simple;host.classList.toggle('is-simple',simple);textarea.hidden=!simple;host.querySelector('.editor-surface').hidden=simple;const b=host.querySelector('[data-editor=simple]');b.setAttribute('aria-pressed',String(simple));b.textContent=simple?'Napredni prikaz':'Jednostavni prikaz';updateStatus();textarea.focus();};
 const observer=new MutationObserver(()=>{const next=document.body.classList.contains('dark');if(next!==dark){dark=next;view.dispatch({effects:theme.reconfigure([EditorView.theme({},{dark}),colors(dark)])});}});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 const api={view,destroy(){if(disposed)return;disposed=true;observer.disconnect();textarea.removeEventListener('input',nativeInput);const text=valueDescriptor.get.call(textarea),ro=textarea.readOnly;delete textarea.value;delete textarea.readOnly;textarea.focus=originalFocus;valueDescriptor.set.call(textarea,text);readOnlyDescriptor.set.call(textarea,ro);textarea.hidden=false;host.before(textarea);view.destroy();host.remove();instances.delete(textarea.id);}};
 instances.set(textarea.id,api);updateStatus();return api;
}
window.ELDICodeEditor=Object.freeze({attach,destroy:id=>instances.get(id)?.destroy(),destroyAll:()=>{for(const api of [...instances.values()])api.destroy();}});
