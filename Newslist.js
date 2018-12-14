import React, { Component } from 'react';
import styled from 'styled-components';
var _ = require("underscore")
import Database from './firebaseDB'
import Context from './Context'
let News = []
class NewsList extends React.Component {
    onClickVoetUP(event) {

        let alte = event.target.alt;
        let UserID = localStorage.getItem('ClientID');
        var savedEvent = event;
        var savedTarget = event.target;
        Database.collection('UsersVote').where("UserID", "==", UserID).where("url", "==", alte).get().then((snapshot) => {
            if (snapshot.docs.length > 0) {
                alert('You Already Voted Previously')
                console.log(snapshot.docs);
            }
            else {
                let Count = savedTarget.parentNode.children[1].innerHTML;
                Count++;
                Database.collection('UsersVote').add({
                    Type: 'UpVote',
                    Value: Count,
                    url: alte,
                    UserID: UserID,
                    Date: Date.now().toString()
                })
                //===============================================================  
                savedTarget.parentNode.children[1].innerHTML = Count;
                Database.collection('Vote').orderBy('Count', 'desc').get()
                    .then((snapshot) => {
                        if (true) {
                            News = []
                            snapshot.forEach((doc) => {
                                News.push(doc.data())
                            })
                            console.log(News)
                            let i = 0;
                            let trigger = true;
                            while (i < News.length && trigger && News.length > 0) {
                                if (News[i].url === alte) {
                                    trigger = false;
                                    Database.collection('Vote').where("url", "==", alte)
                                        .get()
                                        .then((snapshot) => {
                                            snapshot.forEach((doc) => {
                                                Database.collection('Vote').doc(doc.id).update({ Count: Count })
                                            })

                                        })
                                }
                                i++;
                            }

                            if (trigger === true) {
                                Database.collection('Vote').add({
                                    Count: Count,
                                    url: alte,
                                    UserID: localStorage.getItem('ClientID')
                                })
                            }
                        }
                    })
                //===================================================================
            }

        });
    }

    onClickVoetDown(event) {
        let alte = event.target.alt;
        let UserID = localStorage.getItem('ClientID');
        var savedEvent = event;
        var savedTarget = event.target;
        Database.collection('UsersVote').where("UserID", "==", UserID).where("url", "==", alte).get().then((snapshot) => {
            if (snapshot.docs.length > 0) {
                alert('You Already Voted Previously')
                console.log(snapshot.docs);
            }
            else {
                let Count = savedTarget.parentNode.children[1].innerHTML;
                Count--
                if (Count >= 0) {
                    Database.collection('UsersVote').add({
                        Type: 'DownVote',
                        Value: Count,
                        url: alte,
                        UserID: UserID,
                        Date: Date.now().toString()
                    });
                    //==========================================================
                    savedTarget.parentNode.children[1].innerHTML = Count;
                    Database.collection('Vote').orderBy('Count', 'desc').get().then((snapshot) => {
                        News = []
                        snapshot.forEach((doc) => {
                            News.push(doc.data())
                        })
                        let i = 0;
                        let trigger = true;
                        while (i < News.length && trigger && News.length > 0) {
                            if (News[i].url === alte) {
                                trigger = false;
                                Database.collection('Vote').where("url", "==", alte)
                                    .get()
                                    .then((snapshot) => {
                                        snapshot.forEach((doc) => {
                                            Database.collection('Vote').doc(doc.id).update({ Count: Count })
                                        })

                                    })
                            }
                            i++;
                        }

                        if (trigger === true) {
                            Database.collection('Vote').add({
                                Count: Count,
                                url: alte,
                                UserID: localStorage.getItem('ClientID')
                            })
                        }

                    })

                }
                //====================================================================================
            }
        });
    }


    render() {
        return (
            <Context.Consumer>{
                (ctx) => {
                    return (
                        <main id="content">
                            <div id="recent_links">
                                {
                                    this.props.News.map((item, i) => (

                                        <article key={i} id={i}>
                                            <div id="imgart">
                                                <img height="130px" width="130px" src={item.urlToImage} alt={item.url} />
                                            </div>
                                            <div id="info">
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
                                                <time>{item.publishedAt}</time>
                                            </div>
                                            <div id="voter">
                                                <img height="20px" width="20px" src={require('./assets/upvote.svg')} alt={item.url}
                                                    onClick={this.onClickVoetUP.bind(this)} />

                                                <div >{item.value}</div>
                                                <img height="20px" width="20px" src={require('./assets/downvote.svg')} alt={item.url}
                                                    onClick={this.onClickVoetDown.bind(this)} />
                                            </div>
                                        </article>
                                    ))}


                            </div>
                        </main>
                    )
                }
            }
            </Context.Consumer>)
    }
}
export default NewsList;