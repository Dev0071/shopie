import cron from 'node-cron'
import { DB } from "../DBHelpers/index.js";


const clearOldAnonymousCarts= ()=>{
    DB.exec('usp_ClearOldCartEntries',{})
    console.log("Anonymous Carts Cleared")
}




cron.schedule('0 2 * * *', () => {
    clearOldAnonymousCarts();
  });

  cron.schedule('0 2 * * *', () => {
    clearOldAnonymousCarts();
  });