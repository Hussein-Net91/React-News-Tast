import React, { Component } from 'react';
import styled from 'styled-components';
import Context from './Context'
class NewsHeader extends Component {
    render(){
      return(
      <Context.Consumer>
        {
          (ctx)=>{
            return (<div id="contianer">
            <header>
                <img src={require('./assets/logo.svg')} alt="logo" />
                <div id="Subscribe">
                <input id="Subscribe-Email" 
                onChange={(event)=>{ctx.actions.onInputemail(event)}} type="Text" placeholder="Enter Email Pleace" value={ctx.state.emailValue ||''}>
                </input>
                <button id="Subscribe-Button" onClick={()=>{ctx.actions.onClickSubscribe(document.getElementById('Subscribe-Email').value)} }>Subscribe</button>
                </div> 

                <select id="SortBy" onChange={(event)=>{ctx.actions.onInputChangeList(event)}}>
                    <option value="default">default</option>
                    <option value="Title">Title</option>
                    <option value="Date">Date</option>
                    <option value="Votes">Votes</option>
                </select>
                <select id="Showme" onChange={(event)=>{ctx.actions.onInputChangeListNumber(event)}}>
                    <option value="20">20</option>
                    <option value="10">10</option>
                    <option value="5" select="selected">5</option>
                </select>
                <input type="search" id="search"
                    value={ctx.state.searchValue}
                    onKeyUp={(event)=>{ctx.actions.onInputKeyUp(event)}}
                    onChange={(event)=>{ctx.actions.onInputChange(event)}} />
            </header>
        </div>)
          }
        }
      </Context.Consumer>
      )
    }
  }
  
  
  export default NewsHeader;