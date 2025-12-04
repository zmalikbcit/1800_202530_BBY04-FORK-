import{o as g,c as v,d as h,q as f,v as _,i as b,b as y,f as L,e as E,j as w,s as C}from"./firebaseConfig-DM3SJotR.js";/* empty css              */const u=t=>document.querySelector(t),U=new URL(location.href),m=U.searchParams.get("docID");if(!m)throw document.body.innerHTML="<h2>Invalid group.</h2>",new Error("Missing docID in URL");let p="/images/default_user.png";async function x(t){try{const s=E(h,"users",t),n=await w(s);if(n.exists()){const i=n.data();i.photoURL&&(p=i.photoURL)}}catch(s){console.error("Error loading user profile pic:",s)}}function R(t){document.body.innerHTML=`
    <div id="title_container">
      <div id="title_inner_container">
        <h1 id="title">Group Chat</h1>
      </div>
    </div>

    <div id="chat_container">
      <div id="chat_inner_container">
        <div id="chat_content_container"></div>

        <div id="chat_input_container">
          <input
            id="chat_input"
            maxlength="500"
            placeholder="${t}, say something…"
          />
          <button id="chat_input_send" disabled>Send</button>
        </div>

        <div id="chat_logout_container">
          <button id="backBtn">← Back to group</button>
        </div>
      </div>
    </div>
  `}function T(t,s){const n=u("#chat_content_container");n&&(n.innerHTML="",t.forEach(i=>{const r=i.uid===s,o=document.createElement("div");o.className=`msg-row ${r?"you":"other"}`;const a=document.createElement("img");a.className="msg-pfp",a.src=i.photoURL||"/images/default_user.png";const e=document.createElement("div");if(e.className=`msg-wrapper ${r?"you":"other"}`,!r){const l=document.createElement("div");l.className="msg-username",l.textContent=i.user||"Unknown",e.appendChild(l)}const c=document.createElement("div");c.className=`message ${r?"you":"other"}`,c.textContent=i.text,e.appendChild(c);const d=document.createElement("div");d.className="msg-time",i.timestamp?.toDate&&(d.textContent=i.timestamp.toDate().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),e.appendChild(d),o.appendChild(a),o.appendChild(e),n.appendChild(o)}),n.scrollTop=n.scrollHeight)}g(L(),async t=>{if(!t){document.body.innerHTML="<h2>Sign in required.</h2>";return}const s=t.displayName||"User";await x(t.uid),R(s),u("#backBtn")?.addEventListener("click",()=>{window.location.href=`/myGroup.html?docID=${m}`});const n=v(h,"groups",m,"chat"),i=f(n,_("timestamp","asc")),r=t.uid;b(i,e=>{const c=[];e.forEach(d=>c.push(d.data())),T(c,r)});const o=u("#chat_input"),a=u("#chat_input_send");o.addEventListener("input",()=>{const e=o.value.trim().length>0;a.disabled=!e,a.classList.toggle("enabled",e)}),a.addEventListener("click",async()=>{const e=o.value.trim();e&&(await y(n,{user:s,uid:t.uid,text:e,photoURL:p,timestamp:C()}).catch(c=>console.error("Send error:",c)),o.value="",a.disabled=!0,a.classList.remove("enabled"))})});
