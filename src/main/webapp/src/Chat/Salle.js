import Stomp from "stompjs";
import { useEffect } from 'react';
import { useParams } from "react-router-dom";

const React = require('react');
//var sockjs = require('sockjs-client');

function Salle() {
    const { idSalle } = useParams();
    document.title = "Chat | Salle" + idSalle;
    var ws = null;
    var myCanvas;

    function setConnected(connected) {
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility
            = connected ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
    }

    function connect() {
        ws = Stomp.client('ws://localhost:8080/chat');
        ws.debug = str => {
            //console.log(str);
        };

        ws.connect({}, function (frame) {
            setConnected(true);
            ws.subscribe('/topic/' + idSalle, function (messageOutput) {
                showMessageOutput(JSON.parse(messageOutput.body));
            });
        });
    }

    function disconnect() {
        if (ws != null) {
            ws.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    }

    function sendMessage() {
        var from = document.getElementById('from').value;
        var text = document.getElementById('text').value;
        ws.send("/app/chat/" + idSalle, {},
            JSON.stringify({ 'from': from, 'text': text }));
    }

    function showMessageOutput(messageOutput) {
        var response = document.getElementById('response');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.appendChild(document.createTextNode(messageOutput.from + ": "
            + messageOutput.text + " (" + messageOutput.time + ")"));
        response.appendChild(p);

        var image = new Image();
        image.onload = function () {
            myCanvas.getContext('2d').drawImage(image, 0, 0);
        };
        image.src = messageOutput.dataUrl;
    }

    useEffect(() => {
        disconnect();
        handleDrawing();
    }, []);

    return (
        <div>
            <div>
                <input type="text" id="from" placeholder="Choose a nickname" />
            </div>
            <br />
            <div>
                <button id="connect" onClick={connect}>Connect</button>
                <button id="disconnect" disabled="disabled" onClick={disconnect}>
                    Disconnect
                </button>
                <button id="clearDraw" onClick={clearDraw}>
                    Disconnect
                </button>
            </div>
            <br />
            <div style={{ display: "flex", gap: "1em" }}>

                <div id="conversationDiv" >

                    <input type="text" id="text" placeholder="Write a message..." />
                    <button id="sendMessage" onClick={sendMessage}>Send</button>
                    <p id="response"></p>
                </div>
                <div style={{ width: "600px", height: "300px" }} >
                    <canvas id="myCanvas">
                        Sorry, your browser does not support HTML5 canvas technology.
                    </canvas>
                </div>
            </div>

        </div>
    );

    function handleDrawing() {

        myCanvas = document.getElementById("myCanvas");
        var ctx = myCanvas.getContext("2d");

        // Fill Window Width and Height
        myCanvas.width = 600;
        myCanvas.height = 300;

        // Set Background Color
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        if (myCanvas) {
            var isDown = false;
            var canvasX, canvasY;
            ctx.lineWidth = 2;

            myCanvas.onmousedown = (e) => {
                isDown = true;
                ctx.beginPath();
                canvasX = e.pageX - myCanvas.offsetLeft;
                canvasY = e.pageY - myCanvas.offsetTop;
                ctx.moveTo(canvasX, canvasY);
            }
            myCanvas.onmousemove = (e) => {
                if (isDown !== false) {
                    canvasX = e.pageX - myCanvas.offsetLeft;
                    canvasY = e.pageY - myCanvas.offsetTop;
                    ctx.lineTo(canvasX, canvasY);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                }
            };
            myCanvas.onmouseup = (e) => {
                isDown = false;
                ctx.closePath();

                var from = document.getElementById('from').value;
                ws.send("/app/chat/" + idSalle, {},
                    JSON.stringify({ 'from': from, 'text': 'Dessin modifié', 'dataUrl': myCanvas.toDataURL() }));
            };
        }
        let draw = {
            started: false,
            start: function (evt) {

                ctx.beginPath();
                ctx.moveTo(
                    evt.touches[0].pageX,
                    evt.touches[0].pageY
                );

                this.started = true;

            },
            move: function (evt) {

                if (this.started) {
                    ctx.lineTo(
                        evt.touches[0].pageX,
                        evt.touches[0].pageY
                    );

                    ctx.strokeStyle = "#000";
                    ctx.lineWidth = 5;
                    ctx.stroke();
                }

            },
            end: function (evt) {
                this.started = false;
            }
        };

        myCanvas.addEventListener('touchstart', draw.start, false);
        myCanvas.addEventListener('touchend', draw.end, false);
        myCanvas.addEventListener('touchmove', draw.move, false);

        document.body.addEventListener('touchmove', function (evt) {
            evt.preventDefault();
        }, false);
    }

    function clearDraw() {
        var ctx = myCanvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    }
}

export default Salle;
