(() => {
  const crew = [
    {name:'Sofia Rossi',match:94,sat:9.4,ret:8,stress:88,team:92,lead:64,conflict:86},
    {name:'Luca Bianchi',match:91,sat:8.9,ret:6,stress:78,team:90,lead:58,conflict:74},
    {name:'Emma Clarke',match:97,sat:9.7,ret:12,stress:93,team:87,lead:95,conflict:89},
    {name:'Marco De Santis',match:86,sat:8.2,ret:5,stress:82,team:73,lead:70,conflict:68},
    {name:'Nina Petrov',match:95,sat:9.5,ret:9,stress:84,team:94,lead:71,conflict:90},
    {name:'Daniel Moore',match:92,sat:9.0,ret:11,stress:96,team:76,lead:88,conflict:72},
    {name:'Giulia Romano',match:88,sat:8.8,ret:4,stress:72,team:96,lead:50,conflict:83},
    {name:'Thomas Meyer',match:96,sat:9.6,ret:10,stress:91,team:89,lead:92,conflict:85},
    {name:'Aisha Khan',match:93,sat:9.3,ret:7,stress:80,team:97,lead:62,conflict:93},
    {name:'Matteo Conti',match:90,sat:8.7,ret:6,stress:85,team:84,lead:75,conflict:78},
    {name:'Chloe Martin',match:98,sat:9.8,ret:12,stress:95,team:91,lead:97,conflict:96},
    {name:'Leo Ferreira',match:87,sat:8.4,ret:5,stress:76,team:88,lead:55,conflict:70}
  ].map(x => ({...x, behavior:(x.stress+x.team+x.lead+x.conflict)/4}));

  const owners = [
    {name:'M/Y Aurora Team',fit:94,sat:9.5,fill:6},
    {name:'M/Y Solstice Team',fit:91,sat:8.8,fill:4},
    {name:'M/Y Celeste Management',fit:97,sat:9.8,fill:8},
    {name:'M/Y Bellissima Owner Rep',fit:86,sat:8.1,fill:11},
    {name:'S/Y Levante Captain',fit:95,sat:9.4,fill:5},
    {name:'M/Y Northstar Management',fit:92,sat:9.1,fill:9},
    {name:'M/Y Luna Owner',fit:88,sat:8.9,fill:7},
    {name:'M/Y Oceanis Captain',fit:96,sat:9.7,fill:3},
    {name:'M/Y Aria Owner Rep',fit:93,sat:9.2,fill:5},
    {name:'S/Y Eolo Captain',fit:90,sat:8.8,fill:6},
    {name:'M/Y Serenity Management',fit:98,sat:9.9,fill:10},
    {name:'M/Y Mare Blu Captain',fit:87,sat:8.3,fill:4}
  ];

  const mean = a => a.reduce((s,v)=>s+v,0)/a.length;
  const corr = (xs,ys) => {
    const mx=mean(xs), my=mean(ys);
    const n=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0);
    const dx=Math.sqrt(xs.reduce((s,x)=>s+(x-mx)**2,0));
    const dy=Math.sqrt(ys.reduce((s,y)=>s+(y-my)**2,0));
    return dx&&dy ? n/(dx*dy) : 0;
  };
  const fmt = n => Math.round(n*100)/100;
  const rMatchSat = corr(crew.map(x=>x.match),crew.map(x=>x.sat));
  const rMatchRet = corr(crew.map(x=>x.match),crew.map(x=>x.ret));
  const rBehSat = corr(crew.map(x=>x.behavior),crew.map(x=>x.sat));
  const rOwnerSat = corr(owners.map(x=>x.fit),owners.map(x=>x.sat));
  const hiCrew = crew.filter(x=>x.match>=93);
  const loCrew = crew.filter(x=>x.match<93);
  const hiSat = mean(hiCrew.map(x=>x.sat)).toFixed(1);
  const loSat = mean(loCrew.map(x=>x.sat)).toFixed(1);
  const hiRet = mean(hiCrew.map(x=>x.ret)).toFixed(1);
  const loRet = mean(loCrew.map(x=>x.ret)).toFixed(1);

  const css = `
    .insight-section{padding:64px 0 80px}.insight-hero{background:linear-gradient(135deg,#0e2d3f,#173f56);color:#fff;border-radius:28px;padding:28px;margin-bottom:20px}.insight-hero h2{color:#fff;margin:4px 0 8px}.insight-hero p{color:#dce7ec;max-width:900px}.insight-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px}.insight-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:var(--shadow)}.insight-card strong.big{display:block;font-size:32px;color:var(--navy);line-height:1.1;margin:6px 0}.insight-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:800}.signal{display:inline-block;margin-top:10px;padding:5px 9px;border-radius:999px;background:#e8f4ef;color:#2d745b;font-size:12px;font-weight:900}.signal.warn{background:#fff4df;color:#946321}.insight-chart{background:#fff;border:1px solid var(--line);border-radius:22px;padding:20px;margin-top:16px}.insight-row{display:grid;grid-template-columns:170px 1fr 72px;gap:10px;align-items:center;margin:12px 0}.insight-track{height:14px;background:#edf1f3;border-radius:999px;overflow:hidden}.insight-fill{height:100%;background:var(--navy);border-radius:999px}.pm-takeaways{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px}.pm-takeaway{background:var(--pink2);border-radius:18px;padding:18px}.pm-takeaway b{color:var(--navy)}.method-note{margin-top:16px;padding:14px 16px;border-radius:14px;background:#fff7df;border:1px solid #ecdba6;color:#6c5a22;font-size:13px}@media(max-width:850px){.insight-grid,.pm-takeaways{grid-template-columns:1fr}.insight-row{grid-template-columns:120px 1fr 58px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='insight-section';
  section.id='product-insights';
  section.innerHTML=`<div class="shell">
    <div class="insight-hero">
      <div class="kicker" style="color:#d4e1e7">SYNTHETIC OUTCOME ANALYSIS</div>
      <h2>What the sample data suggests about product value</h2>
      <p>This section turns the illustrative Crew and Owner profiles into product hypotheses. These are not measured production KPIs; they are examples of the relationships Yacht Match should validate after launch.</p>
    </div>

    <div class="head"><div class="kicker">Crew-side signals</div><h2>Higher fit should predict better outcomes — not just more clicks</h2></div>
    <div class="insight-grid">
      <div class="insight-card"><div class="insight-label">Match score ↔ satisfaction</div><strong class="big">r = ${fmt(rMatchSat)}</strong><div>In this sample, higher match scores move closely with crew satisfaction.</div><span class="signal">Strong positive signal</span></div>
      <div class="insight-card"><div class="insight-label">Match score ↔ retention</div><strong class="big">r = ${fmt(rMatchRet)}</strong><div>Higher-fit placements also tend to stay longer onboard in this synthetic dataset.</div><span class="signal">Retention hypothesis</span></div>
      <div class="insight-card"><div class="insight-label">Behavior profile ↔ satisfaction</div><strong class="big">r = ${fmt(rBehSat)}</strong><div>The questionnaire signal appears related to post-hire satisfaction, supporting the core differentiation beyond CVs.</div><span class="signal">Behavioral-fit hypothesis</span></div>
    </div>

    <div class="insight-chart"><h3>Outcome gap by Crew match band</h3>
      <div class="insight-row"><span>93%+ match — satisfaction</span><div class="insight-track"><div class="insight-fill" style="width:${Number(hiSat)*10}%"></div></div><strong>${hiSat}/10</strong></div>
      <div class="insight-row"><span>&lt;93% match — satisfaction</span><div class="insight-track"><div class="insight-fill" style="width:${Number(loSat)*10}%"></div></div><strong>${loSat}/10</strong></div>
      <div class="insight-row"><span>93%+ match — retention</span><div class="insight-track"><div class="insight-fill" style="width:${Math.min(100,Number(hiRet)/12*100)}%"></div></div><strong>${hiRet} mo</strong></div>
      <div class="insight-row"><span>&lt;93% match — retention</span><div class="insight-track"><div class="insight-fill" style="width:${Math.min(100,Number(loRet)/12*100)}%"></div></div><strong>${loRet} mo</strong></div>
    </div>

    <div class="head" style="margin-top:38px"><div class="kicker">Owner-side signals</div><h2>Owner value is quality of hire, not merely speed of hire</h2></div>
    <div class="insight-grid">
      <div class="insight-card"><div class="insight-label">Hire fit ↔ owner satisfaction</div><strong class="big">r = ${fmt(rOwnerSat)}</strong><div>In the sample, owners are more satisfied when the eventual hire has a higher fit score.</div><span class="signal">Core value signal</span></div>
      <div class="insight-card"><div class="insight-label">What not to overclaim</div><strong class="big">Time-to-fill</strong><div>This sample does not prove that higher match scores always reduce hiring time. Speed and fit should be measured separately.</div><span class="signal warn">Avoid false causality</span></div>
      <div class="insight-card"><div class="insight-label">Best owner outcome</div><strong class="big">Quality + retention</strong><div>The strongest owner KPI is a compatible hire who remains onboard and performs well after 30/60/90 days.</div><span class="signal">North-star candidate</span></div>
    </div>

    <div class="head" style="margin-top:38px"><div class="kicker">Product-manager interpretation</div><h2>What Yacht Match should learn from real usage</h2></div>
    <div class="pm-takeaways">
      <div class="pm-takeaway"><b>1. Validate the behavioral layer.</b><br>Track whether questionnaire-derived compatibility predicts satisfaction and retention after controlling for role, experience and certifications.</div>
      <div class="pm-takeaway"><b>2. Capture outcomes after hiring.</b><br>Add 30-day, 60-day and 90-day feedback from both Crew and Owner. Without outcome data, the matching engine cannot improve credibly.</div>
      <div class="pm-takeaway"><b>3. Explain every recommendation.</b><br>Show why a candidate matches: professional fit, availability, vessel context, lifestyle, leadership and any gaps. Trust matters as much as the score.</div>
      <div class="pm-takeaway"><b>4. Optimize for successful placements.</b><br>Do not use swipes, profile views or message volume as the main success metric. The product claim is better hiring fit, so the metric should follow the hire.</div>
      <div class="pm-takeaway"><b>5. Separate hard filters from soft compatibility.</b><br>Certifications, visas and availability may be non-negotiable. Personality and onboard culture should improve ranking only after hard requirements are satisfied.</div>
      <div class="pm-takeaway"><b>6. Learn where the model fails.</b><br>Record declined matches, early departures and owner dissatisfaction, then classify the cause: skill gap, personality mismatch, compensation, schedule, culture or inaccurate profile data.</div>
    </div>

    <div class="method-note"><strong>Important:</strong> all values in this section are derived from the synthetic sample profiles shown above. Correlations are illustrative and must not be presented externally as evidence that Yacht Match already improves hiring outcomes.</div>
  </div>`;

  const main=document.querySelector('main');
  if(main) main.appendChild(section); else document.body.appendChild(section);
})();
