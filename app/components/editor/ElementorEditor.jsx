"use client";

import {useEffect,useRef,useState} from "react";
import "./editor.css";

const uid=()=> "el_"+Date.now()+"_"+Math.random().toString(36).slice(2,7);

const initial=[
 {id:uid(),type:"heading",text:"Your Website Title",x:90,y:80,w:520,h:70,fontSize:42,color:"#171717",bg:"transparent"},
 {id:uid(),type:"text",text:"Drag, resize and customize your website.",x:95,y:165,w:500,h:55,fontSize:18,color:"#555",bg:"transparent"}
];

export default function ElementorEditor(){
 const [els,setEls]=useState(initial);
 const [selected,setSelected]=useState(null);
 const [history,setHistory]=useState([initial]);
 const [future,setFuture]=useState([]);
 const [preview,setPreview]=useState(false);
 const [device,setDevice]=useState("desktop");
 const drag=useRef(null);
 const fileRef=useRef(null);

 const current=selected!==null?els.find(e=>e.id===selected):null;

 const commit=(next)=>{
   setHistory(h=>[...h.slice(-39),next]);
   setFuture([]);
   setEls(next);
 };

 const update=(id,patch)=>{
   const next=els.map(e=>e.id===id?{...e,...patch}:e);
   commit(next);
 };

 const add=(type)=>{
   const base={
    id:uid(),type,text:type==="button"?"Click Me":type==="heading"?"New Heading":
    type==="text"?"New Text":type==="link"?"Open Link":"",x:180,y:220,
    w:type==="shape"?150:type==="image"?300:260,h:type==="shape"?150:type==="image"?190:60,
    fontSize:type==="heading"?34:18,color:"#222",bg:type==="shape"?"#ff416c":"transparent",
    radius:12,shadow:true,rotate:0
   };
   commit([...els,base]);
   setSelected(base.id);
 };

 const remove=()=>{
   if(!selected)return;
   commit(els.filter(e=>e.id!==selected));
   setSelected(null);
 };

 const undo=()=>{
   if(history.length<=1)return;
   const old=history[history.length-2];
   setFuture(f=>[els,...f]);
   setHistory(h=>h.slice(0,-1));
   setEls(old);
 };

 const redo=()=>{
   if(!future.length)return;
   const next=future[future.length-1];
   setFuture(f=>f.slice(0,-1));
   setHistory(h=>[...h,next]);
   setEls(next);
 };

 useEffect(()=>{
   const saved=localStorage.getItem("elementor_editor_page");
   if(saved){
     try{
       const x=JSON.parse(saved);
       setEls(x);setHistory([x]);
     }catch{}
   }
 },[]);

 const save=()=>{
   localStorage.setItem("elementor_editor_page",JSON.stringify(els));
   alert("Saved successfully");
 };

 const startDrag=(e,el)=>{
   if(preview)return;
   e.preventDefault();
   setSelected(el.id);
   drag.current={id:el.id,sx:e.clientX,sy:e.clientY,x:el.x,y:el.y};
   window.addEventListener("pointermove",moveDrag);
   window.addEventListener("pointerup",stopDrag,{once:true});
 };

 const moveDrag=(e)=>{
   const d=drag.current;if(!d)return;
   const dx=e.clientX-d.sx,dy=e.clientY-d.sy;
   setEls(a=>a.map(x=>x.id===d.id?{...x,x:d.x+dx,y:d.y+dy}:x));
 };

 const stopDrag=()=>{
   if(drag.current){
     setEls(a=>{
       setHistory(h=>[...h,a]);
       setFuture([]);
       return a;
     });
   }
   drag.current=null;
   window.removeEventListener("pointermove",moveDrag);
 };

 const upload=(e)=>{
   const f=e.target.files?.[0];
   if(!f)return;
   const reader=new FileReader();
   reader.onload=()=>{
     const im={id:uid(),type:"image",src:reader.result,x:160,y:230,w:320,h:210,
       radius:12,shadow:true,rotate:0};
     commit([...els,im]);
     setSelected(im.id);
   };
   reader.readAsDataURL(f);
   e.target.value="";
 };

 const setField=(key,value)=>{
   if(current)update(current.id,{[key]:value});
 };

 const tools=[
  ["↖","Select",null],["T","Heading","heading"],["≡","Text","text"],
  ["▣","Image","image"],["▶","Video","video"],["●","Button","button"],
  ["◇","Shape","shape"],["🔗","Link","link"]
 ];

 return <div className="ed-root">

  <header className="ed-top">
   <div className="ed-logo">⚡ My Builder</div>
   <button onClick={undo}>↶ Undo</button>
   <button onClick={redo}>↷ Redo</button>
   <div className="device">
    <button className={device==="desktop"?"active":""} onClick={()=>setDevice("desktop")}>🖥</button>
    <button className={device==="tablet"?"active":""} onClick={()=>setDevice("tablet")}>▣</button>
    <button className={device==="mobile"?"active":""} onClick={()=>setDevice("mobile")}>📱</button>
   </div>
   <button onClick={()=>setPreview(!preview)}>👁 {preview?"Edit":"Preview"}</button>
   <button className="save" onClick={save}>💾 Save</button>
  </header>

  <aside className="ed-left">
   {tools.map(([icon,name,type])=>
    <button key={name} title={name}
      onClick={()=>type==="image"?fileRef.current.click():type?add(type):null}>
      <b>{icon}</b><small>{name}</small>
    </button>
   )}
   <input ref={fileRef} hidden type="file" accept="image/*" onChange={upload}/>
   <button onClick={remove} className="danger"><b>🗑</b><small>Delete</small></button>
  </aside>

  <main className="ed-main">
   <div className={"canvas-wrap "+device}>
    <div className="canvas">
     {els.map(el=><EditorElement key={el.id} el={el} selected={selected===el.id}
       preview={preview} onSelect={()=>setSelected(el.id)}
       onDrag={startDrag}/>)}
    </div>
   </div>
  </main>

  <aside className="ed-right">
   <h3>⚙ Properties</h3>

   {!current && <div className="empty">Select an element</div>}

   {current && <>
    <label>Content</label>
    {(current.type==="heading"||current.type==="text"||current.type==="button"||current.type==="link")&&
      <textarea value={current.text||""} onChange={e=>setField("text",e.target.value)}/>}
    
    {current.type==="image"&&<div className="info">🖼 Image selected<br/>Use Image tool to replace.</div>}

    <label>Font Size</label>
    <input type="number" value={current.fontSize||18}
      onChange={e=>setField("fontSize",+e.target.value)}/>

    <label>Text Color</label>
    <input type="color" value={current.color||"#222222"}
      onChange={e=>setField("color",e.target.value)}/>

    <label>Background</label>
    <input type="color"
      value={current.bg==="transparent"?"#ffffff":current.bg||"#ffffff"}
      onChange={e=>setField("bg",e.target.value)}/>

    <label>Width</label>
    <input type="number" value={current.w} onChange={e=>setField("w",+e.target.value)}/>

    <label>Height</label>
    <input type="number" value={current.h} onChange={e=>setField("h",+e.target.value)}/>

    <label>Border Radius</label>
    <input type="range" min="0" max="60" value={current.radius||0}
      onChange={e=>setField("radius",+e.target.value)}/>

    <label>Rotation</label>
    <input type="range" min="-180" max="180" value={current.rotate||0}
      onChange={e=>setField("rotate",+e.target.value)}/>

    <button className="apply" onClick={()=>setField("shadow",!current.shadow)}>
      {current.shadow?"🌑 Shadow ON":"☀ Shadow OFF"}
    </button>
   </>}
  </aside>

 </div>
}

function EditorElement({el,selected,preview,onSelect,onDrag}){
 const style={
   left:el.x,top:el.y,width:el.w,height:el.h,
   fontSize:el.fontSize,color:el.color,
   background:el.bg==="transparent"?"transparent":el.bg,
   borderRadius:el.radius||0,
   transform:`rotate(${el.rotate||0}deg)`,
   boxShadow:el.shadow?"0 12px 28px #0003":"none"
 };

 const common={
   className:"ed-element "+(selected?"selected":""),
   style,
   onPointerDown:e=>onDrag(e,el),
   onClick:e=>{e.stopPropagation();onSelect()}
 };

 if(el.type==="image")
   return <img {...common} src={el.src} alt="uploaded"/>;

 if(el.type==="video")
   return <div {...common}><div className="video-box">▶ VIDEO</div></div>;

 if(el.type==="shape")
   return <div {...common}/>;

 if(el.type==="button")
   return <button {...common}>{el.text}</button>;

 if(el.type==="link")
   return <a {...common} href="#" onClick={e=>e.preventDefault()}>{el.text}</a>;

 return <div {...common}>{el.text}</div>;
}
