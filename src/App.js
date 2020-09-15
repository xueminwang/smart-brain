import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';

const particlesOptions = {
  particles:{
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  state = initialState;

  loadUser = (data) => {
     this.setState({user: {
       id: data.id,
       name: data.name,
       email: data.email,
       entries: data.entries,
       joined: data.joined
    }})
  }

  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //   .then(response=>response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation = (picdata) => {
    const clarifaiFace = picdata.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');  
    const width = Number(image.width); 
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
     this.setState({
        input: event.target.value
      })
  }
//a403429f2ddf4b49b307e318f00e528b
  onSubmit = () => {
     this.setState({imageUrl: this.state.input});
     fetch('https://powerful-caverns-36798.herokuapp.com/imageurl', {
       method: 'post',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
         input: this.state.input
       })
     })
     .then(response => response.json())
     .then(response => { 
        if (response) {
             fetch('https://powerful-caverns-36798.herokuapp.com/image', {
               method: 'put',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                   id: this.state.user.id
               })
            })
            .then(response=>response.json())
            .then(count =>{
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(err =>console.log(err)); 
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
   })
     .catch(err => console.log(err));
}

onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
     this.setState({isSignedIn: true})
    } 
    this.setState({route: route});
  }

render(){
    return (
      <div className="App">
      <Particles className='particles' 
         params={particlesOptions}
      />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' ?
              <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm  
                   onInputChange={this.onInputChange} 
                   onSubmit={this.onSubmit}
                />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
              </div>
          :( this.state.route === 'signin' ?
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           )
        }
      </div>
    );
  }
}
export default App;
