import React from 'react';
import './App.css';
import Clinical from './clinicalFormName';
import Molecular from './molecularFormName';
import axios from "axios";

class App extends React.Component{
    state = { 
        tableName :['nsclc_diag','nsclc_stg','molecular'],
        given_or_needed: false,
        column_names:[],
        given:[],
        needed:[]
    }
    get_fields = (event)=>{
        axios.post('http://127.0.0.1:5000/api/queryPatient/columns', {
            info: event.currentTarget.textContent
        }).then( (response)=> {
            const col = response.data.map((item)=>{return item['column_name']});
            this.setState({column_names:col});
        }).catch((error)=> {
            console.log(error);
        });
    }
    render(){
        return(
            
            <div>
                {/* form */}
                <div className="ui text container image-list">
                    <div className = "ui segments">
                        <button className="positive ui button">Given Infomation</button>
                        <button className="primary ui button">Needed Information</button>
                    </div>
                    <div className="ui segments">
                        <div className="ui segment">
                            <div className="fields">
                                <Clinical form_list={this.state.tableName} 
                                click={this.get_fields}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* fields */}
                <div className="ui text container image-list">
                    <div className="ui segments">
                        <div className="ui segment">
                            <div className="fields">
                            <table className="ui celled padded table">
                                <thead>
                                    <tr>
                                        <th>Form Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.column_names.map(x=>{return <tr>
                                    <td >
                                    <button className="ui secondary button">
                                        {x}
                                    </button>
                                    </td>
                                    <td>Creatine supplementation </td>
                                    </tr>})}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* query */}
                <form onSubmit={this.onFormSubmit} className="ui form">
                <div className="field">
                    <label>Image Search</label>
                    <input
                    type="text"
                    value={this.state.term}
                    onChange={e => this.setState({ term: e.target.value })}
                    />
                </div>
                </form>
                </div>
        )
    }
}

export default App;