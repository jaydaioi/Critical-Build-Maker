const primitive=(key,value=0)=>({key,type:typeof value==='boolean'?'boolean':typeof value==='string'?'string':'number',value:String(value)});
const table=(key,children=[])=>({key,type:'table',children});
const pct='Percent. 10 = 10%; enter the percent directly.';
const seconds='Seconds. Decimals are allowed.';
const rules={};
const catalog=[];
function scalar(group,key,value,help,options={}){rules[key]={type:typeof value,help,...options};catalog.push({group,key,help,make:()=>[primitive(key,value)],stageOnly:!!options.stageOnly});}
function bundle(group,key,help,make,options={}){catalog.push({group,key,help,make,stageOnly:!!options.stageOnly});}
scalar('Damage','BaseDamage',15,'Flat damage before multipliers.',{min:0});
scalar('Damage','DamageMultiplier',1.2,'Multiplier. 1 = normal; 1.2 = 20% more damage.',{min:0});
scalar('Damage','Vamprisim',1,'Health healed from damage dealt, in %. 1 = 1%.',{min:0,max:100});
scalar('Damage','attackorbs',5,'How many extra attack orbs can appear. Whole numbers.',{min:0,integer:true});
scalar('Damage','CriticalChance',10,'Chance to critically hit, in %. 10 = 10%.',{min:0,max:100});
scalar('Damage','CriticalDamage',50,'Extra damage on a critical hit, in %. 50 = 50%.',{min:0});
scalar('Damage','ArmorPenetration',10,'Armor ignored, in %. 10 = 10%.',{min:0,max:100});
for(const key of ['BurnDamage','Poison','Frost','Bleed','Shock','Wither']){rules[key]={type:'table',required:['Damage','Interval'],help:'Damage per tick and how often it ticks, in seconds.'};bundle('Damage over time',key,'Choose damage per tick and the interval in seconds.',()=>[table(key,[primitive('Damage',4),primitive('Interval',1),primitive('Duration',5)])]);}
scalar('Movement','DashDistance',10,'Dash distance increase, in %. 10 = 10%.',{min:0});
scalar('Movement','DashCooldown',1,'Dash cooldown in seconds. 1 = 1 second; 2 = 2 seconds.',{min:0});
scalar('Movement','Walkspeed',10,'Walk speed increase, in %. 10 = 10%; 0.5 = 0.5%.',{min:0});
scalar('Movement','JumpBoost',5,'Extra jump boost. Flat number, maximum 20.',{min:0,max:20});
scalar('Movement','CanDash',false,'Whether the player can dash. true = yes, false = no.');
scalar('Movement','FOV',10,'Field of view increase, in %. 10 = 10%.',{min:0});
scalar('Defense','Armor',10,'Flat armor amount. Can be used in base stats or any stage.');
scalar('Defense','DamageReduction',1.2,'Damage reduced, in %. 1.2 = 1.2%, not 20%.',{min:0,max:100});
scalar('Defense','HitIFrames',3,'Flat invulnerability frames. Whole numbers only: 1, 2, 3…',{min:0,integer:true});
scalar('Defense','BonusHealth',20,'Extra maximum health. Flat amount.',{min:0});
scalar('Defense','HealthRegen',1,'Health restored each second. Flat amount.',{min:0});
for(const prefix of ['Fire','Poison','Frost','Bleed','Shock','Wither','Stun'])scalar('Resistances',prefix+'Resistance',10,'Resistance in %. 1 = 1%; 10 = 10%.',{min:0,max:100});
for(const prefix of ['Fire','Poison','Frost','Bleed','Shock','Stun'])scalar('Immunities',prefix+'Immunity',true,'Enable or disable immunity to '+prefix.toLowerCase()+'.');
rules.Magnetic={type:'number',min:0,help:'Magnet range in studs. Strength is set separately.',required:['MagneticStrength']};
rules.MagneticStrength={type:'number',min:0,max:5,help:'Magnet pull strength. Maximum 5.'};
bundle('Utility','Magnetic','Choose a range in studs and pull strength (maximum 5).',()=>[primitive('Magnetic',10),primitive('MagneticStrength',1)]);
scalar('Utility','PickupRange',10,'Extra pickup range in studs.',{min:0});
scalar('Utility','PotionEfficiency',20,'Potion effectiveness increase, in %. 20 = 20%.',{min:0});
scalar('Utility','OrbDropChance',10,'Extra orb drop chance, in %. 10 = 10%.',{min:0,max:100});
rules.Reflect={type:'boolean',help:'Reflect incoming damage. Set the cooldown and reflected damage below.',required:['ReflectCooldown','ReflectDamagePercent']};
rules.ReflectCooldown={type:'number',min:0,help:'Seconds between reflections.'};
rules.ReflectDamagePercent={type:'number',min:0,max:100,help:'Incoming damage reflected back, in %. 25 = 25%.'};
bundle('Reactive effects','Reflect','Toggle reflection, choose cooldown in seconds and damage reflected in %.',()=>[primitive('Reflect',true),primitive('ReflectCooldown',3),primitive('ReflectDamagePercent',25)]);
rules.RandomEffect={type:'boolean',stageOnly:true,help:'Combat stages only. Grants a random effect.',required:['RandomEffectDuration','RandomEffectCooldown']};
rules.RandomEffectDuration={type:'number',min:0,exclusiveMin:true,stageOnly:true,help:'Random effect duration in seconds.'};
rules.RandomEffectCooldown={type:'number',min:0,stageOnly:true,help:'Seconds between random effects.'};
bundle('Combat-only effects','RandomEffect','Random effect toggle, duration and cooldown in seconds.',()=>[primitive('RandomEffect',true),primitive('RandomEffectDuration',5),primitive('RandomEffectCooldown',10)],{stageOnly:true});
rules.Invisible={type:'boolean',stageOnly:true,help:'Combat stages only. Enable or disable invisibility.',required:['InvisibleCooldown']};
rules.InvisibleCooldown={type:'number',min:0,stageOnly:true,help:'Invisibility cooldown in seconds.'};
bundle('Combat-only effects','Invisible','Invisibility toggle and cooldown in seconds.',()=>[primitive('Invisible',true),primitive('InvisibleCooldown',8)],{stageOnly:true});
rules.HealthDamageBoost={type:'table',stageOnly:true,required:['HealthPercent','DamagePercent','Condition'],help:'Combat stages only. Deal extra damage above or below a chosen health %.'};
bundle('Combat-only effects','HealthDamageBoost','Choose a health threshold, above/below condition, and bonus damage in %.',()=>[table('HealthDamageBoost',[primitive('HealthPercent',75),primitive('DamagePercent',10),primitive('Condition','Below')])],{stageOnly:true});
rules.Heal={type:'table',required:['Amount','Cooldown'],help:'Flat health restored and cooldown in seconds.'};
bundle('Reactive effects','Heal','Choose a flat heal amount and cooldown in seconds.',()=>[table('Heal',[primitive('Amount',10),primitive('Cooldown',5)])]);
rules.ShieldEffect={type:'table',required:['Amount','Duration','Cooldown'],help:'Temporary shield with duration and cooldown in seconds.'};
bundle('Reactive effects','ShieldEffect','Choose shield health, duration and cooldown in seconds.',()=>[table('ShieldEffect',[primitive('Amount',20),primitive('Duration',5),primitive('Cooldown',10)])]);
rules.Slow={type:'table',required:['Percent','Duration'],help:'Movement slow in % and duration in seconds.'};
bundle('Reactive effects','Slow','Choose slow percentage and duration in seconds.',()=>[table('Slow',[primitive('Percent',20),primitive('Duration',3)])]);
const weaponSlots=new Set(['Sword','Staff','Shield','Dagger','Bow','Axe','Spear','Hammer','Scythe','Wand','Crossbow','Gauntlets']);
const slotChoices=['Boots','Sword','Staff','Shield','Dagger','Relic','Outfit','Helmet','Bow','Axe','Spear','Hammer','Scythe','Wand','Crossbow','Gauntlets','Gloves','Ring','Amulet','Belt','Cape','Accessory'];
const classChoices=['Shield','Sword','Mage','Dagger','Archer','Warrior','Berserker','Paladin','Ranger','Assassin','Necromancer','Monk','Spearman','Gunner'];
function ruleFor(key,parent){if(['BurnDamage','Poison','Frost','Bleed','Shock','Wither'].includes(parent)){if(key==='Damage')return {type:'number',min:0,help:'Flat damage dealt on each tick.'};if(key==='Interval'||key==='Duration')return {type:'number',min:0,exclusiveMin:true,help:key==='Interval'?'How often damage ticks, in seconds. Must be greater than 0.':'How long the effect lasts, in seconds. Must be greater than 0.'};}if(parent==='HealthDamageBoost'){if(key==='HealthPercent')return {type:'number',min:0,max:100,help:'Health threshold in %. 75 = 75% of maximum health.'};if(key==='DamagePercent')return {type:'number',min:0,help:'Extra damage in %. 10 = 10% more damage.'};if(key==='Condition')return {type:'string',choices:['Below','Above'],help:'Activate below or above the selected health percentage.'};}if(['Heal','ShieldEffect','Slow'].includes(parent)){if(key==='Amount')return {type:'number',min:0,help:'Flat amount.'};if(key==='Cooldown')return {type:'number',min:0,help:seconds};if(key==='Duration')return {type:'number',min:0,exclusiveMin:true,help:seconds+' Must be greater than 0.'};if(key==='Percent')return {type:'number',min:0,max:100,help:pct};}return rules[key];}
const presets={
cinder:{name:'Cinderwake Staff',slot:'Staff',classValue:'Mage',description:'A smoldering staff that sears targets and grants a fleeting random boon.',stack:'1',stats:[primitive('BaseDamage',18),primitive('DamageMultiplier',1.15),table('BurnDamage',[primitive('Damage',3),primitive('Interval',1),primitive('Duration',6)])],stages:[[primitive('DamageMultiplier',1.3),...catalog.find(c=>c.key==='RandomEffect').make()]]},
wayfarer:{name:'Wayfarer Greaves',slot:'Boots',description:'Light travel boots built for longer dashes and quick escapes.',stack:'1',stats:[primitive('DashDistance',15),primitive('DashCooldown',2),primitive('Walkspeed',8),primitive('JumpBoost',4)],stages:[[primitive('Walkspeed',18),primitive('CanDash',true)]]},
mirror:{name:'Mirror Bastion',slot:'Shield',classValue:'Shield',description:'A polished bulwark that returns part of an attacker’s strike.',stack:'1',stats:[primitive('BaseDamage',8),primitive('Armor',20),...catalog.find(c=>c.key==='Reflect').make()],stages:[[primitive('DamageReduction',15),primitive('HitIFrames',3)]]},
predator:{name:'Predator’s Crest',slot:'Helmet',description:'A hunter’s crest that rewards fighting on the edge of defeat.',stack:'1',stats:[primitive('Armor',8),primitive('CriticalChance',12)],stages:[[table('HealthDamageBoost',[primitive('HealthPercent',40),primitive('DamagePercent',25),primitive('Condition','Below')]),primitive('Vamprisim',5)],[primitive('Invisible',true),primitive('InvisibleCooldown',12)]]},
tempest:{name:'Tempest Longbow',slot:'Bow',classValue:'Archer',description:'A charged bow whose extra orbs carry a creeping chill.',stack:'1',stats:[primitive('BaseDamage',22),primitive('attackorbs',2),table('Frost',[primitive('Damage',2),primitive('Interval',.5),primitive('Duration',4)])],stages:[[primitive('DamageMultiplier',1.4),primitive('FOV',5)]]},
graviton:{name:'Graviton Sigil',slot:'Relic',description:'A gravity-bound relic that draws nearby pickups into reach.',stack:'0',stats:[primitive('Magnetic',15),primitive('MagneticStrength',3),primitive('PoisonResistance',20)],stages:[[primitive('Armor',10),primitive('DamageReduction',5)]]}
};
let errors=[];
const reserved=new Set('and break do else elseif end false for function if in local nil not or repeat return then true until while continue'.split(' '));
function quote(value){return '"'+Array.from(String(value)).map(c=>{const n=c.codePointAt(0);if(c==='"')return '\\"';if(c==='\\')return '\\\\';if(n===10)return '\\n';if(n===13)return '\\r';if(n===9)return '\\t';if(n<32||n===127)return '\\'+String(n).padStart(3,'0');return c;}).join('')+'"';}
function formatKey(key){return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)&&!reserved.has(key)?key:'['+quote(key)+']';}
function validateTree(nodes,inStage=false,parent='',path='Stats'){const keys=new Set(nodes.map(n=>n.key));for(const n of nodes){const r=ruleFor(n.key,parent);const p=path+'.'+n.key;if(n.key==='Combat')errors.push(p+': add combat through the stage controls.');if(r){if(n.type!==r.type)errors.push(p+': must be '+r.type+'.');if(r.stageOnly&&!inStage)errors.push(p+': combat stages only.');if(r.required){const siblings=r.type==='table'?new Set((n.children??[]).map(c=>c.key)):keys;for(const k of r.required)if(!siblings.has(k))errors.push(p+': requires '+k+'.');}if(n.type==='number'){const v=Number(n.value);if(r.min!==undefined&&(v<r.min||(r.exclusiveMin&&v===r.min)))errors.push(p+': must be '+(r.exclusiveMin?'greater than ':'at least ')+r.min+'.');if(r.max!==undefined&&v>r.max)errors.push(p+': maximum '+r.max+'.');if(r.integer&&!Number.isSafeInteger(v))errors.push(p+': whole numbers only.');}if(r.choices&&!r.choices.includes(n.value))errors.push(p+': choose '+r.choices.join(' or ')+'.');}if(n.type==='table')validateTree(n.children,inStage,n.key,p);}}
function serialize(nodes,depth,path){const seen=new Set();const lines=[];for(const node of nodes){const key=node.key;if(!key.trim())errors.push(path+': give every field a key.');if(seen.has(key))errors.push(path+': duplicate key '+key+'.');seen.add(key);const indent='\t'.repeat(depth);if(node.type==='table'){lines.push(indent+formatKey(key)+' = {',...serialize(node.children,depth+1,path+'.'+key),indent+'},');}else{let value;if(node.type==='number'){const raw=String(node.value);if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw)||!Number.isFinite(Number(raw))){errors.push(path+'.'+key+': enter a finite number.');value='0';}else value=String(Number(raw));}else if(node.type==='boolean'){if(node.value!=='true'&&node.value!=='false')errors.push(path+'.'+key+': choose true or false.');value=node.value==='true'?'true':'false';}else value=quote(node.value);lines.push(indent+formatKey(key)+' = '+value+',');}}return lines;}
function generate(state){errors=[];const d=state.details;if(!d.DisplayName.trim())errors.push('Add an item name.');if(!d.Slot.trim())errors.push('Choose an equipment slot.');if(!/^\d+$/.test(d.StackLimit)||!Number.isSafeInteger(Number(d.StackLimit)))errors.push('StackLimit must be a non-negative whole number. 0 = unlimited.');if(!d.isWeapon&&d.ClassRequired)errors.push('ClassRequired is only available for weapons.');const top=[primitive('DisplayName',d.DisplayName),primitive('Description',d.Description),{key:'StackLimit',type:'number',value:d.StackLimit},primitive('Slot',d.Slot)];if(d.isWeapon&&d.ClassRequired)top.push(primitive('ClassRequired',d.ClassRequired));if(!d.Icon.trim())top.push(primitive('Icon',0));else{let icon=d.Icon.trim().replace(/^rbxassetid:\/\//,'');if(!/^\d+$/.test(icon))errors.push('Icon must be a numeric Roblox asset ID.');top.push(primitive('Icon','rbxassetid://'+icon));}if(state.stages.length>10)errors.push('Combat stages are limited to 10.');validateTree(state.stats);state.stages.forEach((s,i)=>validateTree(s,true,'','Combat.stage'+(i+1)));const stats=structuredClone(state.stats);if(state.stages.length)stats.push(table('Combat',state.stages.map((s,i)=>table('stage'+(i+1),s))));top.push(table('Stats',stats));const code=['return {',...serialize(top,1,'Item'),'}'].join('\n');errors=[...new Set(errors)];return code;}
