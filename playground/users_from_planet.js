const axios = require('axios');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let data = {
  headers:{
    Authorization: `Bearer ${process.env.canvasTok}`
  }
};

let getUsersFromCanvas = async ()=>{
  try {
    const response = await axios.get('https://bhalladay.instructure.com/api/v1/accounts/self/users?per_page=100', data);
    let dwellersOfPlanet = response.data.filter((user)=>{
      return user.sortable_name.toUpperCase().split(',')[0].indexOf('R') > -1;
    });
    // console.log(dwellersOfPlanet.length);
    if(dwellersOfPlanet.length == 0){
      throw new Error();
    }

    return dwellersOfPlanet;
  } catch (e) {
    throw new Error(`Unable to get users from Canvas or no users matched the criteria`);
  }
};

let getPlanetsFromSWAPI = async ()=>{
  try {
    const response = await axios.get('https://swapi.co/api/planets/');
    return response.data.results;
  } catch (e) {
    throw new Error(`unable to get planets from SWAPI`);
  }
}

const visitedPlanets = async ()=>{
  const getPlanets = await getPlanetsFromSWAPI();
  const getUsers = await getUsersFromCanvas();
  getUsers.forEach((user)=>{
    console.log(`${user.name} has been to Planet ${getPlanets[2].name}`);
  });
  return "done";
};

const add = async ()=>{
  let add2Plus2In2Seconds = ()=>{
    return 2 + 2;
  }
  let result = await add2Plus2In2Seconds();
  let delat = await timeout(2000);
  return result;
};

const doWork = async ()=>{
  try {
    const result = await add();
    return result;
  } catch (e) {
    return null;
  }
};
visitedPlanets().then((arr)=>{
  console.log(arr);
  doWork().then((number)=>{
    console.log(number);
  }).catch((err)=>{
    console.log('something went wrong');
  });
}).catch((err)=>console.log(err.message));