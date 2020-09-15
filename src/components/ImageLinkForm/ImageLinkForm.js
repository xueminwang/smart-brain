import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    return(
        <div>
          <p className='f3'>
             {'This Magic Brain will detect faces in your pictures, give it try'}
          </p>
          <div className='center'>
             <div className='form pa4 br3 shadow-5'> 
               <input onChange={onInputChange} className='f4 pa2 w-100 center' type='text' />
               <button onClick={onSubmit} className='w-60 grow f4 link ph3 pv2 dib white bg-light-purple'>
                  Detect
               </button>
             </div>
          </div>
        </div>
    );
}

export default ImageLinkForm