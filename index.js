'use strict';
const {execSync} = require('child_process');
const GET_BATTERT_HEALTH_COMMAND = 'ioreg -l | grep Capacity | grep BatteryData';
const healthCount = 1000;

function main(){
  const result = execSync(GET_BATTERT_HEALTH_COMMAND);
  const stringInformation = result.toString();
  const batteryInformation = stringInformation.split(' = ')[1].trim();
  const splitInformation = batteryInformation.split(',')
  const filterInformation = splitInformation.filter((i)=>{return i.startsWith('"CycleCount"')});
  const remainCycleCount = filterInformation[0].split('=')[1];
  const content = `
    use cycle count: ${healthCount-remainCycleCount}
    remians cycle count: ${remainCycleCount}
    battery health: ${Math.floor(remainCycleCount/healthCount * 0.2 * 100) + 80}%
  `;
  console.log(content);
}

main();
