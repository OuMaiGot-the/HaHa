/* Animate registered facial patches independently; never move the sculpture. */
window.PhyPhyMotion=(()=>{
  const sources=['phyphy-chess-expressions.png','phyphy-feature-plate.png','phyphy-feature-face.png'].map(name=>{
    const image=new Image();image.src='assets/mascots/'+name;return image;
  });
  const ready=Promise.all(sources.map(image=>image.decode().catch(()=>null)));
  const variants=[
    {name:'bishop',crop:[293,0,450,480],eyes:[[413,184,73,82],[525,164,72,80]],mouth:[486,238,69,63],brows:[[426,160,40,23],[528,142,43,23]],planet:[582,122,37],duration:1350},
    {name:'queen',crop:[858,0,450,490],eyes:[[937,185,80,73],[1035,217,80,68]],mouth:[979,255,65,55],brows:[[971,150,45,24],[1064,176,45,30]],planet:[1134,91,43],duration:1500},
    {name:'knight',crop:[293,480,450,544],eyes:[[450,684,88,90],[556,663,74,85]],mouth:[529,737,53,82],brows:[[465,660,44,36],[565,634,40,26]],planet:[567,543,43],duration:1300},
    {name:'rook',crop:[858,490,450,534],eyes:[[934,680,78,63],[1036,709,80,63]],mouth:[983,730,66,89],brows:[[960,641,45,27],[1064,663,42,34]],planet:[1101,548,40],duration:1600}
  ];
  const configurations=new WeakMap();
  // Remove only the outside backdrop and its grey cast shadow. Flood-fill
  // preserves pale highlights enclosed by the coloured sculpture itself.
  const backdropQueue=new Int32Array(264*300),backdropSeen=new Uint8Array(264*300);
  function transparentBackdrop(ctx){
    const image=ctx.getImageData(0,0,264,300),pixels=image.data;
    backdropSeen.fill(0);let head=0,tail=0;
    function visit(index){
      if(backdropSeen[index])return;backdropSeen[index]=1;
      const offset=index*4,high=Math.max(pixels[offset],pixels[offset+1],pixels[offset+2]),low=Math.min(pixels[offset],pixels[offset+1],pixels[offset+2]);
      if(pixels[offset+3]===0||high===0||(high-low)/high<.28){pixels[offset+3]=0;backdropQueue[tail++]=index;}
    }
    for(let x=0;x<264;x++){visit(x);visit(299*264+x);}
    for(let y=1;y<299;y++){visit(y*264);visit(y*264+263);}
    while(head<tail){const i=backdropQueue[head++],x=i%264;if(x)visit(i-1);if(x<263)visit(i+1);if(i>=264)visit(i-264);if(i<264*299)visit(i+264);}
    ctx.putImageData(image,0,0);
  }
  function drawSource(ctx,image,crop){ctx.drawImage(image,...crop,0,0,264,300);}
  function patch(ctx,image,box,alpha=1,dx=0,dy=0,round=.25){
    const [x,y,w,h]=box;ctx.save();ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.ellipse(x+w/2+dx,y+h/2+dy,w/2,h/2,0,0,Math.PI*2);ctx.clip();
    ctx.drawImage(image,x,y,w,h,x+dx,y+dy,w,h);ctx.restore();
  }
  function draw(canvas,v,progress){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.clearRect(0,0,264,300);
    if(!sources[0].naturalWidth)return;
    drawSource(ctx,sources[0],v.crop);
    if(progress===null||progress>=1||!sources[1].naturalWidth||!sources[2].naturalWidth){transparentBackdrop(ctx);return;}
    // Work in the artwork's original coordinates for accurate feature registration.
    ctx.save();ctx.scale(264/v.crop[2],300/v.crop[3]);ctx.translate(-v.crop[0],-v.crop[1]);
    const pulse=(centre,width)=>Math.max(0,1-Math.abs(progress-centre)/width);
    let blink,mouth,brow;
    if(v.name==='bishop'){blink=pulse(.17,.065);mouth=Math.max(pulse(.43,.16),pulse(.75,.12));brow=pulse(.52,.3);}
    if(v.name==='queen'){blink=pulse(.42,.14);mouth=pulse(.68,.18);brow=pulse(.29,.25);}
    if(v.name==='knight'){blink=Math.max(pulse(.2,.06),pulse(.43,.06));mouth=pulse(.63,.16);brow=pulse(.35,.3);}
    if(v.name==='rook'){blink=pulse(.24,.2);mouth=pulse(.57,.3);brow=pulse(.46,.34);}
    v.eyes.forEach(box=>patch(ctx,sources[2],box,blink));
    patch(ctx,sources[2],v.mouth,mouth);
    v.brows.forEach((box,i)=>{
      patch(ctx,sources[1],[box[0]-5,box[1]-12,box[2]+10,box[3]+22]);
      patch(ctx,sources[0],box,1,0,-brow*(v.name==='queen'&&i===0?17:9));
    });
    const [px,py,r]=v.planet;
    patch(ctx,sources[1],[px-r-4,py-r-4,2*r+8,2*r+8]);
    const theta=progress*Math.PI*2;
    const amount=v.name==='rook'?14:v.name==='knight'?31:24;
    const dx=Math.sin(theta)*amount,dy=(1-Math.cos(theta))*7+dx*.4;
    patch(ctx,sources[0],[px-r,py-r,2*r,2*r],1,dx,dy);
    ctx.restore();
    transparentBackdrop(ctx);
  }
  function create(index){
    const canvas=document.createElement('canvas');canvas.width=264;canvas.height=300;
    canvas.className='phyphy-feature-canvas';canvas.setAttribute('aria-hidden','true');
    const v=variants[index%4];configurations.set(canvas,v);
    ready.then(()=>{draw(canvas,v,null);canvas.classList.add('is-ready');});
    return canvas;
  }
  async function play(canvas){
    const v=configurations.get(canvas);if(!v)return;
    await ready;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    await new Promise(resolve=>{
      let start;
      function frame(now){
        if(!canvas.isConnected){resolve();return;}
        start??=now;const progress=Math.min(1,(now-start)/v.duration);
        draw(canvas,v,progress);
        if(progress<1)requestAnimationFrame(frame);else resolve();
      }
      requestAnimationFrame(frame);
    });
  }
  return{create,play};
})();
