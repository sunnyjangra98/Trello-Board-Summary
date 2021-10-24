navSearch.onsubmit = async(e) => {
    e.preventDefault();
    let formData = new FormData(navSearch);
    // console.log(formData.get('searchInput'));
    alert('Work in Progress...');
}

function parseData(){
    const data = JSON.parse(document.getElementById('jsoninput').value);
    document.getElementById('jsoninput').value = '';
    const divSummary = document.querySelector('.board-summary');
    divSummary.classList.add('active');

    var boardMembers = new Map();//Board Members
    var lists = new Map();//Lists
    var labels = new Map();//Labels
    var cards = new Map();//Cards
    
    data.members.forEach(element => {
        boardMembers.set(element.id, element.fullName);
    });

    data.lists.forEach(element => {
        lists.set(element.id, {name:element.name, cardIDs:[]});
    });

    data.labels.forEach(element => {
        labels.set(element.id, {name:element.name, color: element.color, cardIDs:[]});
    });

    data.cards.forEach(element => {
        let cardID = element.id;
        let cardMembers = [];   
        element.idMembers.forEach(element => {
            cardMembers.push(boardMembers.get(element));
        });

        let cardLabels = [];
        element.idLabels.forEach(element => {
            cardLabels.push(labels.get(element).name);
            //Setting cards in labels
            let newCardList = labels.get(element).cardIDs;
            newCardList.push(cardID);
            labels.set(element, {name:labels.get(element).name, color:labels.get(element).color, cardIDs:newCardList});
        });

        //Setting cards in list
        let newCardList = lists.get(element.idList).cardIDs;
        newCardList.push(cardID);
        lists.set(element.idList, {name:lists.get(element.idList).name, cardIDs:newCardList});

        let date = new Date(element.dateLastActivity);
        let str = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString();

        cards.set(element.id, 
            {list:lists.get(element.idList).name, name: element.name, desc:element.desc, members:cardMembers, labels:cardLabels, url:element.url, lastActivity:str, actionsOnCard:[], createdBy:'', createdOn:''});
    });

    data.actions.forEach(element => {
        if (element.type == 'removeMemberFromCard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            if (element.memberCreator.fullName == element.data.member.name){
                action["detail"] = element.memberCreator.fullName + " left this card";
            }
            else{
                action["detail"] = element.memberCreator.fullName + " removed " + element.data.member.name + " from this card";
            }
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'addMemberToCard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            if (element.memberCreator.fullName == element.data.member.name){
                action["detail"] = element.memberCreator.fullName + " joined this card";
            }
            else{
                action["detail"] = element.memberCreator.fullName + " added " + element.data.member.name + " to this card";
            }
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'updateCard' && !element.data.hasOwnProperty('list')){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            action["detail"] = element.memberCreator.fullName + " moved this card from " + element.data.listBefore.name + " to " + element.data.listAfter.name;
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'addAttachmentToCard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            action["detail"] = element.memberCreator.fullName + " attached <a href='" + element.data.attachment.url + "'>" + element.data.attachment.name + "</a> to this card";
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'commentCard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            action["detail"] = element.memberCreator.fullName + " commented " + element.data.text;
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'moveCardToBoard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            action["detail"] = element.memberCreator.fullName + " transferred this card from " + element.data.boardSource.id + " to " + element.data.board.name;
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:cards.get(cardID).createdBy, createdOn:cards.get(cardID).createdOn});
        }
        else if (element.type == 'createCard'){
            let cardID = element.data.card.id;
            let action = {};
            action["date"] = element.date;
            action["detail"] = element.memberCreator.fullName + " created and added this card to " + element.data.list.id;
            let newAction = cards.get(cardID).actionsOnCard;
            newAction.push(action);
            let createdBy = element.memberCreator.fullName;
            let date = new Date(element.date);
            let createdOn = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString();
            cards.set(cardID, 
                {list:cards.get(cardID).list, name:cards.get(cardID).name, desc:cards.get(cardID).desc, members:cards.get(cardID).members, labels:cards.get(cardID).labels, url:cards.get(cardID).url, 
                    lastActivity:cards.get(cardID).lastActivity, actionsOnCard:newAction, createdBy:createdBy, createdOn:createdOn});
        }
    });

    // console.log('Board Summary...');
    // console.log('');
    //Board Name
    // console.log('Board Name - ' + data.name);
    // console.log('');
    divSummary.innerHTML += `<div><h3>Board Summary Of &nbsp;<a href="${data.url}">${data.name}<a></h3></div>`;

    // console.log('No. Of Members - ' + boardMembers.size);
    // console.log('Board Members - ');
    // boardMembers.forEach((value, key) => console.log(boardMembers.get(key)));
    // console.log('');
    var str = `<div style="margin-left:2%"><p style="font-size: 20px">No. Of Members - <b>${boardMembers.size}</b></p><p style="font-size:18px">Board Members:-</p><ol>`;
    boardMembers.forEach((value, key) => {
        str += `<li>${boardMembers.get(key)}</li>`;
    });
    str += `</ol></div>`;
    divSummary.innerHTML += str;

    // console.log('No. Of Lists - ' + lists.size);
    // console.log('Lists - ');
    // lists.forEach((value, key) => console.log('List Name : ' + lists.get(key).name + ' / Total Cards in this list : ' + lists.get(key).cardIDs.length));
    // console.log('');
    var str = `<div style="margin-left:2%"><p style="font-size: 20px">No. Of Lists - <b>${lists.size}</b></p><p style="font-size:18px">Lists:-</p><ul>`;
    lists.forEach((value, key) => {
        str += `<li><b>${lists.get(key).name}</b> / Total Cards in this list : <b>${lists.get(key).cardIDs.length}</b></li>`;
    });
    str += `</ul></div>`;
    divSummary.innerHTML += str;

    // console.log('No. Of Labels - ' + labels.size);
    // console.log('Labels - ');
    // labels.forEach((value, key) => console.log('Label Name : ' + labels.get(key).name + ' / Total Cards with this label : ' + labels.get(key).cardIDs.length));
    // console.log('');
    var str = `<div style="margin-left:2%"><p style="font-size: 20px">No. Of Labels - <b>${labels.size}</b></p><p style="font-size:18px">Labels:-</p><ul>`;
    labels.forEach((value, key) => {
        str += `<li><b>${labels.get(key).name}</b> / Total Cards with this label : <b>${labels.get(key).cardIDs.length}</b> /  
        Color : ${labels.get(key).color} <div style="display:inline-block;width:50px;height:13px;background-color:${labels.get(key).color}"><div></li>`;
    });
    str += `</ul></div>`;
    divSummary.innerHTML += str;

    // console.log('No. Of Cards - ' + cards.size);
    // console.log('Cards - ');
    // cards.forEach((value, key) => {
    //     console.log('Card Name :\n' + cards.get(key).name + '\n\nIn List :\n' + cards.get(key).list + 
    //     '\n\nDescription :\n' + cards.get(key).desc + '\n\nMembers :\n' + 
    //     (cards.get(key).members.length > 0 ? cards.get(key).members : 'No Members') + '\n\nLabels :\n' + (cards.get(key).labels.length > 0 ? cards.get(key).labels:'No Labels') +
    //     '\n\nActions On Card :\n');
    //     cards.get(key).actionsOnCard.forEach(element => {
    //         console.log(element.detail + ' on ' + element.date);
    //     });
    // });
    var str = `<div style="margin-left:2%"><p style="font-size:20px">No. Of Cards : <b>${cards.size}</b></p><p style="font-size:18px">Cards:-</p></div>
    <div style="customStyle"><table class="table table-bordered"><tr>
    <th>S.No.</th>
    <th>Card Name</th>
    <th>Current List</th>
    <th>Description</th>
    <th>Members</th>
    <th>Labels</th>
    <th>Created By</th>
    <th>Created On</th>
    <th>Last Activity</th>
    <th>Actions Taken On Card</th>
    </tr>`;
    var sno = 1;
    cards.forEach((value, key) => {
        let action = '<ul>';
        cards.get(key).actionsOnCard.forEach(element => {
            let date = new Date(element.date);
            let actionDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString();
            action += `<li>${element.detail} on ${actionDate}</li>`;
        });
        action += `</ul>`;
        str += `<tr>
        <td>${sno}</td>
        <td><a href="${cards.get(key).url}">${cards.get(key).name}</a></td>
        <td>${cards.get(key).list}</td>
        <td>${cards.get(key).desc}</td>
        <td>${cards.get(key).members.length > 0 ? cards.get(key).members : 'No Members'}</td>
        <td>${cards.get(key).labels.length > 0 ? cards.get(key).labels:'No Labels'}</td>
        <td>${cards.get(key).createdBy}</td>
        <td>${cards.get(key).createdOn}</td>
        <td>${cards.get(key).lastActivity}</td>
        <td>${action}</td>
        </tr>`;
        sno++;
    });
    str += `</table></div>`;
    divSummary.innerHTML += str;

    divSummary.innerHTML += `<hr />`;
    
}