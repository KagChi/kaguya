import axios from 'axios';
const baseURL = "https://nekos.life/api/v2/img/";
export default class Fun {
     public async trap(){
       const { data } = await axios.get(baseURL + "trap")
       return data.url
     }
 }
