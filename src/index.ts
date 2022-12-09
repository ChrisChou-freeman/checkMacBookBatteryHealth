#!/usr/bin/env node
import {execSync} from 'child_process';

const healthCount = 1000;
const fullCycleCount = 1000/0.2;

interface BatteryInfo {
	usedCycleCount: number;
	remainCycleCount: number;
	batteryHealthPercent: number;
}

function getHardwareInfomation(): string {
	const GET_BATTERY_HEALTH_COMMAND = 'ioreg -l | grep Capacity | grep BatteryData';
  const result = execSync(GET_BATTERY_HEALTH_COMMAND);
  const stringInformation = result.toString();
	return stringInformation 
}

function parserInformation(info: string): BatteryInfo {
  const batteryInformation = info.split(' = ')[1].trim();
  const splitInformation = batteryInformation.split(',');
  const filterInformation = splitInformation.filter((i)=>{return i.startsWith('"CycleCount"')});
  const usedCycleCount = parseInt(filterInformation[0].split('=')[1]);
  const remainCycleCount = healthCount - usedCycleCount;
  const batteryHealthPercent = Math.floor(remainCycleCount/fullCycleCount* 100) + 80;
	return {usedCycleCount, remainCycleCount, batteryHealthPercent}
}

function main(){
	const batteryInfoObj = parserInformation(getHardwareInfomation())
  const content = `
    used charge cycle count🔌: ${batteryInfoObj.usedCycleCount}
    remians charge cycle count: ${batteryInfoObj.remainCycleCount}
    battery health🔋: ${batteryInfoObj.batteryHealthPercent}%
  `;
  console.log(content);
}

main();
