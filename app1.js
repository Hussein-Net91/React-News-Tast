import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
var _ = require("underscore")
import NewsHeader from './NewsHeader'
import NewsList from './NewsList'
import Context from './Context'
import Database from './firebaseDB'
let StoreDatebase = []
let NewsFromData = [];

class App extends Component {
    constructor() {
        super()
        this.state = {
            news: [],
            searchValue: 'Iraq',
            emailValue: localStorage.getItem('SubscribeEmail') || '',
            clientID: ''
        };
        this.getNews(this.state.searchValue);
        this.getclintID();
    }

    //================
    getclintID() {
        if (localStorage.getItem('ClientID')) {
            let clientid = localStorage.getItem('ClientID')
            this.setState({
                clientID: clientid
            })
        }
        else {
            let RandomNu = Math.floor(Math.random() * 10000000);
            localStorage.setItem('ClientID', RandomNu);
            this.setState({
                clientID: RandomNu
            })
        }
    }
    //================
    getNews(search_tirm) {
        fetch(`https://newsapi.org/v2/everything?q=${search_tirm}&sortBy=publishedAt&apiKey=159ab043c8be4a0d9f4f385a853ef619`)
            .then((responce) => {
                return responce.json();
            })
            .then((data) => {
                Database.collection('Vote').orderBy('Count', 'asc').onSnapshot((snapshot) => {
                    let UpdateDatebase = [];
                    snapshot.forEach((doc) => {
                        UpdateDatebase.push(doc.data())
                        //console.log(UpdateDatebase)
                    })
                    StoreDatebase = UpdateDatebase
                    console.log(StoreDatebase)
                    var i;
                    for (i = 0; i < data.articles.length; i++) {
                        data.articles[i].value = 0;
                        let j = 0;
                        let trigger = true;
                        while (j < StoreDatebase.length && trigger && StoreDatebase.length > 0) {
                            if (StoreDatebase[j].url === data.articles[i].url) {
                                trigger = false;
                                data.articles[i].value = StoreDatebase[j].Count;
                            }
                            j++;
                        }
                    }

                    StoreDatebase = data.articles;
                    this.setState({
                        news: data.articles
                    })
                })
            })
    }
    //=============
    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    onInputChange: (event) => {
                        this.setState({
                            searchValue: event.target.value
                        })
                    },
                    onInputemail: (event) => {
                        this.setState({
                            emailValue: event.target.value
                        })
                    },
                    onInputKeyUp: (event) => {
                        if (event.keyCode === 13) {
                            let search_tirm = this.state.searchValue;
                            console.log(search_tirm);
                            this.getNews(search_tirm);
                            StoreDatebase = this.state.news;
                        }
                    },
                    onClickSubscribe: (item) => {
                        localStorage.setItem('SubscribeEmail', item)
                        console.log(item)
                        Database.collection('Reader').where("Email", "==", item)
                            .get()
                            .then((snapshot) => {
                                let InDB = 'false';
                                snapshot.forEach((doc) => {
                                    alert('You Already Subscribe')
                                    InDB = 'true'
                                    Database.collection('Reader').doc(doc.id).update({ Email: item, UserID: localStorage.getItem('ClientID') })

                                })
                                console.log(snapshot.size)
                                /*if(!>0)
                            {
                                Database.collection('Reader').add({
                                    Email: item,
                                    UserID: '0'
                                  }) 
                            }*/
                            })

                    },
                    onInputChangeList: (event) => {
                        switch (event.target.value) {
                            case "Title":
                                this.setState({
                                    news: _.sortBy(this.state.news, 'title')
                                })

                                StoreDatebase = _.sortBy(StoreDatebase, 'title')
                                break;
                            case "Date":
                                this.setState({
                                    news: _.sortBy(this.state.news, 'publishedAt')

                                })
                                StoreDatebase = _.sortBy(this.state.news, 'publishedAt')
                                break;
                            case "Votes":
                                this.setState({
                                    news: _.sortBy(this.state.news, 'value').reverse()
                                })
                                break;
                            default:
                                this.setState({
                                    news: StoreDatebase
                                })
                        }
                    },
                    onInputChangeListNumber: (event) => {
                        console.log(event.target.value);
                        console.log(StoreDatebase);
                        switch (event.target.value) {
                            case "5":
                                this.setState({

                                    news: StoreDatebase.slice(0, 5)
                                })
                                break;
                            case "10":
                                this.setState({

                                    news: StoreDatebase.slice(0, 10)
                                })
                                break;
                            default:
                                this.setState({
                                    news: StoreDatebase
                                })
                        }
                    }
                }
            }}>
                <NewsHeader />
                <NewsList News={this.state.news} />
            </Context.Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))