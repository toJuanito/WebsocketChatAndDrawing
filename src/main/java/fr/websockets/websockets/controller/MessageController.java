package fr.websockets.websockets.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import fr.websockets.websockets.bll.bo.Message;
import fr.websockets.websockets.bll.bo.OutputMessage;

@Controller
public class MessageController {

	@MessageMapping("/chat/{roomId}")
	@SendTo("/topic/{roomId}")
	public OutputMessage send(@DestinationVariable String roomId, Message message) throws Exception {
		System.out.println(roomId);
		String time = new SimpleDateFormat("HH:mm").format(new Date());
		return new OutputMessage(message.getFrom(), message.getText(), time, message.getDataUrl());
	}
}
