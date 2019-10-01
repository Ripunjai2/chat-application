const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

//Options
//const {userName,room}=Qs.parse(location.search,{ ignoreQueryprefix:true})
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')                  //we can use shorthand as using same name message
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomData',({room,users})=>{
     console.log('test');
    console.log(users);
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
    autoscroll();
})

socket.on('sendLocation', (shareLocation) => {
    console.log(shareLocation);
    const html = Mustache.render(locationTemplate, {
        username:shareLocation.username,
        shareLocation: shareLocation.url,
        createdAt: moment(shareLocation.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = document.querySelector('input').value//e.target.elements.message.value

    socket.emit('sendMessage', message, (msg) => {
        console.log('Message Delivered!! ' + msg);
    })


    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

})


$sendLocation.addEventListener('click', (e) => {

    $sendLocation.setAttribute('disabled', 'disabled');

    if (!navigator.geolocation) {
        alert('Your browser does not support geolocation. So either switch your browser or upgrade to the latest version')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.coords.latitude, position.coords.longitude);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude  
        }, (msg) => {
            console.log(msg);

            $sendLocation.removeAttribute('disabled');
        });
    })
})

 socket.emit('join', { username, room },(error)=>{
    if(error){  
        alert(error);
        location.href='/'
    }
 }) 