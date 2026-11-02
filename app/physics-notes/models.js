(function(root){
'use strict';
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(Number(x))?Number(x):0));
function model(kind,input=0.5,mode=0){
 const q=clamp(input),b=mode?1:0;
 const result={kind,q,rows:[],points:[],vectors:[],bodies:[],plot:null};
 const row=(key,value)=>result.rows.push({key,value});
 const body=(x,y,m=1,label='A')=>result.bodies.push({x,y,m,label});
 const vector=(x,y,dx,dy,label)=>result.vectors.push({x,y,dx,dy,label});
 const curve=(xkey,ykey,f)=>{result.plot={xkey,ykey};for(let i=0;i<=40;i++){const x=i/20;result.points.push([x,f(x)]);}};
 switch(kind){
 case 'units':row('length','metreRuler');row('mass','kilogramApparatus');row('duration','secondClock');break;
 case 'gravity':body(0,0,1);row('mass',1);row('weight',1-q*.8);row('density',1);vector(0,0,0,-(1-q*.8),'weight');break;
 case 'density':{const mass=1+q*3,volume=b?2:1;body(-1,0,1,'A');body(1,0,mass,'B');row('massA',1);row('volumeA',1);row('densityA',1);row('massB',mass);row('volumeB',volume);row('densityB',mass/volume);break;}
 case 'boundary':row('boundary',b?'combined':'object');row('process',b?'internal':'external');body(-.8,0,1,'A');body(.8,0,1,'B');vector(-.8,0,1.6,0,'energy');break;
 case 'energy':row('kinetic',1-q);row('potential',q);row('internalEnergy',0);row('totalEnergy',1);body(Math.sqrt(q)-1,0,1);break;
 case 'friction':{const loss=Math.min(1,2*q),distance=Math.min(q,.5);row('kinetic',1-loss);row('internalEnergy',loss);row('totalEnergy',1);row('distance',distance);row('state',q>=.5?'stopped':'sliding');body(-1+distance*3,0);break;}
 case 'angle':{const theta=q*Math.PI/3,fx=4*Math.cos(theta),fy=4*Math.sin(theta),normal=10-fy,friction=.2*normal;row('forwardForce',fx);row('normal',normal);row('friction',friction);row('netHorizontal',fx-friction);body(0,0);vector(0,0,fx/10,fy/10,'pull');vector(0,0,0,normal/10,'normal');vector(0,0,-friction/10,0,'friction');vector(0,0,0,-1,'weight');break;}
 case 'energyGraph':result.plot={xkey:'position',ykey:'kinetic',dashedFrom:.5};for(let i=0;i<=40;i++){let x=i/40;result.points.push([x,Math.max(0,1-2*x)]);}row('kinetic',Math.max(0,1-2*q));row('internalEnergy',Math.min(1,2*q));row('totalEnergy',1);row('state',q>.5?'unreachable':q===.5?'stopped':'sliding');result.marker=[Math.min(q,.5),Math.max(0,1-2*q)];break;
 case 'powerGraph':{const power=.5+q;curve('time','energy',t=>power*t);row('power',power);row('duration',2);row('energy',2*power);break;}
 case 'lift':{const duration=1+q*3,power=1/duration;body(0,q);vector(0,q,0,.8,'liftForce');vector(0,q,0,-.8,'weight');row('duration',duration);row('energy',1);row('liftingPower',power);row('gravityPower',-power);row('netPower',0);break;}
 case 'momentum':{const velocity=2*q-1;body(0,0);vector(0,0,velocity,0,'momentum');row('velocity',velocity);row('momentum',velocity);row('kinetic',.5*velocity*velocity);break;}
 case 'momentumEnergy':{const speed=.25+q;body(-1,0,1,'A');body(1,0,1,'B');vector(-1,0,speed,0,'pA');vector(1,0,-speed,0,'pB');row('pA',speed);row('pB',-speed);row('totalMomentum',0);row('kinetic',speed*speed);break;}
 case 'recoil':{const m=1+3*q;body(-1,0,1,'A');body(1,0,m,'B');vector(-1,0,-1,0,'pA');vector(1,0,1,0,'pB');row('massA',1);row('massB',m);row('velocityA',-1);row('velocityB',1/m);row('totalMomentum',0);break;}
 case 'momentumBoundary':body(-1,0,1,'A');body(1,0,1,'B');vector(-1,0,1,0,'forceA');vector(1,0,-1,0,'forceB');row('boundary',b?'combined':'object');row('interaction',b?'internal':'external');row('totalForce',b?0:1);break;
 case 'impulseGraph':{const duration=1+3*q,peak=2/duration;result.plot={xkey:'time',ykey:'force'};result.points=[[0,0],[duration/2,peak],[duration,0]];row('duration',duration);row('peakForce',peak);row('averageForce',1/duration);row('impulse',1);break;}
 case 'collision':{const m1=1,m2=1+3*q,u1=1,u2=0,e=b;const v1=(m1*u1+m2*u2-m2*e*(u1-u2))/(m1+m2),v2=(m1*u1+m2*u2+m1*e*(u1-u2))/(m1+m2);body(-.8,0,m1,'A');body(.8,0,m2,'B');vector(-.8,0,v1,0,'velocityA');vector(.8,0,v2,0,'velocityB');row('massA',m1);row('massB',m2);row('velocityA',v1);row('velocityB',v2);row('initialMomentum',1);row('totalMomentum',m1*v1+m2*v2);row('initialKinetic',.5);row('kinetic',.5*m1*v1*v1+.5*m2*v2*v2);row('collisionType',b?'elastic':'sticking');break;}
 case 'timeline':row('capture','momentumStage');row('swing','energyStage');break;
 case 'vectors':{const theta=(20+q*50)*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);vector(0,0,c*c,s*c,'pA');vector(c*c,s*c,s*s,-s*c,'pB');vector(0,0,1,0,'totalMomentum');row('pxA',c*c);row('pyA',s*c);row('pxB',s*s);row('pyB',-s*c);row('pxTotal',1);row('pyTotal',0);row('initialKinetic',.5);row('kinetic',.5);break;}
 case 'com':{const mass=1+3*q,x=(mass-1)/(mass+1);body(-1,0,1,'A');body(1,0,mass,'B');body(x,.6,.2,'CM');row('massA',1);row('massB',mass);row('centerPosition',x);break;}
 case 'suspension':body(0,1,.3,'S');body(0,0,.2,'CM');vector(0,1,0,-1,'vertical');row('support','support');row('centerPosition','belowSupport');break;
 case 'fragments':{const t=q*2,x=t,y=2*t-.5*t*t,split=Math.max(0,t-1);body(x-split,y,1,'A');body(x+split,y,1,'B');body(x,y,.2,'CM');row('time',t);row('centerX',x);row('centerY',y);row('accelerationY',-1);row('pxTotal',2);row('pyTotal',2*(2-t));break;}
 case 'components':{const p=2*q-1;result.plot={xkey:'time',ykey:'momentum'};result.points=[[0,p],[1,p],[2,p]];row('pA',p);row('pB',-p);row('totalMomentum',0);break;}
 case 'work':case 'stretch':{const x=1+q;body(-x,0,1,'A');body(x,0,1,'B');body(0,.5,.2,'CM');vector(-x,0,-q,0,'forceA');vector(x,0,q,0,'forceB');row('centerDisplacement',0);row('totalForce',0);row('actualWork',q*q);row('elasticEnergy',q*q);row('pseudoWork',0);break;}
 case 'rocket':{const m=4-3*q,v=Math.log(4/m),p=m*v,exhaustMass=4-m,exhaustX=exhaustMass>0?-m*q/exhaustMass:0;body(q,0,m,'R');if(exhaustMass>0)body(exhaustX,0,exhaustMass,'X');vector(q,0,p/2,0,'rocketMomentum');if(exhaustMass>0)vector(exhaustX,0,-p/2,0,'exhaustMomentum');row('rocketMass',m);row('exhaustMass',exhaustMass);row('rocketVelocity',v);row('rocketMomentum',p);row('exhaustMomentum',-p);row('totalMomentum',0);row('totalMass',4);break;}
 case 'frame':{const v=2*q,exhaust=v-1;body(0,0,1,'R');body(-1,0,.3,'X');vector(-1,0,b?-1:exhaust,0,'exhaustVelocity');row('frame',b?'rocketFrame':'labFrame');row('rocketVelocity',b?0:v);row('exhaustVelocity',b?-1:exhaust);row('relativeExhaust',-1);break;}
 case 'rocketGraph':curve('massRatio','deltaVelocity',r=>Math.log(1+r));row('massRatio',1+3*q);row('deltaVelocity',Math.log(1+3*q));result.points=result.points.map(([x])=>[1+x*1.5,Math.log(1+x*1.5)]);result.marker=[1+3*q,Math.log(1+3*q)];break;
 default:throw Error('Unknown physics notes model: '+kind);
 }
 return result;
}
root.HahaPhysicsNotesModels={model};if(typeof module==='object'&&module.exports)module.exports=root.HahaPhysicsNotesModels;
})(typeof globalThis==='object'?globalThis:this);
