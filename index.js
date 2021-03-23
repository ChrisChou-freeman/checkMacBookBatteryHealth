#!/usr/bin/env node

'use strict';

import {execSync} from 'child_process';

const GET_BATTERY_HEALTH_COMMAND = 'ioreg -l | grep Capacity | grep BatteryData';
const healthCount = 1000;
const fullCycleCount = 1000/0.2;

function main(){
  const result = execSync(GET_BATTERY_HEALTH_COMMAND);
  const stringInformation = result.toString();
  const batteryInformation = stringInformation.split(' = ')[1].trim();
  const splitInformation = batteryInformation.split(',');
  const filterInformation = splitInformation.filter((i)=>{return i.startsWith('"CycleCount"')});
  const usedCycleCount = filterInformation[0].split('=')[1];
  const remainCycleCount = healthCount - usedCycleCount;
  const batteryHeanlthPercent = Math.floor(remainCycleCount/fullCycleCount* 100) + 80;
  const content = `
    used charge cycle count🔌: ${usedCycleCount}
    remians charge cycle count: ${remainCycleCount}
    battery health🔋: ${batteryHeanlthPercent}%
  `;
  console.log(content);
}

main();
