const axios = require('axios');

let data = {
  headers:{
    Authorization: `Bearer ${process.env.canvasTok}`
  }
};

let getUsersFromCanvas = async ()=>{
  const response = await axios.get('https://bhalladay.instructure.com/api/v1/accounts/self/users?per_page=100', data);
  let dwellersOfPlanet = response.data.filter((user)=>{
    return user.sortable_name.toUpperCase().split(',')[0].indexOf('R') > -1;
  });
  //console.log(dwellersOfPlanet);
  return dwellersOfPlanet;
};

let getPlanetsFromSWAPI = async ()=>{
  const response = await axios.get('https://swapi.co/api/planets/');
  return response.data.results;
}

const visitedPlanets = async ()=>{
  const getPlanets = await getPlanetsFromSWAPI();
  const getUsers = await getUsersFromCanvas();
  getUsers.forEach((user)=>{
    console.log(`${user.name} has been to Planet ${getPlanets[2].name}`);
  });
  return "done";
};

visitedPlanets().then((arr)=>console.log(arr)).catch((err)=>console.log(err));