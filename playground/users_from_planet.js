const axios = require('axios');

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
    console.log(dwellersOfPlanet.length);
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

const add = async (a,b)=>a+b;

const doWork = async ()=>{
  try {
    const result = await add(12, 5);
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