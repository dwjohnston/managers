import React, { Component } from 'react';
import "./EvalTextArea.css";


const rawData = [

  { name: "Alan", id: 100, managerId: 150 },
  { name: "Martin", id: 220, managerId: 200 },
  { name: "Jamie", id: 150, managerId: null },
  { name: "Alex", id: 275, managerId: 100 },
  { name: "Bob", id: 276, managerId: 100 },
  { name: "Charlie", id: 277, managerId: 100 },
  { name: "Steve", id: 450, managerId: 150 },
  { name: "David", id: 190, managerId: 400 }, 
  { name: "Dupe1", id: 191, managerId: 100 }, 
  { name: "Dupe2", id: 191, managerId: 100 }, 
  { name: "Dupe3", id: 191, managerId: 100 }, 
  { name: null, id: 193, managerId: 100 }, 
  { name: "No-Id", id: null, managerId: 100 }, 
];

class EvalTextArea extends Component {

    constructor(props) {
      super(props); 

      this.state = {
        error: null,
        data: JSON.stringify(rawData), 
      }; 
    }

    onSubmit = (event) =>{
      
      event.preventDefault();

      let data; 
      try {
        data = JSON.parse(this.state.data); 
        this.setState({
          error: null, 
        });

        this.props.onSubmit(data); 
      }
      catch(error){
        this.setState({
          error: error.message
        }); 

        return;
      }

    }

    handleChange = (event) => {
      this.setState({
        data: event.target.value
      });
    }

    render() {
      return (
        <form className="EvalTextArea" onSubmit = {this.onSubmit}>
  
            <textarea name="data" rows = {10} value = {this.state.data} onChange = {this.handleChange}/>
            <p>{this.state.error}</p>

            <button type = "submit" >submit data </button> 

        </form>
      );
    }
  }

export default EvalTextArea; 

